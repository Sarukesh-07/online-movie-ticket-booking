const express = require("express");
const crypto = require("crypto");

const auth = require("../middleware/auth");
const Show = require("../models/Show");
const Booking = require("../models/Booking");

const router = express.Router();

/*
  CREATE BOOKING
  POST /api/bookings
*/
router.post("/", auth, async (req, res) => {
  try {
    const { showId, seats } = req.body;

    // Validate input
    if (!showId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        message: "Show and at least one seat are required",
      });
    }

    // Remove duplicate seats
    const uniqueSeats = [...new Set(seats)];

    if (uniqueSeats.length !== seats.length) {
      return res.status(400).json({
        message: "Duplicate seats selected",
      });
    }

    // Find show
    const show = await Show.findById(showId).populate("movie");

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    // Check whether seats are already booked
    const alreadyBooked = uniqueSeats.filter((seat) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        message: `These seats are already booked: ${alreadyBooked.join(", ")}`,
      });
    }

    // Add selected seats to booked seats
    show.bookedSeats.push(...uniqueSeats);

    await show.save();

    // Calculate total amount
    const amount = uniqueSeats.length * show.price;

    // Generate booking code
    const bookingCode = `MB-${crypto
      .randomBytes(4)
      .toString("hex")
      .toUpperCase()}`;

    // Create booking
    const booking = await Booking.create({
      user: req.user._id,
      show: show._id,
      movie: show.movie._id,
      seats: uniqueSeats,
      amount,
      bookingCode,
      status: "CONFIRMED",
    });

    // Get complete booking information
    const populatedBooking = await Booking.findById(booking._id)
      .populate("movie")
      .populate("show");

    return res.status(201).json(populatedBooking);
  } catch (error) {
    console.error("BOOKING ERROR:", error);

    return res.status(500).json({
      message: "Booking failed",
      error: error.message,
    });
  }
});


/*
  GET USER BOOKINGS
  GET /api/bookings/my
*/
router.get("/my", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({
      user: req.user._id,
    })
      .populate("movie")
      .populate("show")
      .sort({ createdAt: -1 });

    return res.json(bookings);
  } catch (error) {
    console.error("BOOKING HISTORY ERROR:", error);

    return res.status(500).json({
      message: "Unable to load booking history",
      error: error.message,
    });
  }
});


/*
  CANCEL BOOKING
  PATCH /api/bookings/:id/cancel
*/
router.patch("/:id/cancel", auth, async (req, res) => {
  try {
    // Find user's booking
    const booking = await Booking.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Check cancellation status
    if (booking.status === "CANCELLED") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // Find show
    const show = await Show.findById(booking.show);

    if (show) {
      // Remove the booked seats
      show.bookedSeats = show.bookedSeats.filter(
        (seat) => !booking.seats.includes(seat)
      );

      await show.save();
    }

    // Update booking status
    booking.status = "CANCELLED";

    await booking.save();

    return res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("CANCEL BOOKING ERROR:", error);

    return res.status(500).json({
      message: "Cancellation failed",
      error: error.message,
    });
  }
});


module.exports = router;