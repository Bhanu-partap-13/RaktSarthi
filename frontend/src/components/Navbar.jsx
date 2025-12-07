import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);

  // Sample notifications based on blood group matching
  useEffect(() => {
    if (user && user.bloodGroup) {
      // Simulated notifications for blood group matching
      setNotifications([
        { id: 1, message: `A donor with ${user.bloodGroup} blood is available nearby`, time: '5 min ago', read: false },
        { id: 2, message: `Blood camp at LPU needs ${user.bloodGroup} donors`, time: '1 hour ago', read: false },
        { id: 3, message: 'Your last donation was 3 months ago. You can donate again!', time: '2 days ago', read: true },
      ]);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{marginRight: '8px', verticalAlign: 'middle'}}>
            <path d="M10 2C10 2 5 7.5 5 12C5 14.7614 7.23858 17 10 17C12.7614 17 15 14.7614 15 12C15 7.5 10 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="#ef4444"/>
          </svg>
          RTBMS
        </Link>
        
        <ul className="navbar-menu">
          <li>
            <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/blood-banks" className={location.pathname === '/blood-banks' ? 'active' : ''}>
              Blood Banks
            </Link>
          </li>
          <li>
            <Link to="/donors" className={location.pathname === '/donors' ? 'active' : ''}>
              Find Donors
            </Link>
          </li>
          <li>
            <Link to="/events" className={location.pathname === '/events' ? 'active' : ''}>
              Events
            </Link>
          </li>
          <li>
            <Link to="/create-request" className={location.pathname === '/create-request' ? 'active' : ''}>
              Request Blood
            </Link>
          </li>
          <li>
            <Link to="/donor-form" className={location.pathname === '/donor-form' ? 'active' : ''}>
              Donor Form
            </Link>
          </li>
        </ul>

        <div className="navbar-actions">
          {/* Notifications Bell */}
          <div className="notification-dropdown" onMouseLeave={() => setShowNotifications(false)}>
            <button 
              className="notification-btn"
              onMouseEnter={() => setShowNotifications(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 01-3.46 0"/>
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-badge">{notifications.filter(n => !n.read).length}</span>
              )}
            </button>
            {showNotifications && (
              <div className="notification-menu">
                <div className="notification-header">
                  <h4>Notifications</h4>
                </div>
                {notifications.length === 0 ? (
                  <div className="notification-empty">No notifications</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} className={`notification-item ${!notif.read ? 'unread' : ''}`}>
                      <div className="notification-icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                          <path d="M12 2C12 2 7 7.5 7 12C7 14.7614 9.23858 17 12 17C14.7614 17 17 14.7614 17 12C17 7.5 12 2 12 2Z" fill={!notif.read ? '#e63946' : '#ccc'}/>
                        </svg>
                      </div>
                      <div className="notification-content">
                        <p>{notif.message}</p>
                        <span className="notification-time">{notif.time}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="profile-dropdown" onMouseLeave={() => setShowDropdown(false)}>
            <button 
              className="btn btn-outline profile-btn"
              onMouseEnter={() => setShowDropdown(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              {user?.name || 'Profile'}
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                  My Profile
                </Link>
                <Link to="/donor-form" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="12" y1="18" x2="12" y2="12"/>
                    <line x1="9" y1="15" x2="15" y2="15"/>
                  </svg>
                  Donor Form
                </Link>
                <div className="dropdown-divider"></div>
                <Link to="/blood-bank/login" className="dropdown-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                    <polyline points="9 22 9 12 15 12 15 22"/>
                  </svg>
                  Blood Bank Portal
                </Link>
                <div className="dropdown-divider"></div>
                <button onClick={handleLogout} className="dropdown-item logout-item">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .navbar-actions {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        
        .notification-dropdown {
          position: relative;
        }
        
        .notification-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          position: relative;
          padding: 0.5rem;
          border-radius: 50%;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-btn:hover {
          background: rgba(230, 57, 70, 0.1);
        }
        
        .notification-btn svg {
          color: #333;
        }
        
        .notification-badge {
          position: absolute;
          top: 0;
          right: 0;
          background: #e63946;
          color: white;
          font-size: 0.7rem;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 10px;
          min-width: 18px;
          text-align: center;
        }
        
        .notification-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 320px;
          max-height: 400px;
          overflow-y: auto;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        .notification-header {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .notification-header h4 {
          margin: 0;
          font-size: 1rem;
          color: #333;
        }
        
        .notification-empty {
          padding: 2rem;
          text-align: center;
          color: #999;
        }
        
        .notification-item {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid #f0f0f0;
          transition: all 0.2s;
        }
        
        .notification-item:hover {
          background: #f8f9fa;
        }
        
        .notification-item.unread {
          background: #fff5f5;
        }
        
        .notification-icon {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          background: #f0f0f0;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .notification-content {
          flex: 1;
        }
        
        .notification-content p {
          margin: 0 0 0.25rem 0;
          font-size: 0.9rem;
          color: #333;
        }
        
        .notification-time {
          font-size: 0.75rem;
          color: #999;
        }
        
        .profile-dropdown {
          position: relative;
        }
        
        .profile-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          right: 0;
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          padding: 0.5rem;
          z-index: 1000;
          animation: fadeIn 0.2s ease;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          color: #333;
          text-decoration: none;
          border-radius: 8px;
          transition: all 0.2s ease;
          border: none;
          background: none;
          width: 100%;
          font-size: 0.95rem;
          cursor: pointer;
        }
        
        .dropdown-item:hover {
          background: #f5f5f5;
          color: #e63946;
        }
        
        .dropdown-item svg {
          width: 18px;
          height: 18px;
        }
        
        .dropdown-divider {
          height: 1px;
          background: #eee;
          margin: 0.5rem 0;
        }
        
        .logout-item {
          color: #dc2626;
        }
        
        .logout-item:hover {
          background: #fee2e2;
          color: #dc2626;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
