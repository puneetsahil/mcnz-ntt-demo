import React, { useState } from 'react';
import { NotificationForm } from './components/NotificationForm';
import { TriageWorkflow } from './components/TriageWorkflow';
import { Notification, TriageDecision } from './types';
import { sampleNotifications } from './data/sampleNotifications';

function App() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [decisions, setDecisions] = useState<TriageDecision[]>([]);
  const [activeNotification, setActiveNotification] = useState<Notification | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'submit' | 'triage'>('dashboard');

  const handleNotificationSubmit = (notificationData: Omit<Notification, 'id' | 'status' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: `NOT-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString()
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setCurrentView('dashboard');
  };

  const loadSampleData = () => {
    const sampleNotifs = sampleNotifications.map((sample, index) => ({
      ...sample,
      id: `SAMPLE-${Date.now()}-${index}`,
      status: 'new' as const,
      createdAt: new Date(Date.now() - (index * 3600000)).toISOString() // Stagger times
    }));
    
    setNotifications(prev => [...sampleNotifs, ...prev]);
  };

  const handleDecisionMade = (decision: TriageDecision) => {
    setDecisions(prev => [decision, ...prev]);
    setNotifications(prev => 
      prev.map(n => 
        n.id === decision.notificationId 
          ? { ...n, status: 'decided' as const }
          : n
      )
    );
    setActiveNotification(null);
    setCurrentView('dashboard');
  };

  const startTriage = (notification: Notification) => {
    setActiveNotification(notification);
    setNotifications(prev => 
      prev.map(n => 
        n.id === notification.id 
          ? { ...n, status: 'under_review' as const }
          : n
      )
    );
    setCurrentView('triage');
  };

  const getStatusColor = (status: string): string => {
    const colors = {
      'new': '#007bff',
      'awaiting_response': '#ffc107',
      'under_review': '#17a2b8',
      'decided': '#28a745'
    };
    return colors[status as keyof typeof colors] || '#6c757d';
  };

  const getOutcomeDescription = (outcome: string): string => {
    const descriptions = {
      'no_action': 'No Action Required',
      'education': 'Educational Guidance',
      'refer_council': 'Referred to Council',
      'refer_pcc': 'Referred to PCC',
      'temporary_limitations': 'Practice Limitations'
    };
    return descriptions[outcome as keyof typeof descriptions] || outcome;
  };

  if (currentView === 'submit') {
    return (
      <div className="container">
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1>MCNZ Notifications Triage Team</h1>
          <nav style={{ marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={() => setCurrentView('dashboard')}>
              ← Back to Dashboard
            </button>
          </nav>
        </header>
        <NotificationForm onSubmit={handleNotificationSubmit} />
      </div>
    );
  }

  if (currentView === 'triage' && activeNotification) {
    return (
      <div className="container">
        <header style={{ marginBottom: '30px', textAlign: 'center' }}>
          <h1>MCNZ Notifications Triage Team</h1>
          <nav style={{ marginTop: '20px' }}>
            <button className="btn btn-secondary" onClick={() => {
              setCurrentView('dashboard');
              setActiveNotification(null);
            }}>
              ← Back to Dashboard
            </button>
          </nav>
        </header>
        <TriageWorkflow 
          notification={activeNotification} 
          onDecisionMade={handleDecisionMade}
        />
      </div>
    );
  }

  return (
    <div className="container">
      <header style={{ marginBottom: '30px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
          <img 
            src="/mcnz-logo.svg" 
            alt="MCNZ Logo" 
            style={{ height: '60px', marginRight: '20px' }}
          />
          <div style={{ textAlign: 'left' }}>
            <h1 style={{ margin: '0', fontSize: '28px' }}>MCNZ Notifications Triage Team</h1>
            <p style={{ color: '#6c757d', fontSize: '16px', margin: '4px 0 0 0' }}>
              AI-Assisted Notification Triage System
            </p>
          </div>
        </div>
        <nav style={{ marginTop: '20px' }}>
          <button 
            className="btn btn-primary" 
            onClick={() => setCurrentView('submit')}
            style={{ marginRight: '10px' }}
          >
            Submit New Notification
          </button>
          {notifications.length === 0 && (
            <button 
              className="btn btn-secondary" 
              onClick={loadSampleData}
            >
              Load Sample Data
            </button>
          )}
        </nav>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div className="card">
          <h2>Pending Notifications ({notifications.filter(n => n.status !== 'decided').length})</h2>
          {notifications.filter(n => n.status !== 'decided').length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
              No pending notifications. Submit a new notification to begin the triage process.
            </p>
          ) : (
            <div>
              {notifications.filter(n => n.status !== 'decided').map(notification => (
                <div 
                  key={notification.id}
                  style={{ 
                    padding: '16px', 
                    border: '1px solid #ddd', 
                    borderRadius: '4px', 
                    marginBottom: '12px' 
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: '0 0 8px 0' }}>#{notification.id}</h4>
                      <p style={{ margin: '4px 0' }}>
                        <strong>Doctor:</strong> {notification.doctorName}
                      </p>
                      <p style={{ margin: '4px 0' }}>
                        <strong>Category:</strong> {notification.category}
                      </p>
                      <p style={{ margin: '4px 0' }}>
                        <strong>Severity:</strong> 
                        <span className={`status-badge status-${notification.severity}`} style={{ marginLeft: '8px' }}>
                          {notification.severity}
                        </span>
                      </p>
                      <div style={{ 
                        backgroundColor: getStatusColor(notification.status),
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        display: 'inline-block',
                        marginTop: '8px'
                      }}>
                        {notification.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div>
                      {notification.status === 'new' && (
                        <button 
                          className="btn btn-primary"
                          onClick={() => startTriage(notification)}
                          style={{ fontSize: '12px' }}
                        >
                          Start Triage
                        </button>
                      )}
                      {notification.status === 'under_review' && (
                        <button 
                          className="btn btn-warning"
                          onClick={() => startTriage(notification)}
                          style={{ fontSize: '12px' }}
                        >
                          Continue Review
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Recent Decisions ({decisions.length})</h2>
          {decisions.length === 0 ? (
            <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
              No decisions made yet. Complete a triage to see decisions here.
            </p>
          ) : (
            <div>
              {decisions.slice(0, 5).map(decision => {
                const notification = notifications.find(n => n.id === decision.notificationId);
                return (
                  <div 
                    key={decision.notificationId}
                    style={{ 
                      padding: '16px', 
                      border: '1px solid #ddd', 
                      borderRadius: '4px', 
                      marginBottom: '12px' 
                    }}
                  >
                    <h4 style={{ margin: '0 0 8px 0' }}>#{decision.notificationId}</h4>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Doctor:</strong> {notification?.doctorName || 'Unknown'}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Decision:</strong> {getOutcomeDescription(decision.outcome)}
                    </p>
                    <p style={{ margin: '4px 0' }}>
                      <strong>Risk Level:</strong> 
                      <span style={{ 
                        color: decision.riskLevel === 'critical' ? '#dc3545' : 
                              decision.riskLevel === 'high' ? '#fd7e14' :
                              decision.riskLevel === 'medium' ? '#ffc107' : '#28a745',
                        fontWeight: 'bold',
                        marginLeft: '8px'
                      }}>
                        {decision.riskLevel.toUpperCase()}
                      </span>
                    </p>
                    <div style={{ margin: '4px 0' }}>
                      {decision.aiRecommendation && (
                        <div style={{ marginBottom: '8px' }}>
                          <p style={{ margin: '0 0 4px 0' }}>
                            <strong>AI Suggested:</strong> {getOutcomeDescription(decision.aiRecommendation.outcome)} ({Math.round(decision.aiRecommendation.confidence * 100)}% confidence)
                          </p>
                          <p style={{ margin: '0', fontSize: '12px', color: '#6c757d', fontStyle: 'italic' }}>
                            {decision.aiRecommendation.reasoning.split('. ').slice(0, 2).join('. ')}.
                          </p>
                        </div>
                      )}
                      <p style={{ margin: '0 0 4px 0' }}>
                        <strong>Final Decision:</strong> {getOutcomeDescription(decision.outcome)}
                        {decision.aiRecommendation && decision.outcome !== decision.aiRecommendation.outcome && (
                          <span style={{ color: '#fd7e14', marginLeft: '8px', fontSize: '12px' }}>
                            👨‍⚕️ Human Override
                          </span>
                        )}
                      </p>
                    </div>
                    <div style={{ 
                      fontSize: '12px',
                      color: '#6c757d',
                      marginTop: '8px'
                    }}>
                      {new Date(decision.decidedAt).toLocaleString()}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h2>Demo Information</h2>
        <div style={{ 
          padding: '16px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '4px',
          border: '1px solid #e9ecef'
        }}>
          <h3>About This Demo</h3>
          <p>
            This demonstration shows how AI can assist the MCNZ Notifications Triage Team in processing 
            fitness to practice notifications. The system:
          </p>
          <ul>
            <li>Accepts notification submissions with detailed incident information</li>
            <li>Ensures natural justice principles by requesting doctor responses</li>
            <li>Uses AI to analyze risk factors and recommend appropriate outcomes</li>
            <li>Provides transparent reasoning for all recommendations</li>
            <li>Keeps humans in the loop for final decision-making</li>
          </ul>
          <p>
            <strong>Key Features:</strong> Risk assessment, pattern recognition, outcome prediction, 
            confidence scoring, and decision audit trails.
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;