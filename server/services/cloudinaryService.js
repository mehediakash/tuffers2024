const path = require("path");
const cloudinary = require("../config/cloudinary");
const deleteFile = require("../utils/deleteFile");

/**
 * Extract Cloudinary public_id from a Cloudinary URL or return the public_id as is.
 * @param {string} urlOrId
 * @returns {string|null}
 */
const extractPublicId = (urlOrId) => {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  if (!urlOrId.includes("cloudinary.com")) return urlOrId;

  try {
    const parts = urlOrId.split("/upload/");
    if (parts.length < 2) return null;
    const subParts = parts[1].split("/");
    const cleanParts = [];
    let foundVersionOrFolder = false;

    for (let i = 0; i < subParts.length; i++) {
      const p = subParts[i];
      if (!foundVersionOrFolder && /^v\d+$/.test(p)) {
        foundVersionOrFolder = true;
        continue;
      }
      if (
        !foundVersionOrFolder &&
        i < subParts.length - 1 &&
        (p.includes(",") || /^[a-z]_[a-z0-9_]+$/i.test(p))
      ) {
        continue;
      }
      foundVersionOrFolder = true;
      cleanParts.push(p);
    }
    return cleanParts.join("/").replace(/\.[^/.]+$/, "");
  } catch (err) {
    return null;
  }
};

/**
 * Determine Cloudinary folder name from entity directory.
 * @param {string} directory
 * @returns {string}
 */
const getCloudinaryFolder = (directory) => {
  const map = {
    banner: "tuffers/banners",
    banners: "tuffers/banners",
    brand: "tuffers/brands",
    brands: "tuffers/brands",
    product: "tuffers/products",
    products: "tuffers/products",
    user: "tuffers/users",
    users: "tuffers/users",
    review: "tuffers/reviews",
    reviews: "tuffers/reviews",
  };
  return map[directory] || `tuffers/${directory || "misc"}`;
};

/**
 * Upload a single buffer directly to Cloudinary using upload_stream.
 * @param {Buffer} buffer - Buffer to upload
 * @param {Object} options - Cloudinary upload options (e.g., folder, public_id, transformation)
 * @returns {Promise<{ secure_url: string, public_id: string, url: string }>}
 */
const uploadBufferToCloudinary = (buffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",
        ...options,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
    uploadStream.end(buffer);
  });
};

/**
 * Upload multiple file buffers to Cloudinary.
 * @param {Array<{ buffer: Buffer, options?: Object }>} files
 * @param {Object} defaultOptions
 * @returns {Promise<Array<{ secure_url: string, public_id: string }>>}
 */
const uploadMultipleBuffersToCloudinary = async (files, defaultOptions = {}) => {
  if (!Array.isArray(files) || files.length === 0) return [];

  const uploadPromises = files.map((file) => {
    const buffer = file.buffer || file;
    const options = { ...defaultOptions, ...(file.options || {}) };
    return uploadBufferToCloudinary(buffer, options);
  });

  return Promise.all(uploadPromises);
};

/**
 * Delete image from Cloudinary using public_id or URL.
 * @param {string} publicIdOrUrl
 * @returns {Promise<Object|null>}
 */
const deleteFromCloudinary = async (publicIdOrUrl) => {
  if (!publicIdOrUrl || typeof publicIdOrUrl !== "string") return null;

  const publicId = extractPublicId(publicIdOrUrl);
  if (!publicId) return null;

  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`Failed to delete Cloudinary image (${publicId}):`, error.message);
    return null;
  }
};

/**
 * Safely delete an image whether it is stored on Cloudinary or locally on disk.
 * @param {string} photoUrlOrPath - Cloudinary URL, public_id, or local /uploads/... path
 * @param {string} [subDirectory] - Optional sub-directory (e.g., "products", "brand", "banner")
 * @returns {Promise<void>}
 */
const deleteImageSafe = async (photoUrlOrPath, subDirectory) => {
  if (!photoUrlOrPath || typeof photoUrlOrPath !== "string") return;

  // If it's a YouTube URL or external non-image, skip
  if (photoUrlOrPath.includes("youtube.com") || photoUrlOrPath.includes("youtu.be")) {
    return;
  }

  // If it's a Cloudinary URL
  if (photoUrlOrPath.includes("cloudinary.com")) {
    await deleteFromCloudinary(photoUrlOrPath);
    return;
  }

  // If it's a local file path or URL
  if (photoUrlOrPath.includes("/uploads/") || photoUrlOrPath.includes("uploads/")) {
    try {
      const fileName = photoUrlOrPath.split("/").pop();
      let targetPath;
      if (subDirectory) {
        targetPath = path.join(__dirname, "..", "uploads", subDirectory, fileName);
      } else {
        const match = photoUrlOrPath.match(/uploads\/([^/]+)\//);
        const folder = match ? match[1] : "";
        targetPath = folder
          ? path.join(__dirname, "..", "uploads", folder, fileName)
          : path.join(__dirname, "..", "uploads", fileName);
      }

      await deleteFile(targetPath);
    } catch (err) {
      // Local file cleanup failure should not crash the flow
      console.log(`Local file cleanup notice: ${err.message}`);
    }
    return;
  }

  // Fallback: If it's a Cloudinary public_id (e.g., 'tuffers/products/xyz')
  if (photoUrlOrPath.startsWith("tuffers/")) {
    await deleteFromCloudinary(photoUrlOrPath);
  }
};

module.exports = {
  extractPublicId,
  getCloudinaryFolder,
  uploadBufferToCloudinary,
  uploadMultipleBuffersToCloudinary,
  deleteFromCloudinary,
  deleteImageSafe,
};
