const express = require('express');
const router = express.Router();
const { getMarketPrices, getStates, getCrops, triggerSync, addMarketPrice, deleteMarketPrice } = require('../controllers/marketController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/', getMarketPrices);
router.get('/states', getStates);
router.get('/crops', getCrops);
router.post('/sync', protect, adminOnly, triggerSync);
router.post('/', protect, adminOnly, addMarketPrice);
router.delete('/:id', protect, adminOnly, deleteMarketPrice);

module.exports = router;
