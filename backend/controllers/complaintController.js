const asyncHandler = require('express-async-handler');
const Complaint = require('../models/Complaint');


const createComplaint = asyncHandler(async (req, res) => {
  
  const ticketId = 'TKT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
  
  const complaint = await Complaint.create({
    ...req.body,
    ticketId,
    farmer: req.user._id,
    timeline: [
      {
        action: 'Complaint Filed',
        by: 'Farmer',
        note: 'Complaint submitted successfully.'
      }
    ]
  });

  res.status(201).json(complaint);
});


const getMyComplaints = asyncHandler(async (req, res) => {
  const complaints = await Complaint.find({ farmer: req.user._id })
    .sort({ createdAt: -1 });

  res.json(complaints);
});


const getAllComplaints = asyncHandler(async (req, res) => {
  const { status } = req.query;

  const filter = {};
  if (status) filter.status = status;

  const complaints = await Complaint.find(filter)
    .populate('farmer', 'name email phone state')
    .sort({ createdAt: -1 });

  res.json(complaints);
});


const getComplaintById = asyncHandler(async (req, res) => {
  const complaint = await Complaint.findById(req.params.id)
    .populate('farmer', 'name email phone state');

  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  res.json(complaint);
});


const respondToComplaint = asyncHandler(async (req, res) => {
  const { status, adminResponse } = req.body;

  const complaint = await Complaint.findById(req.params.id);
  
  if (!complaint) {
    res.status(404);
    throw new Error('Complaint not found');
  }

  if (adminResponse) {
    complaint.adminResponse = adminResponse;
    complaint.timeline.push({
      action: 'Admin Responded',
      by: 'Admin',
      note: adminResponse
    });
  }

  if (status && status !== complaint.status) {
    complaint.timeline.push({
      action: `Status changed to ${status}`,
      by: 'Admin'
    });
    complaint.status = status;
  }

  if (complaint.status === 'resolved') {
    complaint.resolvedBy = req.user._id;
    complaint.resolvedAt = new Date();
  }

  await complaint.save();
  await complaint.populate('farmer', 'name email');

  res.json(complaint);
});


const getComplaintStats = asyncHandler(async (req, res) => {
  const stats = await Complaint.aggregate([
    { $group: { _id: '$status', count: { $sum: 1 } } },
  ]);

  res.json(stats);
});

module.exports = {
  createComplaint,
  getMyComplaints,
  getAllComplaints,
  getComplaintById,   
  respondToComplaint,
  getComplaintStats
};
