import { Link } from "react-router-dom";

export default function MovieCard({ movie }) {
  return (
    <Link className="movie-card" to={`/movies/${movie._id}`}>
      <div className="poster-wrap">
        <img src={movie.poster} alt={movie.title} />
        <span className="rating">★ {movie.rating}</span>
      </div>
      <div className="movie-card-body">
        <h3>{movie.title}</h3>
        <p>{movie.genre?.slice(0, 2).join(" · ")} · {movie.language}</p>
        <span className="details-link">View details →</span>
      </div>
    </Link>
  );
}
