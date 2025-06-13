import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/images/wait2.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header />
      <div className="flex-grow flex items-center justify-center pt-0 px-4 pb-4">
      <div className="text-center p-8 bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl">
        <h1 className="text-6xl font-bold mb-4 tracking-wider text-purple-300">404</h1>
        <p className="text-xl text-white mb-6">OOPS! PAGE NOT FOUND</p>
        <Link to="/" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-6 rounded-xl inline-block transition-all duration-300">
          RETURN TO HOME
        </Link>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
