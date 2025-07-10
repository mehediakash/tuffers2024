const Option = require("../models/optionModel");
const Variant = require("../models/variantModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getOne, getAll, updateOne } = require("../utils/handleFactory");

exports.createOptionController = catchAsync(async (req, res, next) => {
  const option = await Option.create(req.body);

  const variant = await Variant.findOneAndUpdate(
    { _id: option.variant },
    { $push: { options: option._id } },
    { new: true }
  );

  if (!variant) {
    return next(new AppError("No variant was found with that ID!", 404));
  }

  res.status(201).json({
    status: "success",
    message: "Option has been created successfully",
    data: {
      option,
    },
  });
});

exports.getAllOptionsController = getAll(Option, [
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
    select: "-category -subCategory -brand -variants -product -options -__v",
  },
]);

exports.getOptionController = catchAsync(async (req, res, next) => {
  let query = Option.findById(req.params.id).select("-__v");

  const popOptions = [
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
      select: "-category -subCategory -brand -variants -product -options -__v",
    },
  ];

  if (popOptions) {
    // If popOptions is an array, populate each option
    if (Array.isArray(popOptions)) {
      popOptions.forEach((option) => {
        query = query.populate(option);
      });
    } else {
      query = query.populate(popOptions);
    }
  }

  const doc = await query;
  if (!doc) return next(new AppError("No document found with that ID!", 404));

  // Visit Count feature:
  await Option.findOneAndUpdate(
    { _id: req.params.id },
    { $inc: { visitCount: 1 } },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      doc,
    },
  });
});

exports.updateOptionController = updateOne(Option);

exports.deleteOptionController = catchAsync(async (req, res, next) => {
  const option = await Option.findByIdAndDelete(req.params.id);

  const variant = await Variant.findOneAndUpdate(
    { _id: option.variant },
    { $pull: { options: option._id } },
    { new: true }
  );

  if (!variant) {
    return next(new AppError("No variant was found with that ID!", 404));
  }

  res.status(204).json({
    status: "success",
    message: "Option has been deleted successfully",
    data: null,
  });
});
