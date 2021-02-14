const mongoose = require('mongoose');
const Food = require('Food');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Please fill the review'],
      maxlength: [250, 'Reviews should not be more than 250 characters'],
      minlength: [10, 'Reviews should not be less than 10 characters'],
    },

    ratings: {
      type: Number,
      default: 5,
      min: [1, 'minimum rating is 1'],
      max: [5, ' Rating should not be more than 5 '],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user'],
    },

    food: {
      type: mongoose.Schema.ObjectId,
      ref: 'Food',
      required: [true, 'Review must belong to a food'],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.index({ food: 1, user: 1 }, { unique: true });
