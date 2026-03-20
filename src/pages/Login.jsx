import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base_api_url } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
const Login = () => {
  const navigate = useNavigate(); // correct navigation hook

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
     FIELD VALIDATION
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
      email: validateField("email", values.email),
      password: validateField("password", values.password),
    };

    setErrors(newErrors);

    // STOP IF ANY ERROR EXISTS
    if (Object.values(newErrors).some((err) => err)) return;
    try {
      const response = await axios.post(`${base_api_url}/auth/login`, values);
      if (response.status === 200 && response.data.token) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user_id", response.data.user_id);
        localStorage.setItem("user_name",response.data.user_name);
        // SUCCESS → NAVIGATE
        alert(`${response.data.message}🎉`);
        navigate("/dashboard"); // correct navigation
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
    `w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 
    ${
      errors[field]
        ? "border-red-500 focus:ring-red-500"
        : "border-gray-300 focus:ring-indigo-500"
    }`;

  const labelClass = (field) =>
    `text-sm font-medium mb-1 self-start ${
      errors[field] ? "text-red-600" : "text-gray-700"
    }`;

  return (
    <div
      className="min-h-screen flex items-center justify-center 
      bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 px-4"
    >
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-md p-8 rounded-2xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold text-center mb-6">Welcome 👋</h2>

        {/* EMAIL */}
        <div className="mb-5 flex flex-col items-start">
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
            <p className="text-sm text-red-600 mt-1 self-start">
              {errors.email}
            </p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-6 flex flex-col items-start">
          <label className={labelClass("password")}>
            Password <span className="text-red-500">*</span>
          </label>

          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={values.password}
              onChange={handleChange}
              className={`${inputClass("password")} pr-12`}
            />

            {/* Eye Icon */}
            <span
              className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500 hover:text-indigo-600"
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
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700"
        >
          Login
        </button>

        <p className="text-center mt-4 text-sm">
          New here?
          <Link to="/signup" className="text-indigo-600 ml-1 font-semibold">
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
