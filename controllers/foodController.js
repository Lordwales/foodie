const factory = require('./handlerFactory');
const multer = require('multer');
const sharp = require('sharp');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Food = require('../models/food');

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

//this is used for A mix of single and multiple images and it uses req.files
exports.uploadFoodImages = upload.fields([
  { name: 'imageCover', maxCount: 1 },
  { name: 'images', maxCount: 3 },
]);

// for single images USE upload.single('image') and it uses req.file
// for multiple images USE upload.array('images', 5) it uses req.files

exports.resizeFoodImages = catchAsync(async (req, res, next) => {
  //console.log(req.files);
  if (!req.files.imageCover || !req.files.images) return next();
  console.log(req.files);

  req.body.imageCover = `food-${req.params.id}-${Date.now()}-cover.jpeg`;

  //Process Cover Image
  await sharp(req.files.imageCover[0].buffer)
    .resize(2000, 1333)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/foods/${req.body.imageCover}`);

  //Process the other Images
  req.body.images = [];

  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = `food-${req.params.id}-${Date.now()}-${i + 1}.jpeg`;

      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/foods/${filename}`);

      req.body.images.push(filename);
    })
  );
  next();
});

exports.createFood = factory.createOne(Food);
exports.getFood = factory.getOne(Food, { path: 'reviews' });
exports.updateFood = factory.updateOne(Food);
exports.getAllFoods = factory.getAll(Food);
exports.deleteFood = factory.deleteOne(Food);
