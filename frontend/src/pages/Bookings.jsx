import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

export default function Bookings({ user }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(location.state?.success || "");

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.get("/bookings/my")
      .then((res) => setBookings(res.data))
      .catch(() => setMessage("Unable to load bookings"))
      .finally(() => setLoading(false));
  }, [user, navigate]);

  const cancel = async (id) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.patch(`/bookings/${id}/cancel`);
      setBookings((items) =>
        items.map((item) => item._id === id ? { ...item, status: "CANCELLED" } : item)
      );
      setMessage("Booking cancelled successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Cancellation failed");
    }
  };

  if (loading) return <Loader />;

  return (
    <section className="section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">YOUR ACCOUNT</span>
          <h1>Booking history</h1>
        </div>
      </div>

      {message && <div className="success">{message}</div>}

      {!bookings.length ? (
        <div className="empty">
          <h3>No bookings yet</h3>
          <p>Pick a movie and reserve your first cinema seat.</p>
          <button className="primary-btn" onClick={() => navigate("/")}>Browse movies</button>
        </div>
      ) : (
        <div className="booking-list">
          {bookings.map((booking) => (
            <article className="booking-card" key={booking._id}>
              <img src={booking.movie.poster} alt={booking.movie.title} />
              <div className="booking-main">
                <div className="booking-title-row">
                  <div>
                    <span className="eyebrow">{booking.bookingCode}</span>
                    <h3>{booking.movie.title}</h3>
                  </div>
                  <span className={`status ${booking.status.toLowerCase()}`}>{booking.status}</span>
                </div>
                <p>{booking.show.theatre} · {booking.show.city}</p>
                <p>{booking.show.date} · {booking.show.time}</p>
                <div className="booking-bottom">
                  <span>Seats: <strong>{booking.seats.join(", ")}</strong></span>
                  <strong>₹{booking.amount}</strong>
                </div>
                {booking.status === "CONFIRMED" && (
                  <button className="cancel-btn" onClick={() => cancel(booking._id)}>Cancel booking</button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
