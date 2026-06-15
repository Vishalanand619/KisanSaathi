const asyncHandler = require('express-async-handler');
const Scheme = require('../models/Scheme');
const SchemeApplication = require('../models/SchemeApplication');


const getSchemes = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const filter = { isActive: true };
  if (category && category !== 'All') filter.category = category;
  if (search) filter.$or = [
    { title: new RegExp(search, 'i') },
    { description: new RegExp(search, 'i') },
  ];
  const schemes = await Scheme.find(filter).sort({ createdAt: -1 });
  res.json(schemes);
});


const getAllSchemesAdmin = asyncHandler(async (req, res) => {
  const schemes = await Scheme.find().sort({ createdAt: -1 }).populate('createdBy', 'name');
  res.json(schemes);
});


const getScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) { res.status(404); throw new Error('Scheme not found'); }
  res.json(scheme);
});


const createScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.create({ ...req.body, createdBy: req.user._id });
  res.status(201).json(scheme);
});


const updateScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!scheme) { res.status(404); throw new Error('Scheme not found'); }
  res.json(scheme);
});


const deleteScheme = asyncHandler(async (req, res) => {
  await Scheme.findByIdAndDelete(req.params.id);
  res.json({ message: 'Scheme removed' });
});


const applyForScheme = asyncHandler(async (req, res) => {
  const scheme = await Scheme.findById(req.params.id);
  if (!scheme) { res.status(404); throw new Error('Scheme not found'); }
  if (!scheme.isActive) { res.status(400); throw new Error('Scheme is no longer accepting applications'); }

  const existing = await SchemeApplication.findOne({ scheme: req.params.id, farmer: req.user._id });
  if (existing) { res.status(400); throw new Error('You have already applied for this scheme'); }

  const application = await SchemeApplication.create({
    scheme: req.params.id,
    farmer: req.user._id,
    message: req.body.message,
  });
  res.status(201).json(application);
});


const getMyApplications = asyncHandler(async (req, res) => {
  const apps = await SchemeApplication.find({ farmer: req.user._id })
    .populate('scheme', 'title category benefits ministry schemeCode helpline')
    .sort({ createdAt: -1 });
  res.json(apps);
});


const getAllApplications = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const apps = await SchemeApplication.find(filter)
    .populate('scheme', 'title category schemeCode')
    .populate('farmer', 'name email phone state district landHolding cropType')
    .sort({ createdAt: -1 });
  res.json(apps);
});


const updateApplicationStatus = asyncHandler(async (req, res) => {
  const app = await SchemeApplication.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status, adminRemarks: req.body.adminRemarks },
    { new: true }
  ).populate('scheme', 'title').populate('farmer', 'name email');
  if (!app) { res.status(404); throw new Error('Application not found'); }
  res.json(app);
});


const getSchemeStats = asyncHandler(async (req, res) => {
  const [total, active, byCategory, appStats] = await Promise.all([
    Scheme.countDocuments(),
    Scheme.countDocuments({ isActive: true }),
    Scheme.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
    SchemeApplication.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
  ]);
  res.json({ total, active, byCategory, appStats });
});

module.exports = {
  getSchemes, getAllSchemesAdmin, getScheme, createScheme, updateScheme, deleteScheme,
  applyForScheme, getMyApplications, getAllApplications, updateApplicationStatus, getSchemeStats,
};
