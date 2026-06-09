// KisanSaathi - Learning Resource Model
const mongoose = require('mongoose');

const learningSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Modern Farming', 'Technology', 'Pest Control', 'Crop Management', 'Other'],
      default: 'Other',
    },
    type: {
      type: String,
      enum: ['Video', 'Article'],
      required: true,
    },
    contentUrl: { type: String, required: true },
    thumbnailUrl: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Learning', learningSchema);
