const fs = require("fs");
const Banner = require("../models/bannerModel");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getOne, getAll } = require("../utils/handleFactory");

exports.createBannerController = catchAsync(async (req, res, next) => {
  const body = req.body;

  if (req.file) {
    const { fieldname } = req.file;
    body[fieldname] = `${req.protocol}://${req.get("host")}/uploads/banner/${
      req.file.filename
    }`;
  } else {
    delete body.photo;
  }

  try {
    const banner = await Banner.create(body);
    if (!banner) {
      return next(new AppError("Occured an error while creating banner", 500));
    }

    res.status(201).json({
      status: "success",
      message: "Banner has been added successfully",
      data: {
        banner,
      },
    });
  } catch (error) {
    const filePath = `uploads/banner/${req.file.filename}`;
    fs.unlink(filePath, (err) => {
      if (err && req.file)
        return next(
          new AppError("Something gone wrong while creating banner", 500)
        );
    });

    if (error.errors) {
      const messages = Object.values(error.errors)
        .map((item) => item.properties.message)
        .join(", ");

      return next(new AppError(`Validation failed, ${messages}.`, 400));
    } else if (error.code === 11000) {
      const field = Object.keys(error.keyPattern).join(" ");
      const capitalizeField =
        field.charAt(0).toUpperCase() + field.slice(1).toLocaleLowerCase();

      const message = `${capitalizeField} already exist, Please use another ${field}.`; // ${err.keyValue.name}
      return next(new AppError(message, 409));
    }

    return next(
      new AppError(`Something went wrong while creating banner`, 400)
    );
  }
});

exports.deleteBannerController = catchAsync(async (req, res, next) => {
  const banner = await Banner.findByIdAndDelete(req.params.id);
  if (!banner) {
    return next(new AppError("No banner was found with that ID!", 404));
  }

  // PHOTO DELETING FROM SERVER:
  const photoName = banner.photo.split("/");
  const photoPath = `uploads/banner/${photoName[photoName.length - 1]}`;

  fs.unlink(photoPath, (err) => {
    if (err)
      return next(
        new AppError("Something gone wrong while deleting banner", 500)
      );
  });

  res.status(204).json({
    status: "success",
    data: null,
  });
});

exports.getBannerController = getOne(Banner);

exports.getAllBannerController = getAll(Banner);
