const express = require("express");
const {
  createBannerController,
  getAllBannerController,
  getBannerController,
  deleteBannerController,
} = require("../../controllers/bannerController");
const {
  uploadPhotoMiddleware,
  resizePhotoMiddleware,
} = require("../../middlewares/uploadPhotoMiddleware");

const router = express.Router();

router
  .route("/")
  .post(
    uploadPhotoMiddleware(),
    resizePhotoMiddleware("banner"),
    createBannerController
  )
  .get(getAllBannerController);

router.route("/:id").get(getBannerController).delete(deleteBannerController);

module.exports = router;
