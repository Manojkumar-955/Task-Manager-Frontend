import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { base_api_url } from "../api";

const Login = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  /* =====================
     VALIDATION
  ===================== */
  const validateField = (name, value) => {
    if (!value.trim()) return "This field is required";

    if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
      return "Enter a valid email address";
    }

    if (name === "password" && value.length < 6) {
      return "Password must be at least 6 characters";
    }

    return "";
  };

  /* =====================
     HANDLE CHANGE
  ===================== */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, value),
    }));
  };

  /* =====================
     HANDLE SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      email: validateField("email", values.email),
      password: validateField("password", values.password),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

    try {
      const res = await axios.post(`${base_api_url}/auth/login`, values);

      if (res.status === 200 && res.data.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_id", res.data.user_id);
        localStorage.setItem("user_name", res.data.user_name);

        alert(`${res.data.message} 🎉`);
        navigate("/dashboard");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  /* =====================
     UI HELPERS
  ===================== */
  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
    }`;

  const labelClass = (field) =>
    `text-sm font-medium mb-1 self-start flex ${
      errors[field] ? "text-red-600" : "text-gray-700"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome Back 👋</h2>

        {/* EMAIL */}
        <div className="mb-5">
          <label className={labelClass("email")}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            className={inputClass("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1 flex self-start">
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-2">
          <label className={labelClass("password")}>
            Password <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              className={`${inputClass("password")} pr-12`}
            />

            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {errors.password && (
            <p className="text-sm text-red-600 mt-1 flex self-start">
              {errors.password}
            </p>
          )}
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right mb-5">
          <Link
            to="/forgot-password"
            className="text-sm text-indigo-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition"
        >
          Login
        </button>

        {/* SIGNUP */}
        <p className="text-center mt-4 text-sm">
          New here?
          <Link
            to="/signup"
            className="text-indigo-600 ml-1 font-semibold hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
