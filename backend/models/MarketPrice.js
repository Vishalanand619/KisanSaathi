const mongoose = require('mongoose');

const marketPriceSchema = new mongoose.Schema(
  {
    crop: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    unit: { type: String, default: 'quintal' },
    market: { type: String, required: true },
    state: { type: String, required: true },
    date: { type: Date, default: Date.now },
    minPrice: { type: Number },
    maxPrice: { type: Number },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MarketPrice', marketPriceSchema);
