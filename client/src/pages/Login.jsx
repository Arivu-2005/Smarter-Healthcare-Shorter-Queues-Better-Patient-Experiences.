import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  Phone, 
  AlertCircle, 
  ArrowRight, 
  ShieldCheck,
  Stethoscope,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = ({ setActiveTab }) => {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('patient@hospital.com');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('patient');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password, phone, role });
      } else {
        await login(email, password);
      }
      setActiveTab('home');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoSelect = (demoEmail, demoRole) => {
    setEmail(demoEmail);
    setPassword('password123');
    setRole(demoRole);
    setIsRegister(false);
  };

  return (
    <div className="login-page-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-icon-box">
            <ShieldCheck size={28} />
          </div>
          <h1>{isRegister ? 'Patient Registration' : 'Hospital Portal Login'}</h1>
          <p>{isRegister ? 'Create an OPD profile to book appointments and track tokens' : 'Sign in to access your role-based dashboard'}</p>
        </div>

        {/* Quick Demo Switcher Pills */}
        <div className="demo-accounts-pill-box">
          <span className="demo-hint-title">1-Click Demo Logins:</span>
          <div className="demo-buttons-row">
            <button 
              type="button" 
              className={`demo-btn ${email === 'patient@hospital.com' ? 'active' : ''}`}
              onClick={() => handleDemoSelect('patient@hospital.com', 'patient')}
            >
              Patient
            </button>
            <button 
              type="button" 
              className={`demo-btn ${email === 'doctor@hospital.com' ? 'active' : ''}`}
              onClick={() => handleDemoSelect('doctor@hospital.com', 'doctor')}
            >
              Doctor
            </button>
            <button 
              type="button" 
              className={`demo-btn ${email === 'receptionist@hospital.com' ? 'active' : ''}`}
              onClick={() => handleDemoSelect('receptionist@hospital.com', 'receptionist')}
            >
              Receptionist
            </button>
            <button 
              type="button" 
              className={`demo-btn ${email === 'admin@hospital.com' ? 'active' : ''}`}
              onClick={() => handleDemoSelect('admin@hospital.com', 'admin')}
            >
              Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="login-error-alert">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <div className="auth-input-group">
                <label>Full Name</label>
                <div className="input-with-icon">
                  <User size={18} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div className="auth-input-group">
                <label>Phone Number</label>
                <div className="input-with-icon">
                  <Phone size={18} />
                  <input
                    type="text"
                    placeholder="+1 555-0199"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>
            </>
          )}

          <div className="auth-input-group">
            <label>Email Address</label>
            <div className="input-with-icon">
              <Mail size={18} />
              <input
                type="email"
                required
                placeholder="you@hospital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>
            <div className="input-with-icon">
              <Lock size={18} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-auth-submit">
            <span>{loading ? 'Authenticating...' : isRegister ? 'Create Account' : 'Sign In to OPD System'}</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div className="auth-toggle-footer">
          <span>{isRegister ? 'Already have an account?' : "Don't have an account?"}</span>
          <button 
            type="button" 
            className="btn-toggle-link"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Sign In Here' : 'Register as Patient'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
