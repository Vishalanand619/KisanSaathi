// KisanSaathi - Learning Controller
const asyncHandler = require('express-async-handler');
const Learning = require('../models/Learning');

// @desc    Get all active learning resources (for farmers)
// @route   GET /api/learning
// @access  Protected
const getLearningResources = asyncHandler(async (req, res) => {
  const { category, type, search } = req.query;
  const filter = { isActive: true };
  
  if (category && category !== 'All') filter.category = category;
  if (type && type !== 'All') filter.type = type;
  if (search) {
    filter.$or = [
      { title: new RegExp(search, 'i') },
      { description: new RegExp(search, 'i') },
    ];
  }

  const resources = await Learning.find(filter).sort({ createdAt: -1 });
  res.json(resources);
});

// @desc    Get all learning resources including inactive (for admins)
// @route   GET /api/learning/admin/all
// @access  Admin
const getAllLearningResourcesAdmin = asyncHandler(async (req, res) => {
  const resources = await Learning.find()
    .populate('createdBy', 'name')
    .sort({ createdAt: -1 });
  res.json(resources);
});

// @desc    Create a new learning resource
// @route   POST /api/learning
// @access  Admin
const createLearningResource = asyncHandler(async (req, res) => {
  const resource = await Learning.create({
    ...req.body,
    createdBy: req.user._id,
  });
  res.status(201).json(resource);
});

// @desc    Update a learning resource
// @route   PUT /api/learning/:id
// @access  Admin
const updateLearningResource = asyncHandler(async (req, res) => {
  const resource = await Learning.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!resource) {
    res.status(404);
    throw new Error('Learning resource not found');
  }

  res.json(resource);
});

// @desc    Delete a learning resource
// @route   DELETE /api/learning/:id
// @access  Admin
const deleteLearningResource = asyncHandler(async (req, res) => {
  const resource = await Learning.findByIdAndDelete(req.params.id);
  
  if (!resource) {
    res.status(404);
    throw new Error('Learning resource not found');
  }

  res.json({ message: 'Resource removed' });
});

module.exports = {
  getLearningResources,
  getAllLearningResourcesAdmin,
  createLearningResource,
  updateLearningResource,
  deleteLearningResource,
};
