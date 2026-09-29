import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../api";

export default function Login({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("movie_token", res.data.token);
      localStorage.setItem("movie_user", JSON.stringify(res.data.user));
      onLogin(res.data.user);
      navigate(location.state?.from || "/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard title="Welcome back" subtitle="Log in to book your movie seats.">
      <form onSubmit={submit} className="auth-form">
        {error && <div className="error">{error}</div>}
        <label>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        <label>Password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></label>
        <button className="primary-btn full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        <p className="auth-switch">New here? <Link to="/register">Create an account</Link></p>
        <p className="demo-hint">Demo: demo@example.com / demo123</p>
      </form>
    </AuthCard>
  );
}

function AuthCard({ title, subtitle, children }) {
  return (
    <section className="auth-page">
      <div className="auth-card">
        <div className="brand auth-brand"><span className="brand-mark">▶</span> CineBook</div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
        {children}
      </div>
    </section>
  );
}
