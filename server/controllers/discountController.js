const Option = require("../models/optionModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");

exports.applyDiscountController = catchAsync(async (req, res, next) => {
  let { type, id, discountType, discountValue } = req.body;

  if (
    !["percent", "amount", "none"].includes(discountType) ||
    discountValue == null ||
    isNaN(discountValue) ||
    discountValue < 0
  ) {
    return next(new AppError("Invalid discount type or value", 400));
  }

  if (!id) {
    return next(new AppError("ID is required to implement discount", 400));
  }

  if (
    ![
      "category",
      "subCategory",
      "brand",
      "product",
      "variant",
      "option",
    ].includes(type)
  ) {
    return next(
      new AppError(
        "Invalid type, must be category, subCategory, brand, product, variant or option",
        400
      )
    );
  }

  // Determine the filter based on the type
  let filter;
  if (type === "category") {
    filter = { category: id };
  } else if (type === "subCategory") {
    filter = { subCategory: id };
  } else if (type === "brand") {
    filter = { brand: id };
  } else if (type === "product") {
    filter = { product: id };
  } else if (type === "variant") {
    filter = { variant: id };
  } else if (type === "option") {
    filter = { _id: id };
  }

  // Find all the options matching with the filter
  const options = await Option.find(filter);

  // Check each option to ensure the discount is valid
  for (const option of options) {
    const effectivePrice =
      option.price -
      (discountType === "percent"
        ? (option.price * discountValue) / 100
        : discountValue);

    if (effectivePrice <= 0) {
      return next(
        new AppError(
          `Discounted price for ${option.title} cannot be equal to or less than zero`,
          400
        )
      );
    }
  }

  // Calculate the new discount value and update priceAfterDiscount
  for (const option of options) {
    let salePrice;

    if (discountValue === 0) {
      salePrice = 0;
    } else {
      if (discountType === "percent") {
        salePrice = option.price - (option.price * discountValue) / 100;
      } else if (discountType === "amount") {
        salePrice = option.price - discountValue;
      }
    }

    await Option.findOneAndUpdate(
      { _id: option._id },
      {
        salePrice,
        discountType: discountValue == 0 ? "none" : discountType,
        discountValue,
      },
      {
        new: true,
      }
    );
  }

  res.status(200).json({
    status: "success",
    message: "Discount applied successfully to all applicable variants",
  });
});
