// KisanSaathi - Government Scheme Model
const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    eligibility: { type: String, required: true },
    benefits: { type: String, required: true },
    deadline: { type: Date },
    category: {
      type: String,
      enum: ['Financial Aid', 'Insurance', 'Credit', 'Subsidy', 'Training', 'Other'],
      default: 'Other',
    },
    ministry: { type: String },
    schemeCode: { type: String },
    documents: [{ type: String }],
    helpline: { type: String },
    website: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scheme', schemeSchema);
