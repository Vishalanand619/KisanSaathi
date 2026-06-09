// KisanSaathi - Complaint Model
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, unique: true },
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    subject: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: {
      type: String,
      enum: ['Scheme Issue', 'Market Price', 'Payment Issue', 'Documentation', 'Technical Issue', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'resolved', 'closed'],
      default: 'open',
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'urgent'],
      default: 'medium',
    },
    adminResponse: { type: String },
    resolvedAt: { type: Date },
    resolvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    timeline: [
      {
        action: String,
        by: String,
        at: { type: Date, default: Date.now },
        note: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Complaint', complaintSchema);
