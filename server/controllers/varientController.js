const Option = require("../models/optionModel");
const Product = require("../models/productModel");
const Variant = require("../models/variantModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getAll, getOne, updateOne } = require("../utils/handleFactory");

exports.createVarientController = catchAsync(async (req, res, next) => {
  const variant = await Variant.create(req.body);

  const product = await Product.findOneAndUpdate(
    { _id: variant.product },
    { $push: { variants: variant._id } },
    { new: true }
  );

  if (!product) {
    return next(new AppError("No prouduct was found with that ID!", 404));
  }

  res.status(201).json({
    status: "success",
    message: "Variant has been created successfully",
    data: {
      variant,
    },
  });
});

exports.getAllVarientsController = getAll(Variant, [
  {
    path: "category subCategory brand",
    select: "title",
  },
  {
    path: "product",
    select: "-category -subCategory -brand -variants -__v",
  },
  {
    path: "options",
    select: "-category -subCategory -brand -product -variant -__v",
  },
]);

exports.getVarientController = getOne(Variant, [
  {
    path: "category subCategory brand",
    select: "title",
  },
  {
    path: "product",
    select: "-category -subCategory -brand -variants -__v",
  },
  {
    path: "options",
    select: "-category -subCategory -brand -product -variant -__v",
  },
]);

exports.updateVarientController = updateOne(Variant);

exports.deleteVarientController = catchAsync(async (req, res, next) => {
  const variant = await Variant.findByIdAndDelete(req.params.id);

  const product = await Product.findOneAndUpdate(
    { _id: variant.product },
    { $pull: { variants: variant._id } },
    { new: true }
  );

  if (!product) {
    return next(new AppError("No prouduct was found with that ID!", 404));
  }

  await Option.deleteMany({ _id: { $in: variant.options } });

  res.status(204).json({
    status: "success",
    message: "Variant has been deleted successfully",
    data: null,
  });
});

// Get all Options of a Variant:
exports.getOptionsByVariant = catchAsync(async (req, res, next) => {
  const { variantId } = req.params;

  const variant = await Variant.findById(variantId);
  if (!variant) {
    return next(new AppError("No variant found with that ID!", 404));
  }

  // Find options associated with the variant
  const options = await Option.find({ variant: variantId })
    .populate([
      {
        path: "category subCategory brand",
        select: "title",
      },
      {
        path: "product",
        select: "-category -subCategory -brand -variants -__v",
      },
      {
        path: "variant",
        select: "colorName colorCode details",
      },
    ])
    .select("-__v");

  res.status(200).json({
    status: "success",
    results: options.length,
    data: {
      options,
    },
  });
});
