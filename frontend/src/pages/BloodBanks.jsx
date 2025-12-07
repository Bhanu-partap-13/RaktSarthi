import React, { useState, useEffect, useCallback } from 'react';
import { bloodBankAPI } from '../services/api';
import ImageLightbox from '../components/ImageLightbox';
import './BloodBanks.css';

const BloodBanks = () => {
  const [bloodBanks, setBloodBanks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);

  // Sample gallery images for blood banks
  const galleryImages = [
    {
      url: 'https://images.unsplash.com/photo-1615461066841-6116e61058f4?w=800&q=80',
      alt: 'Blood Donation Center',
      caption: 'Modern blood donation facilities'
    },
    {
      url: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&q=80',
      alt: 'Blood Testing Laboratory',
      caption: 'State-of-the-art testing equipment'
    },
    {
      url: 'https://images.unsplash.com/photo-1631815588090-d4bfec5b1ccb?w=800&q=80',
      alt: 'Blood Storage Units',
      caption: 'Temperature-controlled storage systems'
    },
    {
      url: 'https://images.unsplash.com/photo-1582560475093-ba66accbc424?w=800&q=80',
      alt: 'Donation Process',
      caption: 'Safe and comfortable donation experience'
    }
  ];

  const fetchBloodBanks = useCallback(async () => {
    try {
      setLoading(true);
      const params = filterBloodGroup ? { bloodGroup: filterBloodGroup } : {};
      const response = await bloodBankAPI.getAll(params);
      setBloodBanks(response.data);
    } catch (error) {
      console.error('Error fetching blood banks:', error);
    } finally {
      setLoading(false);
    }
  }, [filterBloodGroup]);

  useEffect(() => {
    fetchBloodBanks();
  }, [fetchBloodBanks]);

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  if (loading) {
    return <div className="loading">Loading blood banks...</div>;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Blood Banks</h1>
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
      </div>

      {/* Gallery Section */}
      <div className="gallery-section">
        <h2>Our Facilities</h2>
        <div className="gallery-grid">
          {galleryImages.map((image, index) => (
            <div 
              key={index} 
              className="gallery-item"
              onClick={() => setSelectedImage(image)}
            >
              <img src={image.url} alt={image.alt} />
              <div className="gallery-overlay">
                <svg width="40" height="40" viewBox="0 0 20 20" fill="none">
                  <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="blood-banks-grid">
        {bloodBanks.length === 0 ? (
          <div className="empty-state">
            <p>No blood banks found.</p>
          </div>
        ) : (
          bloodBanks.map((bank) => (
            <div key={bank._id} className="blood-bank-card">
              <div className="bank-header">
                <h2>
                  <svg width="24" height="24" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '8px'}}>
                    <rect x="2" y="4" width="16" height="14" rx="1" stroke="currentColor" strokeWidth="2"/>
                    <path d="M10 7V14M7 10.5H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  {bank.name}
                </h2>
              </div>
              <div className="bank-details">
                <p><strong>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '4px'}}>
                    <path d="M3 4H17C18.1 4 19 4.9 19 6V14C19 15.1 18.1 16 17 16H3C1.9 16 1 15.1 1 14V6C1 4.9 1.9 4 3 4Z" stroke="currentColor" strokeWidth="2"/>
                    <path d="M19 6L10 11L1 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                  Email:</strong> {bank.email}</p>
                <p><strong>
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '4px'}}>
                    <path d="M3 2H7L9 7L6.5 8.5C7.5 10.5 9.5 12.5 11.5 13.5L13 11L18 13V17C18 18.1 17.1 19 16 19C7.716 19 1 12.284 1 4C1 2.9 1.9 2 3 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>\n                  </svg>
                  Phone:</strong> {bank.phone}</p>
                <p>
                  <strong>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '4px'}}>
                      <path d="M10 2C7.5 2 5 4 5 7C5 11 10 18 10 18C10 18 15 11 15 7C15 4 12.5 2 10 2Z" stroke="currentColor" strokeWidth="2"/>
                      <circle cx="10" cy="7" r="2" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Address:</strong> {bank.address?.street}, {bank.address?.city}, {bank.address?.state} - {bank.address?.pincode}
                </p>
                {bank.operatingHours && (
                  <p><strong>
                    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" style={{verticalAlign: 'middle', marginRight: '4px'}}>
                      <circle cx="10" cy="10" r="8" stroke="currentColor" strokeWidth="2"/>
                      <path d="M10 6V10L13 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    Hours:</strong> {bank.operatingHours.open} - {bank.operatingHours.close}</p>
                )}
              </div>
              
              <div className="inventory-section">
                <h3>Blood Inventory</h3>
                <div className="inventory-grid">
                  {bank.inventory && bank.inventory.length > 0 ? (
                    bank.inventory.map((item, index) => (
                      <div key={index} className="inventory-item">
                        <span className="blood-group-badge">{item.bloodGroup}</span>
                        <span className="units">{item.units} units</span>
                      </div>
                    ))
                  ) : (
                    <p>No inventory data available</p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {selectedImage && (
        <ImageLightbox 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default BloodBanks;
