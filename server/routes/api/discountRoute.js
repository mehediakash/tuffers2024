const express = require("express");
const {
  applyDiscountController,
} = require("../../controllers/discountController");

const router = express.Router();

router.put("/apply", applyDiscountController);

module.exports = router;
