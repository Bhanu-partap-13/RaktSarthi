import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bloodGroup: '',
    isDonor: false,
    isAvailable: true,
    address: {
      street: '',
      city: '',
      state: '',
      pincode: '',
    },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      setUser(response.data);
      setFormData({
        name: response.data.name || '',
        phone: response.data.phone || '',
        bloodGroup: response.data.bloodGroup || '',
        isDonor: response.data.isDonor || false,
        isAvailable: response.data.isAvailable ?? true,
        address: response.data.address || { street: '', city: '', state: '', pincode: '' },
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userAPI.updateProfile(formData);
      setMessage('Profile updated successfully!');
      setEditing(false);
      fetchProfile();
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  return (
    <div className="page-container">
      <div className="profile-container">
        <div className="profile-header">
          <div className="profile-avatar">
            <svg width="64" height="64" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              <path d="M3 19C3 15.134 6.13401 12 10 12C13.866 12 17 15.134 17 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </div>
          <div className="profile-header-info">
            <h1>{user?.name}</h1>
            <p>{user?.email}</p>
            <span className="blood-group-badge">{user?.bloodGroup}</span>
          </div>
        </div>

        {message && (
          <div className={`message ${message.includes('success') ? 'success-message' : 'error-message'}`}>
            {message}
          </div>
        )}

        <div className="profile-content">
          {!editing ? (
            <div className="profile-view">
              <div className="profile-section">
                <h2>Personal Information</h2>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Name:</label>
                    <span>{user?.name}</span>
                  </div>
                  <div className="info-item">
                    <label>Email:</label>
                    <span>{user?.email}</span>
                  </div>
                  <div className="info-item">
                    <label>Phone:</label>
                    <span>{user?.phone}</span>
                  </div>
                  <div className="info-item">
                    <label>Blood Group:</label>
                    <span>{user?.bloodGroup}</span>
                  </div>
                  <div className="info-item">
                    <label>Role:</label>
                    <span className="role-badge">{user?.role}</span>
                  </div>
                  <div className="info-item">
                    <label>Donor Status:</label>
                    <span>{user?.isDonor ? '✅ Registered Donor' : '❌ Not a Donor'}</span>
                  </div>
                  {user?.isDonor && (
                    <div className="info-item">
                      <label>Availability:</label>
                      <span>{user?.isAvailable ? '✅ Available' : '❌ Not Available'}</span>
                    </div>
                  )}
                </div>
              </div>

              {user?.address && (
                <div className="profile-section">
                  <h2>Address</h2>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Street:</label>
                      <span>{user.address.street || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>City:</label>
                      <span>{user.address.city || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>State:</label>
                      <span>{user.address.state || 'Not provided'}</span>
                    </div>
                    <div className="info-item">
                      <label>Pincode:</label>
                      <span>{user.address.pincode || 'Not provided'}</span>
                    </div>
                  </div>
                </div>
              )}

              <button className="btn btn-primary" onClick={() => setEditing(true)}>
                Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="profile-edit-form">
              <div className="profile-section">
                <h2>Edit Personal Information</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      className="form-control"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="bloodGroup">Blood Group</label>
                    <select
                      id="bloodGroup"
                      name="bloodGroup"
                      className="form-control"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      required
                    >
                      {bloodGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="isDonor"
                      checked={formData.isDonor}
                      onChange={handleChange}
                    />
                    <span>Register as a blood donor</span>
                  </label>
                </div>

                {formData.isDonor && (
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="isAvailable"
                        checked={formData.isAvailable}
                        onChange={handleChange}
                      />
                      <span>Available for donation</span>
                    </label>
                  </div>
                )}
              </div>

              <div className="profile-section">
                <h2>Edit Address</h2>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address.street">Street</label>
                    <input
                      type="text"
                      id="address.street"
                      name="address.street"
                      className="form-control"
                      value={formData.address.street}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.city">City</label>
                    <input
                      type="text"
                      id="address.city"
                      name="address.city"
                      className="form-control"
                      value={formData.address.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="address.state">State</label>
                    <input
                      type="text"
                      id="address.state"
                      name="address.state"
                      className="form-control"
                      value={formData.address.state}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="address.pincode">Pincode</label>
                    <input
                      type="text"
                      id="address.pincode"
                      name="address.pincode"
                      className="form-control"
                      value={formData.address.pincode}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
