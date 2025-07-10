const express = require("express");
const {
  createSubCategoryController,
  getAllSubCategoryController,
  getSubCategoryController,
  updateSubCategoryController,
  deleteSubCategoryController,
  getProductsBySubCategory,
  getVariantsBySubCategory,
  getOptionsBySubCategory,
} = require("../../controllers/subCategoryController");

const router = express.Router();

router
  .route("/")
  .post(createSubCategoryController)
  .get(getAllSubCategoryController);

router
  .route("/:id")
  .get(getSubCategoryController)
  .patch(updateSubCategoryController)
  .delete(deleteSubCategoryController);

// Get all (Products, Variants, Options) of a Sub-Category:
router.get("/:subCategoryId/products", getProductsBySubCategory);
router.get("/:subCategoryId/variants", getVariantsBySubCategory);
router.get("/:subCategoryId/options", getOptionsBySubCategory);

module.exports = router;
