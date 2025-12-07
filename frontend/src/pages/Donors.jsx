import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { userAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Donors.css';

const Donors = () => {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const { user } = useAuth();

  const fetchDonors = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterBloodGroup ? { bloodGroup: filterBloodGroup } : {};
      const response = await userAPI.getDonors(params);
      setDonors(response.data);
    } catch (error) {
      console.error('Error fetching donors:', error);
    } finally {
      setLoading(false);
    }
  }, [filterBloodGroup]);

  useEffect(() => {
    fetchDonors();
  }, [fetchDonors]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return <div className="loading">Loading donors...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Available Blood Donors</h1>
        <div className="header-actions">
          <div className="filter-group">
            <label>Filter by Blood Group:</label>
            <select
              className="form-control"
              value={filterBloodGroup}
              onChange={(e) => setFilterBloodGroup(e.target.value)}
            >
              <option value="">All Blood Groups</option>
              {bloodGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </div>
          {!user?.isDonor && (
            <Link to="/donor-form" className="btn-be-donor">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M10 2C10 2 5 7.5 5 12C5 14.7614 7.23858 17 10 17C12.7614 17 15 14.7614 15 12C15 7.5 10 2 10 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" fill="#fff"/>
              </svg>
              Be a Donor
            </Link>
          )}
        </div>
      </div>

      <div className="donors-grid">
        {donors.length === 0 ? (
          <div className="empty-state">
            <p>No donors found for the selected criteria.</p>
          </div>
        ) : (
          donors.map((donor) => (
            <div key={donor._id} className="donor-card">
              <div className="donor-avatar">
                <svg width="48" height="48" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  <path d="M3 19C3 15.134 6.13401 12 10 12C13.866 12 17 15.134 17 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="donor-info">
                <h3>{donor.name}</h3>
                <span className="blood-group-badge">{donor.bloodGroup}</span>
                
                <div className="donor-details">
                  <p>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '4px'}}>
                      <path d="M3 4H17C18.1 4 19 4.9 19 6V14C19 15.1 18.1 16 17 16H3C1.9 16 1 15.1 1 14V6C1 4.9 1.9 4 3 4Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M19 6L10 11L1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    {donor.email}
                  </p>
                  <p>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '4px'}}>
                      <path d="M3 2H7L9 7L6.5 8.5C7.5 10.5 9.5 12.5 11.5 13.5L13 11L18 13V17C18 18.1 17.1 19 16 19C7.716 19 1 12.284 1 4C1 2.9 1.9 2 3 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                    </svg>
                    {donor.phone}
                  </p>
                  {donor.address?.city && (
                    <p>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '4px'}}>
                        <path d="M10 2C7.5 2 5 4 5 7C5 11 10 18 10 18C10 18 15 11 15 7C15 4 12.5 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                        <circle cx="10" cy="7" r="2" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      {donor.address.city}, {donor.address.state}
                    </p>
                  )}
                  {donor.lastDonationDate && (
                    <p className="last-donation">
                      Last Donation: {new Date(donor.lastDonationDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
                
                <div className="donor-status">
                  {donor.isAvailable ? (
                    <span className="status-badge status-fulfilled">Available</span>
                  ) : (
                    <span className="status-badge status-pending">Not Available</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Donors;
