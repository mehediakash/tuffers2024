const express = require("express");
const {
  createOptionController,
  getAllOptionsController,
  getOptionController,
  updateOptionController,
  deleteOptionController,
} = require("../../controllers/optionController");

const router = express.Router();

router.route("/").post(createOptionController).get(getAllOptionsController);

router
  .route("/:id")
  .get(getOptionController)
  .patch(updateOptionController)
  .delete(deleteOptionController);

module.exports = router;
