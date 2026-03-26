import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { base_api_url } from "../api";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Auto-clear alerts
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

    if (!password || !confirmPassword) {
      return setError("All fields are required");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${base_api_url}/auth/reset-password/${token}`,
        { password },
      );

      setSuccess(res.data.message || "Password reset successful");

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired reset link");
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
          Reset Password 🔒
        </h2>

        <p className="text-gray-600 text-sm text-center mb-6">
          Enter your new password below
        </p>

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

        {/* New Password */}
        <div className="mb-4 relative">
          <label className="block text-sm font-medium mb-1">New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter new password"
          />
          <span
            className="absolute right-4 top-10 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/* Confirm Password */}
        <div className="mb-6 relative">
          <label className="block text-sm font-medium mb-1">
            Confirm Password
          </label>
          <input
            type={showConfirm ? "text" : "password"}
            className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm password"
          />
          <span
            className="absolute right-4 top-10 cursor-pointer text-gray-500"
            onClick={() => setShowConfirm(!showConfirm)}
          >
            {showConfirm ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition
            ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }
          `}
        >
          {loading ? "Resetting..." : "Reset Password"}
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

export default ResetPassword;
