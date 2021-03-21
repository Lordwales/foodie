const express = require('express');
const foodController = require('../controllers/foodController');
const authController = require('../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

router.use('/:foodId/reviews', reviewRouter);

router
  .route('/')
  .get(foodController.getAllFoods)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    foodController.uploadFoodImages,
    foodController.resizeFoodImages,
    foodController.createFood
  );

router
  .route('/:id')
  .get(foodController.getFood)
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    foodController.updateFood
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin'),
    foodController.deleteFood
  );
module.exports = router;
