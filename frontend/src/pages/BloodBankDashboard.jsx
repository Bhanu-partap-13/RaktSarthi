import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './BloodBankDashboard.css';

const BloodBankDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [bloodBank, setBloodBank] = useState(null);
  const [inventory, setInventory] = useState([
    { type: 'A+', units: 25, status: 'good' },
    { type: 'A-', units: 8, status: 'low' },
    { type: 'B+', units: 30, status: 'good' },
    { type: 'B-', units: 5, status: 'critical' },
    { type: 'AB+', units: 15, status: 'good' },
    { type: 'AB-', units: 3, status: 'critical' },
    { type: 'O+', units: 40, status: 'good' },
    { type: 'O-', units: 10, status: 'low' }
  ]);
  const [camps, setCamps] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCampModal, setShowCampModal] = useState(false);
  const [campForm, setCampForm] = useState({
    name: '',
    date: '',
    startTime: '09:00',
    endTime: '17:00',
    venue: '',
    address: '',
    city: '',
    targetUnits: 100,
    description: ''
  });

  useEffect(() => {
    // Check if blood bank is logged in
    const token = localStorage.getItem('bloodBankToken');
    const data = localStorage.getItem('bloodBankData');
    
    if (!token || !data) {
      navigate('/blood-bank/login');
      return;
    }

    setBloodBank(JSON.parse(data));
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Simulated data - in production, fetch from API
      setCamps([
        {
          id: 1,
          name: 'Community Blood Drive',
          date: '2024-02-15',
          venue: 'City Community Center',
          city: 'Mumbai',
          targetUnits: 100,
          collectedUnits: 45,
          status: 'upcoming'
        },
        {
          id: 2,
          name: 'Corporate Blood Camp',
          date: '2024-02-20',
          venue: 'Tech Park Auditorium',
          city: 'Mumbai',
          targetUnits: 75,
          collectedUnits: 0,
          status: 'scheduled'
        }
      ]);
      
      setRequests([
        {
          id: 1,
          patientName: 'John Doe',
          bloodType: 'O+',
          units: 2,
          hospital: 'City Hospital',
          urgency: 'high',
          status: 'pending',
          date: '2024-02-10'
        },
        {
          id: 2,
          patientName: 'Jane Smith',
          bloodType: 'A-',
          units: 1,
          hospital: 'Metro Medical',
          urgency: 'medium',
          status: 'pending',
          date: '2024-02-11'
        }
      ]);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('bloodBankToken');
    localStorage.removeItem('bloodBankData');
    navigate('/blood-bank/login');
  };

  const handleCampFormChange = (e) => {
    setCampForm({
      ...campForm,
      [e.target.name]: e.target.value
    });
  };

  const handleCreateCamp = async (e) => {
    e.preventDefault();
    try {
      // In production, send to API
      const newCamp = {
        id: camps.length + 1,
        ...campForm,
        collectedUnits: 0,
        status: 'scheduled'
      };
      setCamps([...camps, newCamp]);
      setShowCampModal(false);
      setCampForm({
        name: '',
        date: '',
        startTime: '09:00',
        endTime: '17:00',
        venue: '',
        address: '',
        city: '',
        targetUnits: 100,
        description: ''
      });
    } catch (error) {
      console.error('Error creating camp:', error);
    }
  };

  const updateInventory = (type, change) => {
    setInventory(prev => prev.map(item => {
      if (item.type === type) {
        const newUnits = Math.max(0, item.units + change);
        let status = 'good';
        if (newUnits <= 5) status = 'critical';
        else if (newUnits <= 10) status = 'low';
        return { ...item, units: newUnits, status };
      }
      return item;
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'good': return '#16a34a';
      case 'low': return '#f59e0b';
      case 'critical': return '#dc2626';
      default: return '#666';
    }
  };

  const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
  const criticalTypes = inventory.filter(item => item.status === 'critical').length;
  const upcomingCamps = camps.filter(camp => camp.status !== 'completed').length;

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner-large"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="blood-bank-dashboard">
      {/* Sidebar */}
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </div>
          <h2>{bloodBank?.name || 'Blood Bank'}</h2>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7"/>
              <rect x="14" y="3" width="7" height="7"/>
              <rect x="14" y="14" width="7" height="7"/>
              <rect x="3" y="14" width="7" height="7"/>
            </svg>
            Overview
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'inventory' ? 'active' : ''}`}
            onClick={() => setActiveTab('inventory')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5"/>
              <path d="M2 12l10 5 10-5"/>
            </svg>
            Inventory
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'camps' ? 'active' : ''}`}
            onClick={() => setActiveTab('camps')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Blood Camps
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            Requests
          </button>
          
          <button 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3"/>
              <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/>
            </svg>
            Settings
          </button>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-left">
            <h1>
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'inventory' && 'Blood Inventory'}
              {activeTab === 'camps' && 'Blood Camps'}
              {activeTab === 'requests' && 'Blood Requests'}
              {activeTab === 'settings' && 'Settings'}
            </h1>
            <p>Welcome back, {bloodBank?.name}</p>
          </div>
          <div className="header-right">
            <Link to="/" className="header-btn">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              Home
            </Link>
          </div>
        </header>

        <div className="dashboard-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="overview-content">
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #e63946, #d62828)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{totalUnits}</h3>
                    <p>Total Units</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{criticalTypes}</h3>
                    <p>Critical Types</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{upcomingCamps}</h3>
                    <p>Upcoming Camps</p>
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #3b82f6, #2563eb)' }}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 00-3-3.87"/>
                      <path d="M16 3.13a4 4 0 010 7.75"/>
                    </svg>
                  </div>
                  <div className="stat-info">
                    <h3>{requests.length}</h3>
                    <p>Pending Requests</p>
                  </div>
                </div>
              </div>

              <div className="overview-grid">
                <div className="overview-card">
                  <h3>Quick Inventory Status</h3>
                  <div className="mini-inventory">
                    {inventory.map(item => (
                      <div key={item.type} className="mini-inv-item">
                        <span className="blood-type">{item.type}</span>
                        <div className="inv-bar">
                          <div 
                            className="inv-bar-fill" 
                            style={{ 
                              width: `${Math.min(100, (item.units / 50) * 100)}%`,
                              background: getStatusColor(item.status)
                            }}
                          ></div>
                        </div>
                        <span className="units">{item.units}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="overview-card">
                  <h3>Upcoming Camps</h3>
                  <div className="mini-camps">
                    {camps.slice(0, 3).map(camp => (
                      <div key={camp.id} className="mini-camp-item">
                        <div className="camp-date">
                          <span className="day">{new Date(camp.date).getDate()}</span>
                          <span className="month">{new Date(camp.date).toLocaleString('default', { month: 'short' })}</span>
                        </div>
                        <div className="camp-info">
                          <h4>{camp.name}</h4>
                          <p>{camp.venue}, {camp.city}</p>
                        </div>
                      </div>
                    ))}
                    {camps.length === 0 && (
                      <p className="no-data">No upcoming camps</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Inventory Tab */}
          {activeTab === 'inventory' && (
            <div className="inventory-content">
              <div className="inventory-grid">
                {inventory.map(item => (
                  <div key={item.type} className="inventory-card">
                    <div className="inv-header">
                      <span className="blood-type-large">{item.type}</span>
                      <span className={`status-badge ${item.status}`}>{item.status}</span>
                    </div>
                    <div className="inv-units">{item.units} units</div>
                    <div className="inv-progress">
                      <div 
                        className="inv-progress-bar" 
                        style={{ 
                          width: `${Math.min(100, (item.units / 50) * 100)}%`,
                          background: getStatusColor(item.status)
                        }}
                      ></div>
                    </div>
                    <div className="inv-actions">
                      <button 
                        className="inv-btn minus"
                        onClick={() => updateInventory(item.type, -1)}
                      >
                        -
                      </button>
                      <button 
                        className="inv-btn plus"
                        onClick={() => updateInventory(item.type, 1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Camps Tab */}
          {activeTab === 'camps' && (
            <div className="camps-content">
              <div className="camps-header">
                <h2>Manage Blood Camps</h2>
                <button className="create-camp-btn" onClick={() => setShowCampModal(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="12" y1="5" x2="12" y2="19"/>
                    <line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Create New Camp
                </button>
              </div>

              <div className="camps-list">
                {camps.map(camp => (
                  <div key={camp.id} className="camp-card">
                    <div className="camp-card-header">
                      <h3>{camp.name}</h3>
                      <span className={`camp-status ${camp.status}`}>{camp.status}</span>
                    </div>
                    <div className="camp-details">
                      <div className="camp-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {new Date(camp.date).toLocaleDateString()}
                      </div>
                      <div className="camp-detail">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                        {camp.venue}, {camp.city}
                      </div>
                    </div>
                    <div className="camp-progress">
                      <div className="progress-text">
                        <span>Collected: {camp.collectedUnits} / {camp.targetUnits} units</span>
                        <span>{Math.round((camp.collectedUnits / camp.targetUnits) * 100)}%</span>
                      </div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(camp.collectedUnits / camp.targetUnits) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <div className="requests-content">
              <h2>Blood Requests</h2>
              <div className="requests-list">
                {requests.map(request => (
                  <div key={request.id} className="request-card">
                    <div className="request-header">
                      <span className="blood-type-badge">{request.bloodType}</span>
                      <span className={`urgency-badge ${request.urgency}`}>{request.urgency}</span>
                    </div>
                    <div className="request-details">
                      <p><strong>Patient:</strong> {request.patientName}</p>
                      <p><strong>Hospital:</strong> {request.hospital}</p>
                      <p><strong>Units Required:</strong> {request.units}</p>
                      <p><strong>Date:</strong> {new Date(request.date).toLocaleDateString()}</p>
                    </div>
                    <div className="request-actions">
                      <button className="action-btn approve">Approve</button>
                      <button className="action-btn reject">Reject</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="settings-content">
              <h2>Blood Bank Settings</h2>
              <p>Settings panel coming soon...</p>
            </div>
          )}
        </div>
      </main>

      {/* Create Camp Modal */}
      {showCampModal && (
        <div className="modal-overlay" onClick={() => setShowCampModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Create Blood Camp</h2>
              <button className="modal-close" onClick={() => setShowCampModal(false)}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateCamp} className="camp-form">
              <div className="form-group">
                <label>Camp Name</label>
                <input
                  type="text"
                  name="name"
                  value={campForm.name}
                  onChange={handleCampFormChange}
                  placeholder="Enter camp name"
                  required
                />
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    name="date"
                    value={campForm.date}
                    onChange={handleCampFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Target Units</label>
                  <input
                    type="number"
                    name="targetUnits"
                    value={campForm.targetUnits}
                    onChange={handleCampFormChange}
                    min="10"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Start Time</label>
                  <input
                    type="time"
                    name="startTime"
                    value={campForm.startTime}
                    onChange={handleCampFormChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>End Time</label>
                  <input
                    type="time"
                    name="endTime"
                    value={campForm.endTime}
                    onChange={handleCampFormChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Venue</label>
                <input
                  type="text"
                  name="venue"
                  value={campForm.venue}
                  onChange={handleCampFormChange}
                  placeholder="Venue name"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={campForm.address}
                    onChange={handleCampFormChange}
                    placeholder="Street address"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    name="city"
                    value={campForm.city}
                    onChange={handleCampFormChange}
                    placeholder="City"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={campForm.description}
                  onChange={handleCampFormChange}
                  placeholder="Camp description..."
                  rows="3"
                ></textarea>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowCampModal(false)} className="btn-cancel">
                  Cancel
                </button>
                <button type="submit" className="btn-submit">
                  Create Camp
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BloodBankDashboard;
