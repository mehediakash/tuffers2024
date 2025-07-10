const slugify = require("slugify");
const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const subCategorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Sub-Category title is required"],
      
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    slug: {
      type: String,
    },

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required to create sub-category"],
    },

    brands: [
      {
        type: Schema.Types.ObjectId,
        ref: "Brand",
      },
    ],
  },
  {
    timestamps: true,
  }
);

subCategorySchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

const SubCategory = model("SubCategory", subCategorySchema);
module.exports = SubCategory;
