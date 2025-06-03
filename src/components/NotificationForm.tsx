import React, { useState } from 'react';
import { Notification } from '../types';

interface NotificationFormProps {
  onSubmit: (notification: Omit<Notification, 'id' | 'status' | 'createdAt'>) => void;
}

export const NotificationForm: React.FC<NotificationFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    referrer: '',
    referrerType: 'colleague' as const,
    doctorName: '',
    registrationNumber: '',
    incidentDate: '',
    description: '',
    severity: 'medium' as const,
    category: 'conduct' as const,
    urgency: false
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      referrer: '',
      referrerType: 'colleague',
      doctorName: '',
      registrationNumber: '',
      incidentDate: '',
      description: '',
      severity: 'medium',
      category: 'conduct',
      urgency: false
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="card">
      <h2>Submit New Notification</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Referrer Name:</label>
          <input
            type="text"
            name="referrer"
            value={formData.referrer}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Referrer Type:</label>
          <select
            name="referrerType"
            value={formData.referrerType}
            onChange={handleChange}
            className="form-input"
          >
            <option value="colleague">Colleague</option>
            <option value="employer">Employer</option>
            <option value="ministry">Ministry of Health</option>
            <option value="acc">ACC</option>
            <option value="patient">Patient</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Doctor Name:</label>
          <input
            type="text"
            name="doctorName"
            value={formData.doctorName}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Registration Number:</label>
          <input
            type="text"
            name="registrationNumber"
            value={formData.registrationNumber}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Incident Date:</label>
          <input
            type="date"
            name="incidentDate"
            value={formData.incidentDate}
            onChange={handleChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="form-input"
          >
            <option value="conduct">Professional Conduct</option>
            <option value="competence">Competence</option>
            <option value="health">Health</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Severity:</label>
          <select
            name="severity"
            value={formData.severity}
            onChange={handleChange}
            className="form-input"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Description of Incident:</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="form-textarea"
            placeholder="Provide detailed description of the incident or concern..."
            required
          />
        </div>

        <div className="form-group">
          <label>
            <input
              type="checkbox"
              name="urgency"
              checked={formData.urgency}
              onChange={handleChange}
            />
            {' '}Urgent - Immediate risk to public safety
          </label>
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Notification
        </button>
      </form>
    </div>
  );
};