const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const BloodRequest = require('../models/BloodRequest');

// @route   GET /api/requests
// @desc    Get all blood requests
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { status, bloodGroup } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (bloodGroup) query.bloodGroup = bloodGroup;

    const requests = await BloodRequest.find(query)
      .populate('requestedBy', 'name email phone')
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   GET /api/requests/my-requests
// @desc    Get user's blood requests
// @access  Private
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await BloodRequest.find({ requestedBy: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   POST /api/requests
// @desc    Create a new blood request
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { patientName, bloodGroup, units, urgency, hospital, contactNumber, requiredBy, description } = req.body;

    const bloodRequest = new BloodRequest({
      requestedBy: req.user.userId,
      patientName,
      bloodGroup,
      units,
      urgency,
      hospital,
      contactNumber,
      requiredBy,
      description
    });

    await bloodRequest.save();
    res.status(201).json({ message: 'Blood request created successfully', request: bloodRequest });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PUT /api/requests/:id
// @desc    Update blood request status
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    request.status = status;
    await request.save();

    res.json({ message: 'Request updated successfully', request });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// @route   PATCH /api/requests/:id/status
// @desc    Update blood request status (cancel request)
// @access  Private
router.patch('/:id/status', auth, async (req, res) => {
  try {
    console.log('Request cancellation attempt:', { requestId: req.params.id, userId: req.user.userId, status: req.body.status });
    
    const { status } = req.body;
    
    const request = await BloodRequest.findById(req.params.id);
    if (!request) {
      console.log('Request not found:', req.params.id);
      return res.status(404).json({ message: 'Request not found' });
    }

    console.log('Request found:', { requestedBy: request.requestedBy.toString(), currentUser: req.user.userId });

    // Verify the user owns this request
    if (request.requestedBy.toString() !== req.user.userId) {
      console.log('Authorization failed: User does not own this request');
      return res.status(403).json({ message: 'Not authorized to modify this request' });
    }

    // Only allow cancelling pending requests
    if (status === 'cancelled' && request.status !== 'pending') {
      console.log('Cannot cancel non-pending request:', request.status);
      return res.status(400).json({ message: 'Only pending requests can be cancelled' });
    }

    request.status = status;
    await request.save();

    console.log('Request status updated successfully:', request._id);
    
    res.json({ message: 'Request status updated successfully', request });
  } catch (error) {
    console.error('Request cancellation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
