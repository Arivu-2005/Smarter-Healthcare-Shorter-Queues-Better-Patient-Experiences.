import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  PhoneCall, 
  Mail, 
  Clock, 
  AlertTriangle, 
  Send, 
  CheckCircle,
  ShieldCheck,
  CalendarCheck
} from 'lucide-react';
import './Contact.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: 'General Inquiry',
        message: ''
      });
    }, 5000);
  };

  return (
    <div className="contact-page-container">
      {/* Emergency Guidance Banner */}
      <div className="emergency-guidance-banner">
        <div className="emergency-icon-pulse">
          <AlertTriangle size={24} />
        </div>
        <div className="emergency-text">
          <h3>Medical Emergency? Immediate Attention Required?</h3>
          <p>
            Please call our dedicated Emergency Trauma Hotline immediately at <strong>+1-800-SMART-CARE</strong> or <strong>911</strong>. Emergency & Casualty Wing A is open <strong>24/7/365</strong> with rapid-intake triage.
          </p>
        </div>
      </div>

      <div className="contact-main-grid">
        {/* Hospital Details Info */}
        <div className="contact-info-card">
          <div className="contact-brand-header">
            <div className="contact-brand-icon">
              <Building2 size={24} />
            </div>
            <div>
              <h2>Smart Hospital Campus</h2>
              <p>Center for Outpatient & Clinical Excellence</p>
            </div>
          </div>

          <div className="info-blocks-list">
            <div className="info-block">
              <div className="info-icon">
                <MapPin size={20} />
              </div>
              <div className="info-content">
                <h4>Hospital Location</h4>
                <p>742 Evergreen Healthcare Blvd, Medical District</p>
                <span>Metro Station Exit 3 • Dedicated Ambulatory Parking (Wing B)</span>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">
                <Clock size={20} />
              </div>
              <div className="info-content">
                <h4>Operating & OPD Hours</h4>
                <p><strong>OPD Consultations:</strong> Mon - Sat: 08:30 AM – 06:30 PM</p>
                <p><strong>Triage & Pharmacy:</strong> 24 Hours Open</p>
                <p><strong>Diagnostics & Lab:</strong> Mon - Sun: 07:00 AM – 09:00 PM</p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">
                <PhoneCall size={20} />
              </div>
              <div className="info-content">
                <h4>Direct Phone Lines</h4>
                <p><strong>OPD Token & Appointments:</strong> +1 (555) 019-9000</p>
                <p><strong>Billing & Insurance Desk:</strong> +1 (555) 019-9004</p>
                <p><strong>Chief Medical Admin:</strong> +1 (555) 019-9010</p>
              </div>
            </div>

            <div className="info-block">
              <div className="info-icon">
                <Mail size={20} />
              </div>
              <div className="info-content">
                <h4>Electronic Correspondence</h4>
                <p><strong>General Support:</strong> care@smarthospital.org</p>
                <p><strong>Patient Feedback:</strong> feedback@smarthospital.org</p>
              </div>
            </div>
          </div>

          <div className="accreditation-footer">
            <ShieldCheck size={18} className="shield-icon" />
            <span>JCI Accredited & HIPAA-Compliant Healthcare Infrastructure</span>
          </div>
        </div>

        {/* Contact / Inquiries Form */}
        <div className="contact-form-card">
          <h2>Send a Patient Inquiry or Feedback</h2>
          <p className="form-subtext">Have a question regarding OPD consultations, insurance claims, or visiting hours? We reply within 2 business hours.</p>

          {submitted ? (
            <div className="contact-success-alert">
              <CheckCircle size={32} />
              <div>
                <h4>Message Transmitted Successfully!</h4>
                <p>Our Patient Coordination Team has received your inquiry and will contact you via email/phone shortly.</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Your Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Eleanor Vance"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. eleanor@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Subject / Department</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  >
                    <option value="General Inquiry">General OPD Inquiry</option>
                    <option value="Appointment Support">Appointment & Queue Assistance</option>
                    <option value="Billing & Insurance">Billing & Insurance Queries</option>
                    <option value="Patient Feedback">Patient Care Feedback</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Your Message or Inquiry Details *</label>
                <textarea
                  rows={5}
                  required
                  placeholder="How can our healthcare coordination team assist you today?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button type="submit" className="btn-send-inquiry">
                <Send size={18} />
                <span>Submit Inquiry</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
