const Review = require('../models/review');
const Food = require('../models/food');
const factory = require('./handlerfactory');

exports.getAllReviews = factory.getAll(Review);
exports.setTourUserIds = (req, res, next) => {
  if (!req.body.food) req.body.food = req.params.foodId;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getReview = factory.getOne(Review);
exports.createReview = factory.createOne(Review);
exports.updateReview = factory.updateOne(Review);
exports.deleteReview = factory.deleteOne(Review);
