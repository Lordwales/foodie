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

    rating: {
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

reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'user photo',
  });
});

reviewSchema.statics.calcAverageRatings = async function (foodId) {
  const stats = await this.aggregate([
    {
      $match: { food: foodId },
    },
    {
      $group: {
        _id: 'food',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
  ]);

  if (stats.length > 0) {
    await Food.findByIdAndUpdate(foodId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await Food.findByIdAndUpdate(foodId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.food);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  // console.log(this.r);
  next();
});

reviewSchema.post(/^findOneAnd/, async function () {
  // await this.findOne(); does NOT work here, query has already executed
  await this.r.constructor.calcAverageRatings(this.r.food);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
