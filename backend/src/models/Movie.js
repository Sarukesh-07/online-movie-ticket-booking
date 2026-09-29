const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    poster: { type: String, required: true },
    backdrop: { type: String, default: "" },
    genre: [{ type: String }],
    language: { type: String, required: true },
    duration: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    releaseDate: { type: Date },
    certificate: { type: String, default: "U/A" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Movie", movieSchema);
