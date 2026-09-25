import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API, { apiError } from "../api";
import AuthLayout, { PasswordField } from "../components/AuthLayout";
import { useToast } from "../components/toast-context";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("/auth/register", form);
      localStorage.setItem("token", res.data.token);
      window.dispatchEvent(new Event("authChange"));
      toast.success("Account created");
      navigate("/dashboard");
    } catch (err) {
      setError(apiError(err, "Could not create the account. Check your connection and try again."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      headline="Your placement prep, in one place."
      subtext="Prep guides, job matches, mock interviews and an application tracker."
    >
      <h2 className="text-3xl font-semibold">Create account</h2>
      <p className="mt-2 text-graphite">It takes less than a minute.</p>

      <form onSubmit={handleRegister} className="mt-8 space-y-5">
        <div className="space-y-2">
          <label htmlFor="name" className="label">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={handleChange}
            required
            className="field"
          />
        </div>

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
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && <p role="alert" className="text-sm font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={loading} className="btn btn-primary btn-lg w-full">
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>

      <p className="mt-8 text-sm text-graphite">
        Already registered?{" "}
        <Link to="/login" className="font-semibold text-ink underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Register;
