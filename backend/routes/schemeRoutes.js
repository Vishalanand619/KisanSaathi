// KisanSaathi — Scheme Routes
const express = require('express');
const router = express.Router();
const {
  getSchemes, getAllSchemesAdmin, getScheme, createScheme, updateScheme, deleteScheme,
  applyForScheme, getMyApplications, getAllApplications, updateApplicationStatus, getSchemeStats,
} = require('../controllers/schemeController');
const { protect, adminOnly, farmerOnly } = require('../middleware/authMiddleware');

router.get('/', getSchemes);
router.get('/farmer/my-applications', protect, farmerOnly, getMyApplications);
router.get('/admin/all', protect, adminOnly, getAllSchemesAdmin);
router.get('/admin/applications', protect, adminOnly, getAllApplications);
router.get('/admin/stats', protect, adminOnly, getSchemeStats);
router.get('/:id', getScheme);
router.post('/', protect, adminOnly, createScheme);
router.put('/admin/applications/:id', protect, adminOnly, updateApplicationStatus);
router.put('/:id', protect, adminOnly, updateScheme);
router.delete('/:id', protect, adminOnly, deleteScheme);
router.post('/:id/apply', protect, farmerOnly, applyForScheme);

module.exports = router;
