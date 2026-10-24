import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import LiveQueueDisplay from './pages/LiveQueueDisplay';
import BookAppointment from './pages/BookAppointment';
import PatientDashboard from './pages/PatientDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import ReceptionDashboard from './pages/ReceptionDashboard';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';
import Contact from './pages/Contact';
import api from './services/api';
import './styles/index.css';
import './App.css';

const MainApp = () => {
  const { user, logout, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Hospital Core Catalogs
  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [preselectedDoctor, setPreselectedDoctor] = useState(null);

  useEffect(() => {
    const fetchCatalogs = async () => {
      try {
        const [deptRes, docRes] = await Promise.all([
          api.get('/departments'),
          api.get('/doctors')
        ]);
        if (deptRes.data.success) setDepartments(deptRes.data.departments);
        if (docRes.data.success) setDoctors(docRes.data.doctors);
      } catch (err) {
        console.error('Error fetching departments & doctors:', err);
      }
    };
    fetchCatalogs();
  }, []);

  // Sync active view based on user logged in state
  useEffect(() => {
    if (user && activeTab === 'login') {
      if (user.role === 'patient') setActiveTab('patient-dashboard');
      else if (user.role === 'doctor') setActiveTab('doctor-dashboard');
      else if (user.role === 'receptionist') setActiveTab('reception-dashboard');
      else if (user.role === 'admin') setActiveTab('admin-dashboard');
    }
  }, [user]);

  const handleSelectDoctorFromHome = (doctor) => {
    setPreselectedDoctor(doctor);
    setActiveTab('book-appointment');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'home':
        return (
          <Home 
            setActiveTab={setActiveTab} 
            departments={departments} 
            doctors={doctors}
            onSelectDoctor={handleSelectDoctorFromHome}
          />
        );
      case 'live-queue':
        return <LiveQueueDisplay departments={departments} />;
      case 'book-appointment':
        return (
          <BookAppointment 
            user={user}
            departments={departments} 
            doctors={doctors} 
            preselectedDoctor={preselectedDoctor}
            setActiveTab={setActiveTab}
          />
        );
      case 'patient-dashboard':
        return <PatientDashboard user={user} setActiveTab={setActiveTab} />;
      case 'doctor-dashboard':
        return <DoctorDashboard user={user} />;
      case 'reception-dashboard':
        return (
          <ReceptionDashboard 
            departments={departments} 
            doctors={doctors} 
            setActiveTab={setActiveTab}
          />
        );
      case 'admin-dashboard':
      case 'departments':
      case 'patients-list':
        return (
          <AdminDashboard 
            departments={departments} 
            doctors={doctors} 
            setActiveTab={setActiveTab}
          />
        );
      case 'login':
        return <Login setActiveTab={setActiveTab} />;
      case 'contact':
        return <Contact />;
      default:
        return (
          <Home 
            setActiveTab={setActiveTab} 
            departments={departments} 
            doctors={doctors}
            onSelectDoctor={handleSelectDoctorFromHome}
          />
        );
    }
  };

  return (
    <div className="app-layout">
      <Navbar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={logout}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <main className="app-main-content">
        {renderActiveView()}
      </main>

      <footer className="hospital-footer">
        <div className="footer-container">
          <div className="footer-col">
            <h4>Smart Hospital OPD OS</h4>
            <p>Digital appointment booking, multi-clinic token orchestration, and real-time live queue monitoring.</p>
          </div>
          <div className="footer-col">
            <h4>Demo Role Switches</h4>
            <div className="footer-links">
              <span onClick={() => setActiveTab('login')}>Switch User Profile / Demo Logins</span>
              <span onClick={() => setActiveTab('live-queue')}>Public Queue TV Kiosk</span>
            </div>
          </div>
          <div className="footer-col">
            <h4>OPD Help & Emergency</h4>
            <p>Helpdesk: +1-800-SMART-CARE | Emergency Code Blue: 911</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
