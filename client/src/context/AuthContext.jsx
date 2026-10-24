import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('hospital_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
          } else {
            logout();
          }
        } catch (err) {
          console.error('Failed to load user', err);
          logout();
        }
      }
      setLoading(false);
    };

    fetchCurrentUser();
  }, [token]);

  const demoUsers = {
    'patient@hospital.com': {
      id: 'demo-patient-1',
      name: 'John Doe',
      email: 'patient@hospital.com',
      role: 'patient',
      phone: '+1-555-0201',
      gender: 'male',
      age: 34,
      bloodGroup: 'O+'
    },
    'doctor@hospital.com': {
      id: 'demo-doctor-1',
      name: 'Dr. Sarah Mitchell, MD',
      email: 'doctor@hospital.com',
      role: 'doctor',
      phone: '+1-555-0111',
      specialization: 'Senior Interventional Cardiologist',
      department: 'Cardiology',
      roomNumber: 'Suite 204'
    },
    'receptionist@hospital.com': {
      id: 'demo-rec-1',
      name: 'Clara Oswald (Front Desk Lead)',
      email: 'receptionist@hospital.com',
      role: 'receptionist',
      phone: '+1-555-0002'
    },
    'admin@hospital.com': {
      id: 'demo-admin-1',
      name: 'Dr. Arthur Harrison (Chief Admin)',
      email: 'admin@hospital.com',
      role: 'admin',
      phone: '+1-555-0001'
    }
  };

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        localStorage.setItem('hospital_token', res.data.token);
        setToken(res.data.token);
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      // Fallback to offline demo credentials if deployed frontend is not connected to cloud backend
      if (demoUsers[email] && password === 'password123') {
        const fallbackUser = demoUsers[email];
        localStorage.setItem('hospital_token', 'demo_fallback_jwt_token_2026');
        setToken('demo_fallback_jwt_token_2026');
        setUser(fallbackUser);
        return fallbackUser;
      }
      throw err;
    }
  };

  const register = async (userData) => {
    const res = await api.post('/auth/register', userData);
    if (res.data.success) {
      localStorage.setItem('hospital_token', res.data.token);
      setToken(res.data.token);
      setUser(res.data.user);
      return res.data.user;
    }
  };

  const logout = () => {
    localStorage.removeItem('hospital_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
