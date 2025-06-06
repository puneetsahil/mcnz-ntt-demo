import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: (success: boolean) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate authentication delay
    setTimeout(() => {
      if (username === 'optimation' && password === '0pt1mat10n') {
        onLogin(true);
      } else {
        setError('Invalid username or password');
        onLogin(false);
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f5f5f5'
    }}>
      <div className="card" style={{ width: '400px', maxWidth: '90vw' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <div style={{ 
            width: '80px', 
            height: '60px', 
            backgroundColor: '#003366', 
            borderRadius: '8px',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 20px',
            flexDirection: 'column'
          }}>
            <div style={{ 
              width: '30px', 
              height: '30px', 
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{ 
                width: '6px', 
                height: '20px', 
                backgroundColor: '#ffffff',
                position: 'absolute'
              }}></div>
              <div style={{ 
                width: '20px', 
                height: '6px', 
                backgroundColor: '#ffffff',
                position: 'absolute'
              }}></div>
            </div>
            <div style={{ 
              color: '#ffffff', 
              fontSize: '10px', 
              fontWeight: 'bold',
              marginTop: '4px'
            }}>MEDI</div>
          </div>
          <h2 style={{ margin: '0 0 8px 0' }}>Medical Council NTT</h2>
          <p style={{ color: '#6c757d', margin: '0' }}>AI-Assisted Notification Triage System</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              placeholder="Enter username"
              required
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              placeholder="Enter password"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              padding: '10px',
              backgroundColor: '#f8d7da',
              color: '#721c24',
              border: '1px solid #f5c6cb',
              borderRadius: '4px',
              marginBottom: '16px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
            style={{ 
              width: '100%',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: '#e3f2fd',
          borderRadius: '4px',
          border: '1px solid #2196f3'
        }}>
          <p style={{ margin: '0', fontSize: '14px', color: '#1976d2' }}>
            <strong>Demo Access:</strong>
          </p>
          <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6c757d' }}>
            This is a demonstration system. Please contact your administrator for access credentials.
          </p>
        </div>
      </div>
    </div>
  );
};