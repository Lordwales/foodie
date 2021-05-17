const express = require('express');
const discountController = require('../controllers/discountController');

const router = express.Router();

router
  .route('/')
  .get(discountController.getAllDiscount)
  .post(discountController.createDiscount);

router
  .route('/:id')
  .get(discountController.getDiscount)
  .patch(discountController.updateDiscount)
  .delete(discountController.deleteDiscount);

module.exports = router;
