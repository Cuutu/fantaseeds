import mongoose from 'mongoose';

const membershipSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: String,
    required: true
  },
  period: {
    type: String,
    required: true,
    default: '/mes'
  },
  description: {
    type: String,
    required: true
  },
  limit: {
    type: String,
    required: true
  },
  features: [{
    type: String,
    required: true
  }],
  active: {
    type: Boolean,
    default: true
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

export default mongoose.models.Membership || mongoose.model('Membership', membershipSchema); 