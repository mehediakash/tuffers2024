const mongoose = require("mongoose");
const Order = require("../models/orderModel");
const Option = require("../models/optionModel");
const Coupon = require("../models/couponModel");
const Email = require("../utils/Email");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const { getAll, getOne, deleteOne } = require("../utils/handleFactory");

exports.createOrderController = catchAsync(async (req, res, next) => {
  // Aggregate the product prices
  const productAggregation = await Option.aggregate([
    {
      $match: {
        _id: {
          $in: req.body.products.map(
            (item) => new mongoose.Types.ObjectId(item.option)
          ),
        },
      },
    },
    {
      $project: {
        price: 1,
        salePrice: 1,
        freeShipping: 1,
      },
    },
    {
      $addFields: {
        effectivePrice: {
          $cond: {
            if: { $gt: ["$salePrice", 0] },
            then: "$salePrice",
            else: "$price",
          },
        },
      },
    },
  ]);

  // Calculate the total product cost
  let isFreeShipping = false;

  const productTotal = req.body.products.reduce((total, product) => {
    const option = productAggregation.find((v) =>
      v._id.equals(new mongoose.Types.ObjectId(product.option))
    );

    if (option) {
      if (option.freeShipping === true) isFreeShipping = true;

      return total + option.effectivePrice * product.quantity;
    }

    return total;
  }, 0);

  // Add the shipping cost to the total
  if (isFreeShipping) req.body.shippingCost = 0;
  const totalCost = productTotal + req.body.shippingCost;

  // Create the order with the calculated total cost
  let order = await Order.create({
    ...req.body,
    totalCost,
  });

  order = await Order.findById(order._id).populate({
    path: "products.option",
    select: "sku size price salePrice discountType discountValue",
    populate: {
      path: "product variant",
      select: "name colorName colorCode",
    },
  });

  // Update the sellNumber for each variant in the order
  await Promise.all(
    order.products.map(async (product) => {
      await Option.findByIdAndUpdate(
        product.option._id, // Accessing the correct ID
        { $inc: { saleNumber: product.quantity } },
        { new: true }
      );
    })
  );

  const orderUrl = `${req.protocol}://localhost:5173/orders/${order._id}`;
    if (order.email) {
    const email = new Email({ email: order.email, name: order.name }, orderUrl);
    await email.sendInvoice(order);
  }

  res.status(201).json({
    status: "success",
    message: "Order request sent successfully, Check your email inbox please",
    data: {
      order,
    },
  });
});

// WITH COUPON CODE:
exports.createOrderWithCouponController = catchAsync(async (req, res, next) => {
  const { coupon, products } = req.body;

  if (!coupon) {
    return next(
      new AppError("You need to enter a coupon code to use this route", 400)
    );
  }

  // Check if the coupon is valid
  const couponData = await Coupon.findOne({
    coupon,
    isActive: true,
    validFrom: { $lte: new Date() },
    validUntil: { $gte: new Date() },
  });

  if (!couponData) {
    return next(new AppError("Invalid, inactive, or expired coupon code", 400));
  }

  // Aggregate the product prices
  const productAggregation = await Option.aggregate([
    {
      $match: {
        _id: {
          $in: products.map((item) => new mongoose.Types.ObjectId(item.option)),
        },
      },
    },
    {
      $project: {
        price: 1,
        salePrice: 1,
        freeShipping: 1,
      },
    },
  ]);

  // Calculate the total product cost
  let isFreeShipping = false;

  const productTotal = products.reduce((total, product) => {
    const option = productAggregation.find((v) =>
      v._id.equals(new mongoose.Types.ObjectId(product.option))
    );

    if (option) {
      if (option.freeShipping === true) isFreeShipping = true;
      return total + option.price * product.quantity;
    }

    return total;
  }, 0);

  // Calculate the discount based on the coupon
  const couponDiscount = (productTotal * couponData.discountPercent) / 100;
  const discountedProductTotal = productTotal - couponDiscount;

  // Calculate the final total cost including shipping
  if (isFreeShipping) req.body.shippingCost = 0;
  const totalCost = discountedProductTotal + req.body.shippingCost;

  // Create the order with the calculated total cost
  let order = await Order.create({
    ...req.body,
    totalCost,
    couponDiscount: couponDiscount,
  });

  order = await Order.findById(order._id)
    .populate({
      path: "products.option",
      select: "sku size price salePrice discountType discountValue",
      populate: {
        path: "product variant",
        select: "name colorName colorCode",
      },
    })
    .select("-__v");

  // Update the sellNumber for each option in the order
  await Promise.all(
    order.products.map(async (product) => {
      await Option.findByIdAndUpdate(
        product.option._id,
        { $inc: { sellNumber: product.quantity } },
        { new: true }
      );
    })
  );

  const orderUrl = `${req.protocol}://localhost:5173/orders/${order._id}`;

 if (order.email) {
    const email = new Email({ email: order.email, name: order.name }, orderUrl);
    await email.sendInvoiceWithCoupon(order, couponData.discountPercent);
  }

  res.status(201).json({
    status: "success",
    message: "Order request sent successfully, Check your email inbox please",
    data: {
      order,
    },
  });
});

exports.getAllOrdersController = getAll(Order, {
  path: "products.option",
  select: "-__v",
  populate: {
    path: "category subCategory brand product variant",
    select: "title name colorName colorCode",
  },
});

exports.getOrderController = getOne(Order, {
  path: "products.option",
  select: "-__v",
  populate: {
    path: "category subCategory brand product variant",
    select: "title name colorName colorCode",
  },
});

exports.updateOrderController = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })
    .populate({
      path: "products.option",
      select: "sku size price salePrice discountType discountValue",
      populate: {
        path: "product variant",
        select: "name colorName colorCode",
      },
    })
    .select("-__v");

  if (!order) return next(new AppError("No order found with that ID!", 404));

  const orderUrl = `${req.protocol}://localhost:5173/orders/${order._id}`;
  const email = new Email({ email: order.email, name: order.name }, orderUrl);

  const { orderStatus } = req.body;
  if (["approved", "delivered", "shipped", "canceled"].includes(orderStatus)) {
    await email.sendInvoice(order);
  }

  res.status(200).json({
    status: "success",
    message: "Order has been updated successfully",
    data: {
      order,
    },
  });
});

exports.deleteOrderController = deleteOne(Order);
