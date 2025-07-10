const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const variantSchema = new Schema({
  colorName: {
    type: String,
    required: [true, "Color name is required"],
  },

  colorCode: {
    type: String,
    required: [true, "Color code is required"],
    minLength: [4, "Color code length can't be less than 4 characters"],
    maxLength: [7, "Color code length can't be more than 7 characters"],
    validate: {
      validator: function (value) {
        return /^#([0-9A-Fa-f]{3}){1,2}$/.test(value);
      },
      message: (props) =>
        `${props.value} is not a valid hexadecimal color code!`,
    },
  },

  details: {
    type: String,
  },

  options: [
    {
      type: Schema.Types.ObjectId,
      ref: "Option",
    },
  ],

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
});

// Compound index to ensure unique combination of colorName and product
variantSchema.index({ product: 1, colorName: 1 }, { unique: true });

const Variant = model("Variant", variantSchema);
module.exports = Variant;
