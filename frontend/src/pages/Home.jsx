import { useEffect, useMemo, useState } from "react";
import api from "../api";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("All");
  const [language, setLanguage] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/movies")
      .then((res) => setMovies(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const genres = useMemo(
    () => ["All", ...new Set(movies.flatMap((movie) => movie.genre || []))],
    [movies]
  );
  const languages = useMemo(
    () => ["All", ...new Set(movies.map((movie) => movie.language))],
    [movies]
  );

  const filtered = movies.filter((movie) => {
    const text = `${movie.title} ${movie.description}`.toLowerCase();
    return (
      text.includes(search.toLowerCase()) &&
      (genre === "All" || movie.genre?.includes(genre)) &&
      (language === "All" || movie.language === language)
    );
  });

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">MOVIE TICKETS, MADE SIMPLE</span>
          <h1>Find your next<br /><span>cinema experience.</span></h1>
          <p>Discover movies, pick your showtime, choose your seats and book in minutes.</p>
          <a href="#movies" className="primary-btn">Explore movies</a>
        </div>
        <div className="hero-art">
          <div className="ticket-art">
            <span>ADMIT ONE</span>
            <strong>CINEBOOK</strong>
            <small>YOUR SEAT AWAITS</small>
          </div>
        </div>
      </section>

      <section id="movies" className="section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">NOW SHOWING</span>
            <h2>Movies</h2>
          </div>
          <span className="movie-count">{filtered.length} titles</span>
        </div>

        <div className="filters">
          <input
            className="search-input"
            placeholder="Search movies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select value={genre} onChange={(e) => setGenre(e.target.value)}>
            {genres.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            {languages.map((item) => <option key={item}>{item}</option>)}
          </select>
        </div>

        {loading ? (
          <Loader />
        ) : filtered.length ? (
          <div className="movie-grid">
            {filtered.map((movie) => <MovieCard key={movie._id} movie={movie} />)}
          </div>
        ) : (
          <div className="empty">No movies match your search.</div>
        )}
      </section>
    </>
  );
}
