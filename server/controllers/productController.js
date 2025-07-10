const fs = require("fs");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const Variant = require("../models/variantModel");
const Option = require("../models/optionModel");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const deleteFile = require("../utils/deleteFile");
const { getAll, getOne } = require("../utils/handleFactory");

exports.createProductController = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (req.files && req.files.length > 0) {
    body.photos = req.files.map((file) => {
      return `${req.protocol}://${req.get("host")}/uploads/products/${
        file.filename
      }`;
    });
  } else {
    delete body.photos;
  }


  // Add YouTube video URL to the photos array
  if (body.videoUrl && body.videoUrl) {
    body.photos = body.photos || [];
    body.photos.push(body.videoUrl);
  } else if (body.videoUrl) {
    return next(
      new AppError("Invalid link, Please provide a valid YouTube URL", 400)
    );
  }

  try {
    const product = await Product.create(body);
    const brand = await Brand.findOneAndUpdate(
      { _id: product.brand },
      {
        $push: { products: product._id },
      },
      { new: true }
    );

    if (!brand) {
      return next(new AppError("No brand was found with that ID!", 404));
    }

    res.status(201).json({
      status: "success",
      message: "Product has been created successfully",
      data: {
        product,
      },
    });
  } catch (error) {
    if (error.errors) {
      const messages = Object.values(error.errors)
        .map((item) => item.properties.message)
        .join(", ");

      return next(new AppError(`Validation failed, ${messages}.`, 400));
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern).join(" ");
      const capitalizeField =
        field.charAt(0).toUpperCase() + field.slice(1).toLocaleLowerCase();

      const message = `${capitalizeField} already exist, Please use another ${field}.`;
      return next(new AppError(message, 409));
    }

    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        const filePath = `uploads/products/${file.fileName}`;
        fs.unlink(filePath, (err) => {
          if (err) {
            return next(new AppError(`Error removing file: ${filePath}`, 500));
          }
        });
      });
    }

    return next(
      new AppError(`Something went wrong while creating varient`, 400)
    );
  }
});

exports.getAllProductsController = getAll(Product, [
  {
    path: "category subCategory brand",
    select: "title",
  },
  {
    path: "variants",
    select: "-category -subCategory -brand -product -__v",
  },
]);

exports.getProductController = getOne(Product, [
  {
    path: "category subCategory brand",
    select: "title",
  },
  {
    path: "variants",
    select: "-category -subCategory -brand -product -__v",
    populate: {
      path: "options",
      select: "-category -subCategory -brand -product -variant -__v",
    },
  },
]);

exports.updateProductController = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No product was found with that ID!", 404));
  }

  const body = req.body;

  // Handle photo uploads if present
  if (req.files && req.files.length > 0) {
    // Remove old photos from file system
    if (product.photos && product.photos.length > 0) {
      for (const photoPath of product.photos) {
        const photoName = photoPath.split("/").pop();
        const path = `uploads/products/${photoName}`;
        try {
          await deleteFile(path);
        } catch (err) {
          console.error(`Failed to delete file: ${err.message}`);
        }
      }
    }

    // Update photos
    body.photos = req.files.map(
      (file) =>
        `${req.protocol}://${req.get("host")}/uploads/products/${file.filename}`
    );
  }

  const isValidYouTubeUrl = (url) => {
    const regex =
      /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}\?si=[a-zA-Z0-9_-]+$/;
    return regex.test(url);
  };

  if (body.videoUrl) {
    if (!isValidYouTubeUrl(body.videoUrl)) {
      return next(
        new AppError("Invalid link, Please provide a valid YouTube URL", 400)
      );
    }

    // Check if the videoUrl already exists in the photos array
    if (!product.photos.includes(body.videoUrl)) {
      if (body.photos) {
        body.photos.push(body.videoUrl);
      } else {
        product.photos = product.photos || [];
        product.photos.push(body.videoUrl);
      }
    }
  }


  // Update only the fields that are present in the request body
  Object.keys(body).forEach((key) => {
    product[key] = body[key];
  });

  await product.save();

  res.status(200).json({
    status: "success",
    message: "Product has been updated successfully",
    data: {
      product,
    },
  });
});

exports.deleteProductController = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new AppError("No product was found with that ID!", 404));
  }

  // Remove product photos from file system
  if (product.photos && product.photos.length > 0) {
    for (const photoPath of product.photos) {
      const photoName = photoPath.split("/").pop();
      const path = `uploads/products/${photoName}`;

      try {
        await deleteFile(path);
      } catch (err) {
        console.error(`Failed to delete file: ${err.message}`);
        // Continue with the deletion process even if the file deletion fails
      }
    }
  }

  // Find and delete all variants associated with the product
  const variants = await Variant.find({ product: product._id });

  for (const variant of variants) {
    await Option.deleteMany({ variant: variant._id });

    await Variant.findByIdAndDelete(variant._id);
  }

  // Remove the product ID from the associated brand's products array
  await Brand.findOneAndUpdate(
    { _id: product.brand },
    { $pull: { products: product._id } },
    { new: true }
  );

  // Delete the product
  await Product.findByIdAndDelete(product._id);

  res.status(204).json({
    status: "success",
    message:
      "Product and associated variants & options have been deleted successfully",
    data: null,
  });
});

// Get all (Variants, Options) of a Product:
exports.getVariantsByProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("No product found with that ID!", 404));
  }

  // Find variants associated with the product
  const variants = await Variant.find({ product: productId }).select("-__v");

  res.status(200).json({
    status: "success",
    results: variants.length,
    data: {
      variants,
    },
  });
});

exports.getOptionsByProduct = catchAsync(async (req, res, next) => {
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return next(new AppError("No product found with that ID!", 404));
  }

  // Find options associated with the product
  const query = Option.find({ product: productId })
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

  const features = new APIFeatures(query, req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const options = await features.query;

  res.status(200).json({
    status: "success",
    results: options.length,
    data: {
      options,
    },
  });
});
