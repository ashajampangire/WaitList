import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white flex items-center justify-center p-4">
      <div className="text-center p-8 bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl">
        <h1 className="text-6xl font-bold mb-4 tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">404</h1>
        <p className="text-xl text-blue-200 mb-6">Oops! Page not found</p>
        <a href="/" className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 px-6 rounded-xl inline-block transition-all duration-300">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
