const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
    catname: {
      type: String,
      required: true,
      trim: true,
    },
    images: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", categorySchema);

