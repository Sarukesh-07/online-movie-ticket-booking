import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

export default function MovieDetails({ user }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([api.get(`/movies/${id}`), api.get(`/shows/movie/${id}`)])
      .then(([movieRes, showRes]) => {
        setMovie(movieRes.data);
        setShows(showRes.data);
      })
      .catch((err) => setError(err.response?.data?.message || "Unable to load movie"));
  }, [id]);

  if (error) return <div className="empty">{error}</div>;
  if (!movie) return <Loader />;

  const grouped = shows.reduce((acc, show) => {
    acc[show.date] ||= [];
    acc[show.date].push(show);
    return acc;
  }, {});

  return (
    <>
      <section className="movie-detail">
        <div className="detail-backdrop" style={{ backgroundImage: `url(${movie.backdrop || movie.poster})` }} />
        <div className="detail-content">
          <img className="detail-poster" src={movie.poster} alt={movie.title} />
          <div className="detail-info">
            <Link className="back-link" to="/">← Back to movies</Link>
            <span className="eyebrow">{movie.certificate} · {movie.language}</span>
            <h1>{movie.title}</h1>
            <div className="meta-row">
              <span>★ {movie.rating}</span>
              <span>{movie.duration} min</span>
              <span>{movie.genre?.join(" · ")}</span>
            </div>
            <p>{movie.description}</p>
          </div>
        </div>
      </section>

      <section className="section showtimes-section">
        <div className="section-heading">
          <div>
            <span className="eyebrow">SELECT A SHOW</span>
            <h2>Showtimes</h2>
          </div>
        </div>

        {!user && (
          <div className="notice">
            Please <button onClick={() => navigate("/login")}>log in</button> to book tickets.
          </div>
        )}

        {Object.entries(grouped).map(([date, dateShows]) => (
          <div className="show-day" key={date}>
            <h3>{new Date(date + "T00:00:00").toLocaleDateString(undefined, {
              weekday: "long", month: "short", day: "numeric"
            })}</h3>
            <div className="show-grid">
              {dateShows.map((show) => (
                <Link
                  className={`show-card ${!user ? "disabled" : ""}`}
                  to={user ? `/shows/${show._id}/seats` : "/login"}
                  key={show._id}
                >
                  <strong>{show.time}</strong>
                  <span>{show.theatre}</span>
                  <small>{show.city} · ₹{show.price}/seat</small>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
}
