const express = require('express');
const categoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const router = express.Router();
router
  .route('/')
  .get(categoryController.getAllCategories)
  .post(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    categoryController.uploadCategoryImageCover,
    categoryController.resizeCoverImage,
    categoryController.createCategory
  );

router
  .route('/:id')
  .get(categoryController.getCategory)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    categoryController.updateCategory
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'staff'),
    categoryController.deleteCategory
  );

module.exports = router;
