const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const couponSchema = new Schema(
  {
    coupon: {
      type: String,
      required: [true, "Coupon code is required"],
      minLength: [5, "Coupon code length must be 5 characters"],
      maxLength: [5, "Coupon code length must be 5 characters"],
      unique: true,
      trim: true,
    },

    discountPercent: {
      type: Number,
      required: [true, "Discount percentage is required"],
      min: [0, "Discount percentage must be at least 0"],
      max: [100, "Discount percentage cannot exceed 100"],
    },

    validFrom: {
      type: Date,
      required: [true, "Start date is required"],
    },

    validUntil: {
      type: Date,
      required: [true, "End date is required"],
      validate: {
        validator: function (value) {
          return value >= this.validFrom;
        },
        message: "valid Until date must be after or equal to validFrom date",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = model("Coupon", couponSchema);
module.exports = Coupon;
