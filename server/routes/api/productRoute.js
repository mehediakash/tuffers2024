const express = require("express");
const {
  uploadPhotoMiddleware,
  resizePhotoMiddleware,
} = require("../../middlewares/uploadPhotoMiddleware");
const {
  createProductController,
  getAllProductsController,
  getProductController,
  updateProductController,
  deleteProductController,
  getVariantsByProduct,
  getOptionsByProduct,
} = require("../../controllers/productController");

const router = express.Router();

router
  .route("/")
  .post(
    uploadPhotoMiddleware(true, 4),
    resizePhotoMiddleware("products"),
    createProductController
  )
  .get(getAllProductsController);

router
  .route("/:id")
  .get(getProductController)
  .patch(
    uploadPhotoMiddleware(true, 4),
    resizePhotoMiddleware("products"),
    updateProductController
  )
  .delete(deleteProductController);

// Get all (Variants, Options) of a Product:
router.get("/:productId/variants", getVariantsByProduct);
router.get("/:productId/options", getOptionsByProduct);

module.exports = router;
