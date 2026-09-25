import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { apiError } from "../api";
import AuthLayout, { PasswordField } from "../components/AuthLayout";
import { useToast } from "../components/toast-context";

const TEST_ACCOUNT = { email: "admin@gmail.com", password: "admin" };

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    API.get("/health").catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("authChange"));
      toast.success("Signed in");
      navigate("/dashboard");
    } catch (err) {
      setError(apiError(err, "Could not sign in. Check your connection and try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout headline="Welcome back." subtext="Pick up your preparation where you left off.">
      <button
        type="button"
        onClick={() => {
          setForm(TEST_ACCOUNT);
          setError("");
        }}
        className="chip absolute top-6 right-6 cursor-pointer text-ink transition-colors hover:border-ink"
      >
        Use test account
      </button>

      <h2 className="text-3xl font-semibold">Sign in</h2>
      <p className="mt-2 text-graphite">Use the email you registered with.</p>

      <form onSubmit={handleLogin} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="email" className="label">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={handleChange}
            required
            className="field"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="label">Password</label>
          <PasswordField
            id="password"
            name="password"
            autoComplete="current-password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>

      <p className="mt-8 text-sm text-graphite">
        New to PrepMate?{" "}
        <Link to="/register" className="font-semibold text-ink underline-offset-4 hover:underline">
          Create account
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
