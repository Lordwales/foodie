const multer = require('multer');
const Category = require('../models/Category');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerfactory');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not an image! Please upload only images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadCategoryImageCover = upload.fields({
  name: 'categoryCoverImage',
  maxCount: 1,
});

exports.resizeCoverImage = catchAsync(async (req, res, next) => {
  //if (!req.files.categoryCoverImage) return next();

  req.body.categoryCoverImage = `category-${
    req.body.name
  }-${Date.now()}-cover.jpeg`;

  if (req.files) {
    //Process Cover Image
    await sharp(req.files.categoryCoverImage[0].buffer)
      .resize(2000, 1333)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(`public/img/categories/${req.body.categoryCoverImage}`);

    next();
  }
  next();
});

exports.createCategory = factory.createOne(Category);
exports.getCategory = factory.getOne(Category, { path: 'food' });
exports.updateCategory = factory.updateOne(Category);
exports.getAllCategories = factory.getAll(Category);
exports.deleteCategory = factory.deleteOne(Category);
