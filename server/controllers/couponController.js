const Coupon = require("../models/couponModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { createOne, getAll } = require("../utils/handleFactory");

exports.createCouponCodeController = createOne(Coupon);

exports.getAllCouponCodeController = getAll(Coupon);

exports.getCouponCodeController = catchAsync(async (req, res, next) => {
  let coupon = await Coupon.findOne({ coupon: req.params.coupon }).select(
    "-__v"
  );

  if (!coupon) {
    return next(new AppError("No coupon was found with that name!", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      coupon,
    },
  });
});

exports.updateCouponCodeController = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOneAndUpdate(
    { coupon: req.params.coupon },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  ).select("-__v");

  if (!coupon) {
    return next(new AppError("No coupon was found with that name!", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Coupon has been updated successfully",
    data: {
      coupon,
    },
  });
});

exports.deleteCouponCodeController = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.findOneAndDelete({ coupon: req.params.coupon });

  if (!coupon) {
    return next(new AppError("No coupon was found with that name!", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});
