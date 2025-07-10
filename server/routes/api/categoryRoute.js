const express = require("express");
const {
  createCategoryController,
  getAllCategoryController,
  getCategoryController,
  updateCategoryController,
  deleteCategoryController,
  getProductsByCategory,
  getVariantsByCategory,
  getOptionsByCategory,
} = require("../../controllers/categoryController");

const router = express.Router();

router.route("/").post(createCategoryController).get(getAllCategoryController);

router
  .route("/:id")
  .get(getCategoryController)
  .patch(updateCategoryController)
  .delete(deleteCategoryController);

// Get all (Products, Variants, Options) of a Category:
router.get("/:categoryId/products", getProductsByCategory);
router.get("/:categoryId/variants", getVariantsByCategory);
router.get("/:categoryId/options", getOptionsByCategory);

module.exports = router;
