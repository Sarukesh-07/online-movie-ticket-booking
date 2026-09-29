const express = require("express");
const Show = require("../models/Show");

const router = express.Router();

router.get("/movie/:movieId", async (req, res) => {
  try {
    const shows = await Show.find({ movie: req.params.movieId }).sort({ date: 1, time: 1 });
    res.json(shows);
  } catch {
    res.status(400).json({ message: "Unable to load shows" });
  }
});

router.get("/:id/seats", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id).populate("movie");
    if (!show) return res.status(404).json({ message: "Show not found" });

    const allSeats = [];
    for (let row = 0; row < 6; row++) {
      const letter = String.fromCharCode(65 + row);
      for (let number = 1; number <= 10; number++) {
        allSeats.push(`${letter}${number}`);
      }
    }

    res.json({
      show: {
        id: show._id,
        theatre: show.theatre,
        city: show.city,
        date: show.date,
        time: show.time,
        price: show.price,
        movie: show.movie
      },
      seats: allSeats.map((seat) => ({
        id: seat,
        booked: show.bookedSeats.includes(seat)
      }))
    });
  } catch {
    res.status(400).json({ message: "Unable to load seats" });
  }
});

module.exports = router;
