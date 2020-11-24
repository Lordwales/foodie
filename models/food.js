const mongoose = require('mongoose');
const slugify = require('slugify');

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A food must have a name'],
      unique: true,
    },

    slug: String,

    price: {
      type: Number,
      required: [true, 'A food must have a number'],
    },

    description: {
      type: String,
      required: [true, 'A food must have a description'],
    },

    ratingsAverage: {
      type: Number,
      default: 5,
      min: [1, 'Rating must be equal to or above 1 '],
      max: [5, 'Rating must be equal to or below 5 '],
    },

    ratingsQuantity: {
      type: Number,
      default: 0,
    },

    images: [String],

    imageCover: {
      type: String,
      required: [true, 'A food must have cover image'],
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },

    special: {
      type: [String],
      enum: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
    },

    timeOfDay: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner'],
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

foodSchema.index({ slug: 1 });
foodSchema.index({ price: 1, ratingsAverage: -1 });

foodSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

const Food = mongoose.model('Food', foodSchema);
module.exports = Food;
