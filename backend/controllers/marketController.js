// KisanSaathi - Market Price Controller
const asyncHandler = require('express-async-handler');
const MarketPrice = require('../models/MarketPrice');

// @desc    Get all market prices
const getMarketPrices = asyncHandler(async (req, res) => {
  const { state, crop } = req.query;

  const filter = {};
 if (state) filter.state = new RegExp(`^${state}$`, 'i');
  if (crop) filter.crop = new RegExp(crop, 'i');

  const prices = await MarketPrice.find(filter).sort({ updatedAt: -1 });
  res.json(prices);
});

// @desc    Get all states (for dropdown)
const getStates = asyncHandler(async (req, res) => {
  const states = await MarketPrice.distinct('state');
  res.json(states);
});

// @desc    Get all crops (for dropdown)
const getCrops = asyncHandler(async (req, res) => {
  const crops = await MarketPrice.distinct('crop');
  res.json(crops);
});

const axios = require("axios");

const triggerSync = asyncHandler(async (req, res) => {
  try {
    const response = await axios.get(
      "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070",
      {
        params: {
          "api-key": process.env.API_KEY,
          format: "json",
          limit: 100
        }
      }
    );

    const records = response.data.records;

    for (const item of records) {
      await MarketPrice.findOneAndUpdate(
        {
          crop: item.commodity,
          market: item.market,
          state: item.state
        },
        {
          crop: item.commodity,
          market: item.market,
          state: item.state,
          price: Number(item.modal_price),
          minPrice: Number(item.min_price),
          maxPrice: Number(item.max_price)
        },
        { upsert: true }
      );
    }

    res.json({ message: "✅ Mandi data synced successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "❌ Sync failed" });
  }
});

// @desc    Add/Update market price (admin)
const addMarketPrice = asyncHandler(async (req, res) => {
  const { crop, market, state } = req.body;

  const existing = await MarketPrice.findOne({ crop, market, state });

  if (existing) {
    const updated = await MarketPrice.findByIdAndUpdate(
      existing._id,
      { ...req.body, updatedBy: req.user._id },
      { new: true }
    );
    return res.json(updated);
  }

  const price = await MarketPrice.create({
    ...req.body,
    updatedBy: req.user._id
  });

  res.status(201).json(price);
});

// @desc    Delete market price
const deleteMarketPrice = asyncHandler(async (req, res) => {
  await MarketPrice.findByIdAndDelete(req.params.id);
  res.json({ message: 'Market price entry removed' });
});

// ✅ FINAL EXPORT (IMPORTANT)
module.exports = {
  getMarketPrices,
  getStates,       // 🔥 added
  getCrops,        // 🔥 added
  triggerSync,     // 🔥 added
  addMarketPrice,
  deleteMarketPrice
};