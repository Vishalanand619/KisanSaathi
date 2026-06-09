// KisanSaathi — Learning Routes
const express = require('express');
const router = express.Router();
const {
  getLearningResources,
  getAllLearningResourcesAdmin,
  createLearningResource,
  updateLearningResource,
  deleteLearningResource,
} = require('../controllers/learningController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', protect, getLearningResources);
router.get('/admin/all', protect, adminOnly, getAllLearningResourcesAdmin);
router.post('/', protect, adminOnly, createLearningResource);
router.put('/:id', protect, adminOnly, updateLearningResource);
router.delete('/:id', protect, adminOnly, deleteLearningResource);

module.exports = router;
