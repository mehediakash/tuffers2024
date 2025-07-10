const fs = require("fs").promises;
const path = require("path");
const SubCategory = require("../models/subCategoryModel");
const Brand = require("../models/brandModel");
const Product = require("../models/productModel");
const Variant = require("../models/variantModel");
const Option = require("../models/optionModel");
const APIFeatures = require("../utils/APIFeatures");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const deleteFile = require("../utils/deleteFile");
const { getOne, getAll } = require("../utils/handleFactory");

exports.createBrandController = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (req.file) {
    body.photo = `${req.protocol}://${req.get("host")}/uploads/brand/${
      req.file.filename
    }`;
  } else {
    delete body.photo;
  }

  try {
    const brand = await Brand.create(body);

    const subCategory = await SubCategory.findOneAndUpdate(
      { _id: brand.subCategory },
      { $push: { brands: brand._id } },
      { new: true }
    );

    // if (!subCategory) {
    //   return next(new AppError("No sub-category was found with that ID!", 404));
    // }

    res.status(201).json({
      status: "success",
      message: "Brand has been created successfully",
      data: {
        brand,
      },
    });
  } catch (error) {
    if (req.file) {
      const filePath = `uploads/brand/${req.file.filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          return next(
            new AppError("Something went wrong while creating the brand", 500)
          );
        }
      });
    }

    if (error.errors) {
      const messages = Object.values(error.errors)
        .map((item) => item.properties.message)
        .join(", ");
      return next(new AppError(`Validation failed, ${messages}.`, 400));
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern).join(" ");
      const capitalizeField =
        field.charAt(0).toUpperCase() + field.slice(1).toLocaleLowerCase();

      const message = `${capitalizeField} already exists, Please use another ${field}.`;
      return next(new AppError(message, 409));
    }

    return next(
      new AppError("Something went unexpected while creating the brand", 400)
    );
  }
});

exports.updateBrandController = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new AppError("No brand was found with that ID!", 404));
  }

  const body = req.body;

  let oldPhotoLink = null;
  if (brand.photo) {
    const photoName = brand.photo.split("/");
    oldPhotoLink = `uploads/brand/${photoName[photoName.length - 1]}`;
  }

  if (req.file) {
    body.photo = `${req.protocol}://${req.get("host")}/uploads/brand/${
      req.file.filename
    }`;
  } else {
    delete body.photo;
  }

  Object.keys(body).forEach((key) => {
    brand[key] = body[key];
  });

  await brand.save();

  // Delete old photo if a new one was uploaded and an old photo exists
  if (req.file && oldPhotoLink) {
    fs.unlink(oldPhotoLink, (err) => {
      if (err) {
        console.error("Failed to delete old photo:", err);
      }
    });
  }

  res.status(200).json({
    status: "success",
    message: "Brand has been updated successfully",
    data: {
      brand,
    },
  });
});

exports.getBrandController = getOne(Brand);

exports.getAllBrandsController = getAll(Brand);

exports.deleteBrandController = catchAsync(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) {
    return next(new AppError("No brand was found with that ID!", 404));
  }

  // Delete brand photo if it exists
  if (brand.photo) {
    const photoName = brand.photo.split("/").pop();
    const photoPath = path.join(__dirname, "..", "uploads", "brand", photoName);

    try {
      await fs.access(photoPath); // Check if the file exists
      await deleteFile(photoPath);
    } catch (err) {
      console.error(`Failed to delete file: ${err.message}`);
      // Continue with the brand deletion even if the file deletion fails
    }
  }

  // Find all products associated with this brand
  const products = await Product.find({ brand: brand._id });

  for (const product of products) {
    // Delete product photos if they exist
    if (product.photos && product.photos.length > 0) {
      for (const photoPath of product.photos) {
        const photoName = photoPath.split("/").pop();
        const productPhotoPath = path.join(
          __dirname,
          "..",
          "uploads",
          "products",
          photoName
        );

        try {
          await fs.access(productPhotoPath); // Check if the file exists
          await deleteFile(productPhotoPath);
        } catch (err) {
          console.error(`Failed to delete file: ${err.message}`);
          // Continue with the product deletion even if the file deletion fails
        }
      }
    }

    // Find all variants associated with this product
    const variants = await Variant.find({ product: product._id });

    for (const variant of variants) {
      // Find and delete all options associated with this variant
      await Option.deleteMany({ variant: variant._id });

      // Delete the variant itself
      await Variant.findByIdAndDelete(variant._id);
    }

    // Delete the product itself
    await Product.findByIdAndDelete(product._id);
  }

  // Delete the brand itself
  await Brand.findByIdAndDelete(brand._id);

  res.status(204).json({
    status: "success",
    message:
      "Brand has been deleted successfully with all associated products, variants, and options.",
    data: null,
  });
});

// Get all (Products, Variants, Options) of a Brand:
exports.getProductsByBrand = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);
  if (!brand) {
    return next(new AppError("No brand found with that ID!", 404));
  }

  // Find products associated with the brand
  const products = await Product.find({ brand: brandId }).select("-__v");

  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getVariantsByBrand = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);
  if (!brand) {
    return next(new AppError("No brand found with that ID!", 404));
  }

  // Find variants associated with the brand
  const variants = await Variant.find({ brand: brandId }).select("-__v");

  res.status(200).json({
    status: "success",
    results: variants.length,
    data: {
      variants,
    },
  });
});

exports.getOptionsByBrand = catchAsync(async (req, res, next) => {
  const { brandId } = req.params;

  const brand = await Brand.findById(brandId);
  if (!brand) {
    return next(new AppError("No brand found with that ID!", 404));
  }

  // Find options associated with the brand
  const query = Option.find({ brand: brandId })
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
