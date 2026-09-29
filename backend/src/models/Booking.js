const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    show: { type: mongoose.Schema.Types.ObjectId, ref: "Show", required: true },
    movie: { type: mongoose.Schema.Types.ObjectId, ref: "Movie", required: true },
    seats: [{ type: String, required: true }],
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED"
    },
    bookingCode: { type: String, required: true, unique: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
