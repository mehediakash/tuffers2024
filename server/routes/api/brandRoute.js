const express = require("express");
const {
  uploadPhotoMiddleware,
  resizePhotoMiddleware,
} = require("../../middlewares/uploadPhotoMiddleware");
const {
  createBrandController,
  getAllBrandsController,
  getBrandController,
  updateBrandController,
  deleteBrandController,
  getProductsByBrand,
  getVariantsByBrand,
  getOptionsByBrand,
} = require("../../controllers/brandController");

const router = express.Router();

router
  .route("/")
  .post(
    uploadPhotoMiddleware(),
    resizePhotoMiddleware("brand"),
    createBrandController
  )
  .get(getAllBrandsController);

router
  .route("/:id")
  .get(getBrandController)
  .patch(
    uploadPhotoMiddleware(),
    resizePhotoMiddleware("brand"),
    updateBrandController
  )
  .delete(deleteBrandController);

// Get all (Products, Variants, Options) of a Brand:
router.get("/:brandId/products", getProductsByBrand);
router.get("/:brandId/variants", getVariantsByBrand);
router.get("/:brandId/options", getOptionsByBrand);

module.exports = router;
