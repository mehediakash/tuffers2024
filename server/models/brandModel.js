const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const brandSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Brand title is required"],
      trim: true,
      unique: true,
    },

    photo: {
      type: String,
      required: [true, "Photo is required"],
      trim: true,
    },

    photoPublicId: {
      type: String,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    slug: {
      type: String,
    },

    // category: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Category",
    //   required: [true, "Category is required"],
    // },

    // subCategory: {
    //   type: Schema.Types.ObjectId,
    //   ref: "SubCategory",
    //   required: [true, "Sub-Category is required"],
    // },

    products: [
      {
        type: Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

brandSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const Brand = model("Brand", brandSchema);
module.exports = Brand;
