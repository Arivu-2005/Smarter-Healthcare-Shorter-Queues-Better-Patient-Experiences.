import React from 'react';
import { 
  Activity, 
  LayoutDashboard, 
  Calendar, 
  Clock, 
  Users, 
  Building2, 
  Tv, 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon,
  Bell,
  Sparkles
} from 'lucide-react';
import './Navbar.css';

const Navbar = ({ activeTab, setActiveTab, user, onLogout, isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const getNavItems = () => {
    if (!user) {
      return [
        { id: 'home', label: 'Home & Doctors', icon: Activity },
        { id: 'book-appointment', label: 'Book Appointment', icon: Calendar },
        { id: 'live-queue', label: 'Live Queue TV', icon: Tv },
        { id: 'contact', label: 'Hospital & Emergency', icon: Building2 },
        { id: 'login', label: 'Sign In / Register', icon: UserIcon }
      ];
    }

    if (user.role === 'patient') {
      return [
        { id: 'patient-dashboard', label: 'Patient Dashboard', icon: LayoutDashboard },
        { id: 'book-appointment', label: 'Book Appointment', icon: Calendar },
        { id: 'home', label: 'Find Doctors', icon: Activity },
        { id: 'live-queue', label: 'Live Queue TV', icon: Tv },
        { id: 'contact', label: 'Hospital Info', icon: Building2 }
      ];
    }

    if (user.role === 'doctor') {
      return [
        { id: 'doctor-dashboard', label: 'Doctor OPD Console', icon: LayoutDashboard },
        { id: 'live-queue', label: 'Live Queue TV', icon: Tv },
        { id: 'home', label: 'Hospital Directory', icon: Activity },
        { id: 'contact', label: 'Hospital Info', icon: Building2 }
      ];
    }

    if (user.role === 'receptionist') {
      return [
        { id: 'reception-dashboard', label: 'Front Desk OPD', icon: LayoutDashboard },
        { id: 'book-appointment', label: 'Book Appointment', icon: Calendar },
        { id: 'live-queue', label: 'Live Queue TV', icon: Tv },
        { id: 'home', label: 'Find Doctors', icon: Activity },
        { id: 'contact', label: 'Hospital Info', icon: Building2 }
      ];
    }

    if (user.role === 'admin') {
      return [
        { id: 'admin-dashboard', label: 'Hospital Overview', icon: LayoutDashboard },
        { id: 'home', label: 'Find Doctors', icon: Activity },
        { id: 'live-queue', label: 'Live Queue Display', icon: Tv },
        { id: 'contact', label: 'Hospital Info', icon: Building2 }
      ];
    }

    return [
      { id: 'home', label: 'Home & Doctors', icon: Activity },
      { id: 'live-queue', label: 'Live Queue TV', icon: Tv }
    ];
  };

  const navItems = getNavItems();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand" onClick={() => setActiveTab(user ? (user.role === 'patient' ? 'patient-dashboard' : `${user.role}-dashboard`) : 'home')}>
          <div className="logo-badge">
            <Activity className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <span className="brand-title">SmartHospital</span>
            <span className="brand-tagline">OPD & Queue OS</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Section / User info */}
        <div className="navbar-user-actions">
          {user ? (
            <div className="user-profile-pill">
              <div className="user-avatar-badge">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div className="user-details hide-sm">
                <span className="user-name">{user.name}</span>
                <span className="user-role-badge">{user.role}</span>
              </div>
              <button 
                onClick={onLogout} 
                className="logout-button"
                title="Log Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button 
              className="btn-signin-primary"
              onClick={() => setActiveTab('login')}
            >
              <UserIcon size={16} />
              <span>Portal Login</span>
            </button>
          )}

          {/* Mobile Menu Toggle Button */}
          <button 
            className="mobile-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="mobile-dropdown-menu">
          {user && (
            <div className="mobile-user-card">
              <div className="user-avatar-badge">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="mobile-user-name">{user.name}</p>
                <span className="user-role-badge">{user.role.toUpperCase()}</span>
              </div>
            </div>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsMobileMenuOpen(false);
                }}
                className={`mobile-nav-link ${isActive ? 'active' : ''}`}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
          {user && (
            <button 
              className="mobile-nav-link mobile-logout-link"
              onClick={() => {
                onLogout();
                setIsMobileMenuOpen(false);
              }}
            >
              <LogOut size={20} />
              <span>Sign Out</span>
            </button>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
