const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const optionSchema = new Schema({
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
  },

  size: {
    type: String,
    required: [true, "Size is required"],
  },

  price: {
    type: Number,
    required: [true, "Price is required"],
  },

  salePrice: {
    type: Number,
    default: 0,
  },

  stock: {
    type: Number,
    required: [true, "Stock number is required"],
  },

  discountType: {
    type: String,
    enum: {
      values: ["none", "percent", "amount"],
      message: "{VALUE} is not supported, Enter a valid discount type",
    },
    default: "none",
  },

  discountValue: {
    type: Number,
    default: 0,
  },

  freeShipping: {
    type: Boolean,
    default: false,
  },

  visitCount: {
    type: Number,
    default: 0,
  },

  saleNumber: {
    type: Number,
    default: 0,
  },

  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    required: [true, "Category is required"],
  },

  subCategory: {
    type: Schema.Types.ObjectId,
    ref: "SubCategory",
    required: [true, "Sub-Category is required"],
  },

  brand: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: [true, "Brand is required"],
  },

  product: {
    type: Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product id is required"],
  },

  variant: {
    type: Schema.Types.ObjectId,
    ref: "Variant",
    required: [true, "Variant is required"],
  },
});

// To avoid duplicate Size for a same Color
optionSchema.index({ variant: 1, size: 1 }, { unique: true });

// To uppercase the "size" property
optionSchema.pre("save", function (next) {
  this.size = this.size.toUpperCase();
  next();
});

const Option = model("Option", optionSchema);
module.exports = Option;
