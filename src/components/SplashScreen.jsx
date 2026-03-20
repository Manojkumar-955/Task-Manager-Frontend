import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 4000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-700 via-purple-700 to-pink-600 overflow-hidden">
      {/* Background motion */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 animate-shimmerText" />

      <div className="relative text-center px-6">
        {/* Logo */}
        <img
          src="/checklist.png"
          alt="Task Manager"
          className="w-28 h-28 mx-auto mb-6
                     animate-zoomSlow animate-floatSlow"
        />

        {/* App Name */}
        <h1
          className="text-5xl font-extrabold text-white tracking-wide
                     opacity-0 animate-slideUp"
          style={{ animationDelay: "0.4s" }}
        >
          Task Manager
        </h1>

        {/* Tagline */}
        <p
          className="text-white/90 mt-3 text-lg
                     opacity-0 animate-slideUp"
          style={{ animationDelay: "0.7s" }}
        >
          Organize • Focus • Deliver
        </p>

        {/* Loading dots */}
        <div className="mt-8 flex justify-center gap-2">
          <span className="w-3 h-3 bg-white rounded-full animate-dot" />
          <span className="w-3 h-3 bg-white rounded-full animate-dot [animation-delay:0.2s]" />
          <span className="w-3 h-3 bg-white rounded-full animate-dot [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
