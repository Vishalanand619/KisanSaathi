// KisanSaathi — User Routes
const express = require('express');
const router = express.Router();
const { getAllUsers, getDashboardStats, getUserById, updateProfile, toggleUserStatus } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/stats', protect, adminOnly, getDashboardStats);
router.put('/profile', protect, updateProfile);
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.put('/:id/toggle', protect, adminOnly, toggleUserStatus);

module.exports = router;
