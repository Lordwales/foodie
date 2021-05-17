const factory = require('./handlerfactory');
const CatchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Discount = require('../models/discount');

exports.createDiscount = factory.createOne(Discount);
exports.getDiscount = factory.getOne(Discount);
exports.getAllDiscount = factory.getAll(Discount);
exports.updateDiscount = factory.updateOne(Discount);
exports.deleteDiscount = factory.deleteOne(Discount);
