const AppError = require("../utils/AppError");
const Product = require("../models/productModel");
const Variant = require("../models/variantModel");
const Option = require("../models/optionModel");
const catchAsync = require("../utils/catchAsync");

exports.searchController = catchAsync(async (req, res, next) => {
  const { query } = req.query;
  if (!query) return next(new AppError("Query parameter is required", 400));

  // Define regex for search
  const searchRegex = new RegExp(query, "i");

  // Search in products
  const products = await Product.find({
    $or: [{ name: searchRegex }, { description: searchRegex }],
  })
    .populate("category subCategory brand", "title")
    .populate({
      path: "variants",
      select: "colorName colorCode options",
      populate: {
        path: "options",
        select: "size price salePrice discountType discountValue",
      },
    })
    .select("name photos description category subCategory brand variants");

  // Search in variants
  const variants = await Variant.find({
    $or: [
      { colorName: searchRegex },
      { colorCode: searchRegex },
      { details: searchRegex },
    ],
  })
    .populate("category subCategory brand", "title")
    .populate("product", "name photos description")
    .populate("options", "-category -subCategory -brand -variant -__v -product")
    .select("-__v");

  const options = await Option.find({
    size: searchRegex,
  })
    .populate({
      path: "category subCategory brand",
      select: "title",
    })
    .populate({
      path: "product",
      select: "name photos description",
    })
    .populate({
      path: "variant",
      select: "colorName colorCode details",
    })
    .select("-__v -product -variant");

  // Dynamically send response data
  const responseData = {};

  if (products.length > 0) responseData.products = products;
  if (variants.length > 0) responseData.variants = variants;
  if (options.length > 0) responseData.options = options;

  const searchResult = products.length + variants.length + options.length;

  if (searchResult < 1)
    return next(new AppError("No Results were found on the server!", 404));

  res.status(200).json({
    status: "success",
    results: searchResult,
    data: responseData,
  });
});
