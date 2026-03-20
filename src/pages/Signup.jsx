import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base_api_url } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
const Signup = () => {
  const navigate = useNavigate();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  /* =====================
     VALIDATION LOGIC
  ===================== */
  const validateField = (name, value) => {
    let error = "";

    if (!value.trim()) {
      error = "This field is required";
    } else {
      if (name === "email" && !/\S+@\S+\.\S+/.test(value)) {
        error = "Enter a valid email address";
      }
      if (name === "password" && value.length < 6) {
        error = "Password must be at least 6 characters";
      }
    }

    return error;
  };

  /* =====================
     ON CHANGE
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
     ON SUBMIT
  ===================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      name: validateField("name", values.name),
      email: validateField("email", values.email),
      password: validateField("password", values.password),
    };

    setErrors(newErrors);

    // Stop if any error exists
    if (Object.values(newErrors).some((err) => err)) return;
    try {
      console.log("called");
      console.log("values:", values);
      const response = await axios.post(`${base_api_url}/auth/signup`, values);
      if (response.status === 201) {
        //SUCCESS → NAVIGATE
        alert(`${response.data.message}🎉`);
        navigate("/login"); // correct navigation
      }
    } catch (error) {
      // API error handling
      if (error.response) {
        alert(error.response.data.message || "Login failed");
      } else {
        alert("Server not responding");
      }
    }
  };

  /* =====================
     UI HELPERS
  ===================== */
  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 transition
    ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-purple-500"
    }`;

  const labelClass = (field) =>
    `text-sm font-medium mb-1 self-start ${
      errors[field] ? "text-red-600" : "text-gray-600"
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-8 animate-fadeIn"
      >
        {/* Heading */}
        <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-2">
          Create Account ✨
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Join us and get started
        </p>

        {/* Full Name */}
        <div className="mb-4 flex flex-col items-start">
          <label className={labelClass("name")}>
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={values.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className={inputClass("name")}
          />
          {errors.name && (
            <p className="text-sm text-red-600 mt-1 self-start">
              {errors.name}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="mb-4 flex flex-col items-start">
          <label className={labelClass("email")}>
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="email"
            value={values.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className={inputClass("email")}
          />
          {errors.email && (
            <p className="text-sm text-red-600 mt-1 self-start">
              {errors.email}
            </p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6 flex flex-col items-start w-full">
          <label className={labelClass("password")}>
            Password <span className="text-red-500">*</span>
          </label>

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              placeholder="Create a password"
              className={`${inputClass("password")} pr-12`}
            />

            {/* Eye Icon */}
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-purple-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
            </span>
          </div>

          {errors.password && (
            <p className="text-sm text-red-600 mt-1 self-start">
              {errors.password}
            </p>
          )}
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold hover:bg-purple-700 active:scale-95 transition duration-300 shadow-lg"
        >
          Sign Up
        </button>

        {/* Footer */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?
          <Link
            to="/login"
            className="text-purple-600 font-semibold ml-1 hover:underline"
          >
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
