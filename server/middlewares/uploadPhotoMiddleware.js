const path = require("path");
const multer = require("multer");
const sharp = require("sharp");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const {
  getCloudinaryFolder,
  uploadBufferToCloudinary,
} = require("../services/cloudinaryService");

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image, Please upload images only", 400), false);
  }
};

const upload = multer({ storage: multerStorage, fileFilter: multerFilter });

const uploadPhotoMiddleware = (multiple = false, maxFiles = 4) => {
  return multiple ? upload.array("photos", maxFiles) : upload.single("photo");
};

// IMAGE PROCESSING USING SHARP & DIRECT CLOUDINARY UPLOAD
const resizePhotoMiddleware = (directory) => {
  return catchAsync(async (req, res, next) => {
    // Handle both single and multiple files
    const files = req.file ? [req.file] : req.files || [];

    if (files.length === 0) return next();

    // Define unique suffix function
    const uniqueSuffix = () =>
      Date.now() + "-" + Math.round(Math.random() * 1e9);

    const folder = getCloudinaryFolder(directory);

    const processAndUploadImage = async (file) => {
      const dimensions = {
        product: { width: 900, height: 700, quality: 95 },
        products: { width: 900, height: 700, quality: 95 },
        brand: { width: 450, height: 450, quality: 80 },
        brands: { width: 450, height: 450, quality: 80 },
        reviews: { width: 400, height: 400, quality: 85 },
      }[directory] || { width: 500, height: 500, quality: 90 };

      try {
        let bufferToUpload = file.buffer;

        // Resize with Sharp if not banner
        if (directory !== "banner" && directory !== "banners") {
          const transformer = sharp(file.buffer).resize(
            dimensions.width,
            dimensions.height
          );
          bufferToUpload = await transformer.toBuffer();
        }

        const publicIdName = `${directory}-${uniqueSuffix()}`;
        const result = await uploadBufferToCloudinary(bufferToUpload, {
          folder,
          public_id: publicIdName,
        });

        // Attach Cloudinary details to the file object
        file.secure_url = result.secure_url;
        file.public_id = result.public_id;
        file.url = result.secure_url;
        file.filename = result.secure_url;
        file.fileName = result.secure_url;
        file.path = result.secure_url;
      } catch (err) {
        throw new AppError(
          `Failed while uploading image to Cloudinary: ${err.message}`,
          500
        );
      }
    };

    // Process all files
    await Promise.all(files.map(processAndUploadImage));

    next();
  });
};

module.exports = { uploadPhotoMiddleware, resizePhotoMiddleware };
