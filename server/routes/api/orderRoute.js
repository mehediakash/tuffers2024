const express = require("express");
const {
  createOrderWithCouponController,
  createOrderController,
  getAllOrdersController,
  getOrderController,
  updateOrderController,
  deleteOrderController,
} = require("../../controllers/orderController");

const router = express.Router();

// With Coupons
router.route("/withCoupon").post(createOrderWithCouponController);

router.route("/").post(createOrderController).get(getAllOrdersController);

router
  .route("/:id")
  .get(getOrderController)
  .patch(updateOrderController)
  .delete(deleteOrderController);

module.exports = router;
