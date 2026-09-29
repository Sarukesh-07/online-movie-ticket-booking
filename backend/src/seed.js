require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const User = require("./models/User");
const Movie = require("./models/Movie");
const Show = require("./models/Show");

const movies = [
  {
    title: "Interstellar",
    description: "A team of explorers travels through a wormhole in space in search of a new home for humanity.",
    poster: "https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/xJHokMbljvjADYdit5fK5LQ6M5J.jpg",
    genre: ["Sci-Fi", "Drama", "Adventure"],
    language: "English",
    duration: 169,
    rating: 8.7,
    releaseDate: "2014-11-07",
    certificate: "U/A"
  },
  {
    title: "Inception",
    description: "A skilled extractor who steals secrets through dream-sharing technology is offered a chance to erase his past.",
    poster: "https://image.tmdb.org/t/p/w500/oYuLEt3zVCKq57qu2F8dT7NIa6f.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/8ZTVqvKDQ8emSGUEMjsS4yHAwrp.jpg",
    genre: ["Action", "Sci-Fi", "Thriller"],
    language: "English",
    duration: 148,
    rating: 8.8,
    releaseDate: "2010-07-16",
    certificate: "U/A"
  },
  {
    title: "Jailer",
    description: "A retired jailer is drawn back into action when a dangerous criminal threatens his family.",
    poster: "https://image.tmdb.org/t/p/w500/AeP8wJZ4Q9gY8gQ4QW3Kq3x2F1D.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/9zq9Qx3oQ8g2mY8Z3L2V6W6R7Qp.jpg",
    genre: ["Action", "Drama"],
    language: "Tamil",
    duration: 168,
    rating: 7.1,
    releaseDate: "2023-08-10",
    certificate: "U/A"
  },
  {
    title: "Kantara",
    description: "A village guardian faces a conflict between tradition, power and a long-standing mystery.",
    poster: "https://image.tmdb.org/t/p/w500/1fV9G8Y0L7X2F2K8X5N2Y7Q1M6A.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/2fV9G8Y0L7X2F2K8X5N2Y7Q1M6A.jpg",
    genre: ["Action", "Drama", "Thriller"],
    language: "Kannada",
    duration: 148,
    rating: 8.0,
    releaseDate: "2022-09-30",
    certificate: "U/A"
  },
  {
    title: "Leo",
    description: "A quiet café owner is forced to confront a violent past after a sudden incident puts him in the spotlight.",
    poster: "https://image.tmdb.org/t/p/w500/cQ0D1gZ7F2K4P8N5V9L1M6A3B7C.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/cQ0D1gZ7F2K4P8N5V9L1M6A3B7C.jpg",
    genre: ["Action", "Thriller"],
    language: "Tamil",
    duration: 164,
    rating: 7.2,
    releaseDate: "2023-10-19",
    certificate: "U/A"
  },
  {
    title: "Dune: Part Two",
    description: "Paul Atreides unites with Chani and the Fremen while seeking revenge against those who destroyed his family.",
    poster: "https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    backdrop: "https://image.tmdb.org/t/p/w1280/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg",
    genre: ["Sci-Fi", "Adventure", "Drama"],
    language: "English",
    duration: 166,
    rating: 8.6,
    releaseDate: "2024-03-01",
    certificate: "U/A"
  }
];

async function seed() {
  await connectDB();

  await User.deleteMany({});
  await Movie.deleteMany({});
  await Show.deleteMany({});

  const password = await bcrypt.hash("demo123", 10);
  await User.create({
    name: "Demo User",
    email: "demo@example.com",
    password
  });

  const inserted = await Movie.insertMany(movies);
  const today = new Date();
  const date1 = today.toISOString().slice(0, 10);
  const tomorrow = new Date(today.getTime() + 86400000).toISOString().slice(0, 10);

  const shows = [];
  for (const movie of inserted) {
    shows.push(
      {
        movie: movie._id,
        theatre: "PVR Cinemas - Grand Mall",
        city: "Chennai",
        date: date1,
        time: "10:00 AM",
        price: 180
      },
      {
        movie: movie._id,
        theatre: "INOX - Phoenix Marketcity",
        city: "Chennai",
        date: date1,
        time: "02:30 PM",
        price: 220
      },
      {
        movie: movie._id,
        theatre: "AGS Cinemas",
        city: "Chennai",
        date: tomorrow,
        time: "07:30 PM",
        price: 200
      }
    );
  }

  await Show.insertMany(shows);

  console.log("Seed complete.");
  console.log("Demo login: demo@example.com / demo123");
  process.exit(0);
}

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
