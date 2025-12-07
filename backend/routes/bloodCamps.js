const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const BloodCamp = require('../models/BloodCamp');
const BloodBank = require('../models/BloodBank');
const auth = require('../middleware/auth');

// Middleware to protect blood bank routes
const protectBloodBank = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      if (decoded.type !== 'bloodbank') {
        return res.status(401).json({ message: 'Not authorized as blood bank' });
      }
      
      req.bloodBank = await BloodBank.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// @route   GET /api/blood-camps
// @desc    Get all blood camps
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { city, status, upcoming } = req.query;
    
    let query = {};
    
    if (city) {
      query.city = new RegExp(city, 'i');
    }
    
    if (status) {
      query.status = status;
    }
    
    // Get only upcoming camps by default
    if (upcoming === 'true' || !status) {
      query.date = { $gte: new Date() };
      query.status = { $in: ['scheduled', 'upcoming'] };
    }
    
    const camps = await BloodCamp.find(query)
      .populate('organizer', 'name email phone')
      .sort({ date: 1 });
    
    res.json(camps);
  } catch (error) {
    console.error('Error fetching blood camps:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blood-camps/:id
// @desc    Get blood camp by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id)
      .populate('organizer', 'name email phone address');
    
    if (!camp) {
      return res.status(404).json({ message: 'Blood camp not found' });
    }
    
    res.json(camp);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blood-camps
// @desc    Create a new blood camp
// @access  Private (Blood Bank)
router.post('/', protectBloodBank, async (req, res) => {
  try {
    const {
      name,
      date,
      startTime,
      endTime,
      venue,
      address,
      city,
      state,
      pincode,
      targetUnits,
      description,
      contactPhone,
      contactEmail
    } = req.body;

    const camp = new BloodCamp({
      name,
      organizer: req.bloodBank._id,
      organizerName: req.bloodBank.name,
      date,
      startTime,
      endTime,
      venue,
      address,
      city,
      state,
      pincode,
      targetUnits,
      description,
      contactPhone: contactPhone || req.bloodBank.phone,
      contactEmail: contactEmail || req.bloodBank.email
    });

    await camp.save();
    
    res.status(201).json({
      message: 'Blood camp created successfully',
      camp
    });
  } catch (error) {
    console.error('Error creating blood camp:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blood-camps/:id
// @desc    Update a blood camp
// @access  Private (Blood Bank - owner only)
router.put('/:id', protectBloodBank, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    
    if (!camp) {
      return res.status(404).json({ message: 'Blood camp not found' });
    }
    
    // Check if the blood bank owns this camp
    if (camp.organizer.toString() !== req.bloodBank._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this camp' });
    }
    
    const {
      name,
      date,
      startTime,
      endTime,
      venue,
      address,
      city,
      state,
      pincode,
      targetUnits,
      description,
      status
    } = req.body;
    
    camp.name = name || camp.name;
    camp.date = date || camp.date;
    camp.startTime = startTime || camp.startTime;
    camp.endTime = endTime || camp.endTime;
    camp.venue = venue || camp.venue;
    camp.address = address || camp.address;
    camp.city = city || camp.city;
    camp.state = state || camp.state;
    camp.pincode = pincode || camp.pincode;
    camp.targetUnits = targetUnits || camp.targetUnits;
    camp.description = description || camp.description;
    camp.status = status || camp.status;
    
    await camp.save();
    
    res.json({
      message: 'Blood camp updated successfully',
      camp
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/blood-camps/:id
// @desc    Delete a blood camp
// @access  Private (Blood Bank - owner only)
router.delete('/:id', protectBloodBank, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    
    if (!camp) {
      return res.status(404).json({ message: 'Blood camp not found' });
    }
    
    // Check if the blood bank owns this camp
    if (camp.organizer.toString() !== req.bloodBank._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this camp' });
    }
    
    await BloodCamp.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Blood camp deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/blood-camps/:id/register
// @desc    Register for a blood camp
// @access  Private (User)
router.post('/:id/register', auth, async (req, res) => {
  try {
    const camp = await BloodCamp.findById(req.params.id);
    
    if (!camp) {
      return res.status(404).json({ message: 'Blood camp not found' });
    }
    
    // Check if already registered
    const alreadyRegistered = camp.registeredDonors.some(
      donor => donor.donor && donor.donor.toString() === req.user._id.toString()
    );
    
    if (alreadyRegistered) {
      return res.status(400).json({ message: 'Already registered for this camp' });
    }
    
    camp.registeredDonors.push({
      donor: req.user._id,
      name: req.user.name,
      phone: req.user.phone,
      bloodGroup: req.user.bloodGroup
    });
    
    await camp.save();
    
    res.json({ message: 'Successfully registered for blood camp' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/blood-camps/my-camps
// @desc    Get camps organized by the logged in blood bank
// @access  Private (Blood Bank)
router.get('/my-camps', protectBloodBank, async (req, res) => {
  try {
    const camps = await BloodCamp.find({ organizer: req.bloodBank._id })
      .sort({ date: -1 });
    
    res.json(camps);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/blood-camps/:id/collected
// @desc    Update collected units for a camp
// @access  Private (Blood Bank - owner only)
router.put('/:id/collected', protectBloodBank, async (req, res) => {
  try {
    const { collectedUnits } = req.body;
    
    const camp = await BloodCamp.findById(req.params.id);
    
    if (!camp) {
      return res.status(404).json({ message: 'Blood camp not found' });
    }
    
    if (camp.organizer.toString() !== req.bloodBank._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    camp.collectedUnits = collectedUnits;
    await camp.save();
    
    res.json({ message: 'Collected units updated', camp });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
