import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../services/api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in name, email, and password.");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Could not create account. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
    

      <div className="card">
        <h1>Create your account</h1>
        <div className="sub">Start tracking your expenses</div>

        <label>Name</label>
        <input
          type="text"
          placeholder="Jane Doe"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <label>Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        {error && <div className="error-box">{error}</div>}

        <button className="submit-btn" onClick={handleSignup} disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <div className="switch-line">
          Already have an account? <Link to="/">Sign in</Link>
        </div>
      </div>
    </div>
  );
}