const express = require("express");
const authRoute = require("./authRotue");
const categoryRoute = require("./categoryRoute");
const subCategoryRoute = require("./subCategoryRoute");
const brandRoute = require("./brandRoute");
const productRoute = require("./productRoute");
const varientRoute = require("./varientRoute");
const optionRoute = require("./optionRoute");
const searchRoute = require("./searchRoute");
const bannerRoute = require("./bannerRoute");
const discountRoute = require("./discountRoute");
const orderRoute = require("./orderRoute");
const contactRoute = require("./contactRoute");
const couponRoute = require("./couponRoute");
const pathaoLocationRoute = require("./pathaoLocationRoute");

const router = express.Router();

router.use("/auth", authRoute);
router.use("/category", categoryRoute);
router.use("/subCategory", subCategoryRoute);
router.use("/brand", brandRoute);
router.use("/product", productRoute);
router.use("/send", contactRoute);
router.use("/varient", varientRoute);
router.use("/option", optionRoute);
router.use("/search", searchRoute);
router.use("/banner", bannerRoute);
router.use("/discount", discountRoute);
router.use("/order", orderRoute);
router.use("/pathaoLocation", pathaoLocationRoute);
router.use("/coupon", couponRoute);

module.exports = router;
