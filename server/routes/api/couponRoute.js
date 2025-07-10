const express = require("express");
const {
  createCouponCodeController,
  getAllCouponCodeController,
  getCouponCodeController,
  deleteCouponCodeController,
  updateCouponCodeController,
} = require("../../controllers/couponController");

const router = express.Router();

router
  .route("/")
  .post(createCouponCodeController)
  .get(getAllCouponCodeController);

router
  .route("/:coupon")
  .get(getCouponCodeController)
  .patch(updateCouponCodeController)
  .delete(deleteCouponCodeController);

module.exports = router;
