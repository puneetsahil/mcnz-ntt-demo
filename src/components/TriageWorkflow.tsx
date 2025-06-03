import React, { useState } from 'react';
import { Notification, TriageDecision, NTTOutcome, AIAnalysis } from '../types';
import { AITriageService } from '../services/aiTriage';

interface TriageWorkflowProps {
  notification: Notification;
  onDecisionMade: (decision: TriageDecision) => void;
}

export const TriageWorkflow: React.FC<TriageWorkflowProps> = ({ notification, onDecisionMade }) => {
  const [currentStep, setCurrentStep] = useState<'analysis' | 'review' | 'decision'>('analysis');
  const [aiAnalysis, setAiAnalysis] = useState<AIAnalysis | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<NTTOutcome | null>(null);
  const [humanReasoning, setHumanReasoning] = useState('');
  const [showDoctorResponse, setShowDoctorResponse] = useState(false);

  const runAIAnalysis = () => {
    const analysis = AITriageService.analyzeNotification(notification);
    setAiAnalysis(analysis);
    setSelectedOutcome(analysis.recommendedOutcome);
    setCurrentStep('review');
  };

  const makeDecision = () => {
    if (!selectedOutcome || !aiAnalysis) return;

    const decision: TriageDecision = {
      notificationId: notification.id,
      outcome: selectedOutcome,
      reasoning: humanReasoning || aiAnalysis.reasoningChain.join('. '),
      confidence: humanReasoning ? 0.95 : aiAnalysis.confidence,
      riskLevel: getRiskLevelFromScore(aiAnalysis.riskAssessment.overallRisk),
      recommendations: aiAnalysis.keyFactors.includes('Pattern of behavior suggested') 
        ? ['Review previous notifications', ...aiAnalysis.reasoningChain.slice(-1)]
        : aiAnalysis.reasoningChain.slice(-1),
      decidedBy: humanReasoning ? 'human' : 'ai',
      decidedAt: new Date().toISOString()
    };

    onDecisionMade(decision);
    setCurrentStep('decision');
  };

  const getRiskLevelFromScore = (score: number): 'low' | 'medium' | 'high' | 'critical' => {
    if (score >= 0.8) return 'critical';
    if (score >= 0.6) return 'high';
    if (score >= 0.4) return 'medium';
    return 'low';
  };

  const getOutcomeDescription = (outcome: NTTOutcome): string => {
    const descriptions = {
      'no_action': 'No further action required',
      'education': 'Provide educational guidance to doctor',
      'refer_council': 'Refer to full Council meeting',
      'refer_pcc': 'Refer to Professional Conduct Committee',
      'temporary_limitations': 'Implement temporary practice limitations'
    };
    return descriptions[outcome];
  };

  const getRiskColor = (level: string): string => {
    const colors = {
      'low': '#28a745',
      'medium': '#ffc107',
      'high': '#fd7e14',
      'critical': '#dc3545'
    };
    return colors[level as keyof typeof colors] || '#6c757d';
  };

  if (currentStep === 'analysis') {
    return (
      <div className="card">
        <h2>AI Analysis - Notification #{notification.id}</h2>
        <div className="workflow-step">
          <div className="step-number">1</div>
          <div className="step-content">
            <h3>Doctor Information</h3>
            <p><strong>Doctor:</strong> {notification.doctorName}</p>
            <p><strong>Registration:</strong> {notification.registrationNumber}</p>
            <p><strong>Incident Date:</strong> {notification.incidentDate}</p>
          </div>
        </div>

        <div className="workflow-step">
          <div className="step-number">2</div>
          <div className="step-content">
            <h3>Notification Details</h3>
            <p><strong>Referrer:</strong> {notification.referrer} ({notification.referrerType})</p>
            <p><strong>Category:</strong> {notification.category}</p>
            <p><strong>Severity:</strong> 
              <span className={`status-badge status-${notification.severity}`}>
                {notification.severity}
              </span>
            </p>
            {notification.urgency && (
              <p><strong>⚠️ Marked as urgent</strong></p>
            )}
            <div>
              <strong>Description:</strong>
              <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                {notification.description}
              </div>
            </div>
          </div>
        </div>

        <div className="workflow-step">
          <div className="step-number">3</div>
          <div className="step-content">
            <h3>Doctor Response Status</h3>
            {!showDoctorResponse ? (
              <div>
                <p>⏳ Awaiting doctor's response</p>
                <div style={{ 
                  padding: '16px', 
                  backgroundColor: '#e3f2fd', 
                  borderRadius: '4px',
                  border: '1px solid #2196f3',
                  marginTop: '12px'
                }}>
                  <p><strong>Natural Justice Requirement:</strong></p>
                  <p>We have requested a response from the doctor for the Council to act in accordance with the principles of natural justice and fulfilling our obligations under the Privacy Act 2020.</p>
                </div>
                <button 
                  className="btn btn-secondary" 
                  style={{ marginTop: '12px' }}
                  onClick={() => setShowDoctorResponse(true)}
                >
                  Simulate Doctor Response Received
                </button>
              </div>
            ) : (
              <div>
                <p>✅ Doctor response received</p>
                <div style={{ 
                  padding: '12px', 
                  backgroundColor: '#f8f9fa', 
                  borderRadius: '4px',
                  marginTop: '8px'
                }}>
                  <em>[Demo: Doctor's response would appear here explaining their perspective on the incident]</em>
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          className="btn btn-primary" 
          onClick={runAIAnalysis}
          disabled={!showDoctorResponse}
          style={{ marginTop: '20px' }}
        >
          {showDoctorResponse ? 'Run AI Analysis' : 'Waiting for Doctor Response'}
        </button>
      </div>
    );
  }

  if (currentStep === 'review' && aiAnalysis) {
    return (
      <div className="card">
        <h2>AI Analysis Results</h2>
        
        <div className="ai-recommendation">
          <h3>🤖 AI Recommendation</h3>
          <p><strong>Recommended Outcome:</strong> {getOutcomeDescription(aiAnalysis.recommendedOutcome)}</p>
          <p><strong>Confidence:</strong> {Math.round(aiAnalysis.confidence * 100)}%</p>
          <p><strong>Overall Risk Level:</strong> 
            <span style={{ 
              color: getRiskColor(getRiskLevelFromScore(aiAnalysis.riskAssessment.overallRisk)),
              fontWeight: 'bold',
              marginLeft: '8px'
            }}>
              {getRiskLevelFromScore(aiAnalysis.riskAssessment.overallRisk).toUpperCase()}
            </span>
          </p>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Risk Assessment</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            <div>
              <strong>Public Safety Risk:</strong>
              <div style={{ 
                width: '100%', 
                height: '20px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '4px'
              }}>
                <div style={{ 
                  width: `${aiAnalysis.riskAssessment.publicSafetyRisk * 100}%`,
                  height: '100%',
                  backgroundColor: getRiskColor(getRiskLevelFromScore(aiAnalysis.riskAssessment.publicSafetyRisk))
                }} />
              </div>
              <small>{Math.round(aiAnalysis.riskAssessment.publicSafetyRisk * 100)}%</small>
            </div>
            <div>
              <strong>Reputational Risk:</strong>
              <div style={{ 
                width: '100%', 
                height: '20px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '4px'
              }}>
                <div style={{ 
                  width: `${aiAnalysis.riskAssessment.reputationalRisk * 100}%`,
                  height: '100%',
                  backgroundColor: getRiskColor(getRiskLevelFromScore(aiAnalysis.riskAssessment.reputationalRisk))
                }} />
              </div>
              <small>{Math.round(aiAnalysis.riskAssessment.reputationalRisk * 100)}%</small>
            </div>
            <div>
              <strong>Recurrence Risk:</strong>
              <div style={{ 
                width: '100%', 
                height: '20px', 
                backgroundColor: '#e9ecef', 
                borderRadius: '10px',
                overflow: 'hidden',
                marginTop: '4px'
              }}>
                <div style={{ 
                  width: `${aiAnalysis.riskAssessment.recurenceRisk * 100}%`,
                  height: '100%',
                  backgroundColor: getRiskColor(getRiskLevelFromScore(aiAnalysis.riskAssessment.recurenceRisk))
                }} />
              </div>
              <small>{Math.round(aiAnalysis.riskAssessment.recurenceRisk * 100)}%</small>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Key Factors Identified</h3>
          <ul>
            {aiAnalysis.keyFactors.map((factor, index) => (
              <li key={index}>{factor}</li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>AI Reasoning Chain</h3>
          <ol>
            {aiAnalysis.reasoningChain.map((step, index) => (
              <li key={index} style={{ marginBottom: '8px' }}>{step}</li>
            ))}
          </ol>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Select NTT Decision</h3>
          <ul className="outcome-list">
            {(['no_action', 'education', 'refer_council', 'refer_pcc', 'temporary_limitations'] as NTTOutcome[]).map(outcome => (
              <li 
                key={outcome}
                className={`outcome-item ${selectedOutcome === outcome ? 'selected' : ''}`}
                onClick={() => setSelectedOutcome(outcome)}
              >
                <strong>{getOutcomeDescription(outcome)}</strong>
                {outcome === aiAnalysis.recommendedOutcome && (
                  <span style={{ color: '#28a745', marginLeft: '8px' }}>🤖 AI Recommended</span>
                )}
              </li>
            ))}
          </ul>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3>Additional Reasoning (Optional)</h3>
          <textarea
            value={humanReasoning}
            onChange={(e) => setHumanReasoning(e.target.value)}
            className="form-textarea"
            placeholder="Add any additional reasoning for this decision..."
          />
        </div>

        <button 
          className="btn btn-primary" 
          onClick={makeDecision}
          disabled={!selectedOutcome}
        >
          Finalize NTT Decision
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <h2>✅ Decision Complete</h2>
      <p>NTT decision has been recorded and will be processed according to MCNZ protocols.</p>
      <div style={{ 
        padding: '16px', 
        backgroundColor: '#d4edda', 
        borderRadius: '4px',
        border: '1px solid #c3e6cb'
      }}>
        <p><strong>Decision:</strong> {selectedOutcome ? getOutcomeDescription(selectedOutcome) : 'Unknown'}</p>
        <p><strong>Next Steps:</strong> The appropriate workflow will be initiated based on this decision.</p>
      </div>
    </div>
  );
};