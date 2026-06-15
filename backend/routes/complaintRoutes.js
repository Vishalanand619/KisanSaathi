const express = require('express');
const router = express.Router();
const { createComplaint, getMyComplaints, getComplaintById, getAllComplaints, respondToComplaint, getComplaintStats } = require('../controllers/complaintController');
const { protect, adminOnly, farmerOnly } = require('../middleware/authMiddleware');

router.post('/', protect, farmerOnly, createComplaint);
router.get('/mine', protect, farmerOnly, getMyComplaints);
router.get('/stats', protect, adminOnly, getComplaintStats);
router.get('/', protect, adminOnly, getAllComplaints);
router.get('/:id', protect, getComplaintById);
router.put('/:id', protect, adminOnly, respondToComplaint);

module.exports = router;
