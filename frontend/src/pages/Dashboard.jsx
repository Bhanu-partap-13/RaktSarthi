import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { requestAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const [requests, setRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [allRequestsRes, myRequestsRes] = await Promise.all([
        requestAPI.getAll({ status: 'pending' }),
        requestAPI.getMyRequests(),
      ]);
      
      setRequests(allRequestsRes.data);
      setMyRequests(myRequestsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this request?')) {
      return;
    }

    try {
      console.log('Cancelling request:', requestId);
      const response = await requestAPI.updateStatus(requestId, 'cancelled');
      console.log('Cancel response:', response.data);
      setMessage({ type: 'success', text: 'Request cancelled successfully!' });
      fetchData(); // Refresh the data
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    } catch (error) {
      console.error('Cancel request error:', error.response?.data || error.message);
      const errorMessage = error.response?.data?.message || error.response?.data?.error || 'Failed to cancel request';
      setMessage({ type: 'error', text: errorMessage });
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const getUrgencyClass = (urgency) => {
    return `status-badge status-${urgency}`;
  };

  const renderRequests = (requestList, isMyRequests = false) => {
    if (requestList.length === 0) {
      return (
        <div className="empty-state">
          <p>No blood requests found.</p>
        </div>
      );
    }

    return requestList.map((request) => (
      <div key={request._id} className="request-card">
        <div className="request-header">
          <h3>{request.patientName}</h3>
          <span className={getUrgencyClass(request.urgency)}>
            {request.urgency.toUpperCase()}
          </span>
        </div>
        <div className="request-body">
          <div className="request-info">
            <span className="blood-group-badge">{request.bloodGroup}</span>
            <span>{request.units} unit{request.units > 1 ? 's' : ''} needed</span>
          </div>
          <div className="request-details">
            <p><strong>Hospital:</strong> {request.hospital?.name || 'Not specified'}</p>
            <p><strong>Contact:</strong> {request.contactNumber}</p>
            <p><strong>Required By:</strong> {new Date(request.requiredBy).toLocaleDateString()}</p>
            {request.description && (
              <p><strong>Note:</strong> {request.description}</p>
            )}
          </div>
          {isMyRequests && request.status === 'pending' && (
            <div className="request-actions">
              <button 
                className="btn-cancel-request"
                onClick={() => handleCancelRequest(request._id)}
              >
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                Cancel Request
              </button>
            </div>
          )}
        </div>
      </div>
    ));
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="page-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <Link to="/create-request" className="btn btn-primary">
          Create Blood Request
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
              <path d="M10 2C10 2 5 7.5 5 12C5 14.7614 7.23858 17 10 17C12.7614 17 15 14.7614 15 12C15 7.5 10 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="#ef4444"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{requests.length}</h3>
            <p>Active Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
              <rect x="6" y="2" width="8" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 2H8C8 0.895 8.895 0 10 0C11.105 0 12 0.895 12 2H12" stroke="currentColor" strokeWidth="2"/>
              <path d="M8 8H12M8 11H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>{myRequests.length}</h3>
            <p>My Requests</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
              <path d="M10 7V14M7 10.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>
              <Link to="/blood-banks">View Banks</Link>
            </h3>
            <p>Blood Banks Nearby</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <svg width="32" height="32" viewBox="0 0 20 20" fill="none">
              <circle cx="7" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="13" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M1 17C1 13.686 3.686 11 7 11C10.314 11 13 13.686 13 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M7 17C7 13.686 9.686 11 13 11C16.314 11 19 13.686 19 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="stat-info">
            <h3>
              <Link to="/donors">Find Donors</Link>
            </h3>
            <p>Available Donors</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'all' ? 'active' : ''}`}
            onClick={() => setActiveTab('all')}
          >
            All Requests ({requests.length})
          </button>
          <button
            className={`tab ${activeTab === 'my' ? 'active' : ''}`}
            onClick={() => setActiveTab('my')}
          >
            My Requests ({myRequests.length})
          </button>
        </div>

        <div className="requests-container">
          {message.text && (
            <div className={`alert alert-${message.type}`}>
              {message.text}
            </div>
          )}
          {activeTab === 'all' ? renderRequests(requests, false) : renderRequests(myRequests, true)}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
