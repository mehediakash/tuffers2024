const express = require("express");
const {
  pathaoZoneController,
  pathaoAreaController,
  createPathaoOrderController,
} = require("../../controllers/pathawLocationController");

const router = express.Router();

router.post("/city/:id/zones", pathaoZoneController);
router.post("/create-order", createPathaoOrderController);
router.post("/zone/:id/area-list", pathaoAreaController);

module.exports = router;
