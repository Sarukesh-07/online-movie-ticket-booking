import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Register({ onLogin }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      localStorage.setItem("movie_token", res.data.token);
      localStorage.setItem("movie_user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand"><span className="brand-mark">▶</span> CineBook</div>
        <h1>Create account</h1>
        <p>Join CineBook and start booking.</p>
        <form onSubmit={submit} className="auth-form">
          {error && <div className="error">{error}</div>}
          <label>Name<input name="name" value={form.name} onChange={change} required /></label>
          <label>Email<input type="email" name="email" value={form.email} onChange={change} required /></label>
          <label>Password<input type="password" name="password" value={form.password} onChange={change} minLength="6" required /></label>
          <button className="primary-btn full" disabled={loading}>{loading ? "Creating..." : "Create account"}</button>
          <p className="auth-switch">Already registered? <Link to="/login">Sign in</Link></p>
        </form>
      </div>
    </section>
  );
}
