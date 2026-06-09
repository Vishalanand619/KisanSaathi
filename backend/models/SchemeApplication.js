// KisanSaathi - Scheme Application Model
const mongoose = require('mongoose');

const schemeApplicationSchema = new mongoose.Schema(
  {
    scheme: { type: mongoose.Schema.Types.ObjectId, ref: 'Scheme', required: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    message: { type: String },
    adminRemarks: { type: String },
    documents: [{ type: String }], // file paths or URLs
  },
  { timestamps: true }
);

// Prevent duplicate applications
schemeApplicationSchema.index({ scheme: 1, farmer: 1 }, { unique: true });

module.exports = mongoose.model('SchemeApplication', schemeApplicationSchema);
