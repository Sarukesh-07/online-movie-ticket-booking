import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api";
import Loader from "../components/Loader";

export default function SeatSelection({ user }) {
  const { showId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [message, setMessage] = useState("");
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    api.get(`/shows/${showId}/seats`)
      .then((res) => setData(res.data))
      .catch((err) => setMessage(err.response?.data?.message || "Unable to load seats"));
  }, [showId, user, navigate]);

  const total = useMemo(
    () => (data ? selected.length * data.show.price : 0),
    [selected, data]
  );

  const toggle = (seat) => {
    setSelected((current) =>
      current.includes(seat)
        ? current.filter((item) => item !== seat)
        : [...current, seat]
    );
  };

  const book = async () => {
    if (!selected.length) return;
    setBooking(true);
    setMessage("");

    try {
      const res = await api.post("/bookings", { showId, seats: selected });
      navigate("/bookings", { state: { success: `Booking confirmed: ${res.data.bookingCode}` } });
    } catch (err) {
      setMessage(err.response?.data?.message || "Booking failed. Please try again.");
      const refreshed = await api.get(`/shows/${showId}/seats`);
      setData(refreshed.data);
      setSelected([]);
    } finally {
      setBooking(false);
    }
  };

  if (!data) return <Loader />;

  const rows = ["A", "B", "C", "D", "E", "F"];

  return (
    <section className="section seat-page">
      <div className="seat-header">
        <div>
          <span className="eyebrow">SELECT YOUR SEATS</span>
          <h1>{data.show.movie.title}</h1>
          <p>{data.show.theatre} · {data.show.date} · {data.show.time}</p>
        </div>
        <button className="secondary-btn" onClick={() => navigate(-1)}>← Change show</button>
      </div>

      {message && <div className="error">{message}</div>}

      <div className="seat-layout">
        <div className="screen">SCREEN</div>
        <div className="seat-map">
          {rows.map((row) => (
            <div className="seat-row" key={row}>
              <span className="row-label">{row}</span>
              {data.seats.filter((seat) => seat.id.startsWith(row)).map((seat) => (
                <button
                  key={seat.id}
                  className={`seat ${seat.booked ? "booked" : ""} ${selected.includes(seat.id) ? "selected" : ""}`}
                  disabled={seat.booked}
                  onClick={() => toggle(seat.id)}
                  title={seat.booked ? "Already booked" : seat.id}
                >
                  {seat.id.slice(1)}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="legend">
          <span><i className="legend-seat" /> Available</span>
          <span><i className="legend-seat selected" /> Selected</span>
          <span><i className="legend-seat booked" /> Booked</span>
        </div>
      </div>

      <div className="booking-bar">
        <div>
          <span>{selected.length} seat{selected.length !== 1 ? "s" : ""}</span>
          <strong>₹{total}</strong>
        </div>
        <button className="primary-btn" disabled={!selected.length || booking} onClick={book}>
          {booking ? "Booking..." : "Confirm booking"}
        </button>
      </div>
    </section>
  );
}
