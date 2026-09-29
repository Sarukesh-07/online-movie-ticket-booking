import { useEffect, useState } from "react";
import { Link, NavLink, Route, Routes, useNavigate } from "react-router-dom";
import api from "./api";
import Home from "./pages/Home";
import MovieDetails from "./pages/MovieDetails";
import SeatSelection from "./pages/SeatSelection";
import Bookings from "./pages/Bookings";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("movie_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  const logout = () => {
    localStorage.removeItem("movie_token");
    localStorage.removeItem("movie_user");
    setUser(null);
  };

  return (
    <div className="app-shell">
      <header className="navbar">
        <Link to="/" className="brand">
          <span className="brand-mark">▶</span> CineBook
        </Link>
        <nav>
          <NavLink to="/">Movies</NavLink>
          {user && <NavLink to="/bookings">My Bookings</NavLink>}
          {user ? (
            <button className="nav-user" onClick={logout}>
              {user.name} · Logout
            </button>
          ) : (
            <NavLink className="login-link" to="/login">Login</NavLink>
          )}
        </nav>
      </header>

      <main className="page">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies/:id" element={<MovieDetails user={user} />} />
          <Route path="/shows/:showId/seats" element={<SeatSelection user={user} />} />
          <Route path="/bookings" element={<Bookings user={user} />} />
          <Route path="/login" element={<Login onLogin={setUser} />} />
          <Route path="/register" element={<Register onLogin={setUser} />} />
        </Routes>
      </main>

      <footer className="footer">
        <div>
          <strong>CineBook</strong>
          <span>Online Movie Ticket Booking System</span>
        </div>
        <span>Built with React, Express & MongoDB</span>
      </footer>
    </div>
  );
}
