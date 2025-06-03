
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col neftit-gradient-bg text-white">
      <Header />
      <div className="flex-grow flex items-center justify-center pt-0 px-4 pb-4">
      <div className="text-center space-y-8 max-w-md p-8 bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-[#3B5EFB] mb-4 tracking-wider">NEFTIT</h1>
          <p className="text-white text-lg">THE FUTURE OF WEB3 EXPERIENCE</p>
        </div>
        
        <div className="space-y-4">
          <Link to="/waitlist">
            <Button className="w-full bg-[#3B5EFB] hover:bg-blue-600 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300">
              JOIN WAITLIST
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button variant="outline" className="w-full border-blue-500/30 text-white hover:text-white hover:bg-blue-800/20 font-semibold py-3 px-8 rounded-xl transition-all duration-300">
              VIEW DASHBOARD
            </Button>
          </Link>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
};

export default Index;
