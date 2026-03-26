import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { base_api_url } from "../api";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Email validation regex
  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // ✅ Auto-clear alerts after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(`${base_api_url}/auth/forgot-password`, {
        email,
      });

      setSuccess(res.data.message || "Reset link sent to your email");
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to send reset link. Try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 to-purple-600 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-xl"
      >
        <h2 className="text-2xl font-bold text-center mb-2">
          Forgot Password 🔐
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your registered email to receive a password reset link
        </p>

        {/* Email Input */}
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border rounded-xl mb-3 focus:ring-2 focus:ring-indigo-500 outline-none"
        />

        {/* Error Alert */}
        {error && (
          <div className="bg-red-100 text-red-700 text-sm px-4 py-2 rounded-lg mb-3">
            {error}
          </div>
        )}

        {/* Success Alert */}
        {success && (
          <div className="bg-green-100 text-green-700 text-sm px-4 py-2 rounded-lg mb-3">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-2 py-3 rounded-xl font-semibold text-white transition
            ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>

        {/* Back to Login */}
        <div className="text-center mt-5">
          <Link
            to="/login"
            className="text-indigo-600 hover:underline text-sm font-medium"
          >
            ← Back to Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ForgotPassword;
