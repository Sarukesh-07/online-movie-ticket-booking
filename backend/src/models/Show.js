const mongoose = require("mongoose");

const showSchema = new mongoose.Schema(
  {
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    theatre: { type: String, required: true },
    city: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    price: { type: Number, required: true },
    totalSeats: { type: Number, default: 60 },
    bookedSeats: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Show", showSchema);
