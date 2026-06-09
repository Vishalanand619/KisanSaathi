// KisanSaathi — User Controller
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Complaint = require('../models/Complaint');
const SchemeApplication = require('../models/SchemeApplication');

// @route GET /api/users (admin — all farmers)
const getAllUsers = asyncHandler(async (req, res) => {
  const { state, search } = req.query;
  const filter = { role: 'farmer' };
  if (state) filter.state = state;
  if (search) filter.$or = [
    { name: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') },
    { phone: new RegExp(search, 'i') },
  ];
  const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
  res.json(users);
});

// @route GET /api/users/stats (admin dashboard)
const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalFarmers, activeFarmers, totalComplaints, openComplaints, totalApplications, pendingApplications] = await Promise.all([
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'farmer', isActive: true }),
    Complaint.countDocuments(),
    Complaint.countDocuments({ status: 'open' }),
    SchemeApplication.countDocuments(),
    SchemeApplication.countDocuments({ status: 'pending' }),
  ]);
  res.json({ totalFarmers, activeFarmers, totalComplaints, openComplaints, totalApplications, pendingApplications });
});

// @route GET /api/users/:id (admin)
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json(user);
});

// @route PUT /api/users/profile (private — own profile)
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  const allowed = ['name', 'phone', 'state', 'district', 'village', 'landHolding', 'cropType'];
  allowed.forEach(f => { if (req.body[f] !== undefined) user[f] = req.body[f]; });
  const updated = await user.save();
  res.json(updated);
});

// @route PUT /api/users/:id/toggle (admin)
const toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  user.isActive = !user.isActive;
  await user.save();
  res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
});

module.exports = { getAllUsers, getDashboardStats, getUserById, updateProfile, toggleUserStatus };
