const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A discount must have a name'],
    unique: true,
    maxlength: [40, 'A discount must have less than or equal to 40 characters'],
    minlength: [10, 'A discount must have more than or equal to 10 characters'],
  },

  value: {
    type: [Number, String],
    required: [true, 'A discount must have a value'],
  },

  discountType: {
    type: String,
    default: 'fixed',
    enum: ['Point', 'percentage'],
  },

  expireDate: {
    type: Date,
    maxlength: [40, 'A discount must have expiring Date'],
  },

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});
