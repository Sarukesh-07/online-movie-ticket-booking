const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, genre, language } = req.query;
    const query = {};

    if (search) query.title = { $regex: search, $options: "i" };
    if (genre && genre !== "All") query.genre = genre;
    if (language && language !== "All") query.language = language;

    const movies = await Movie.find(query).sort({ releaseDate: -1, title: 1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: "Unable to load movies" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    res.json(movie);
  } catch {
    res.status(400).json({ message: "Invalid movie id" });
  }
});

module.exports = router;
