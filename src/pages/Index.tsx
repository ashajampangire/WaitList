
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white flex items-center justify-center p-4">
      <div className="text-center space-y-8 max-w-md p-8 bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-xl shadow-xl">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-indigo-400 mb-4 tracking-wider">NEFTIT</h1>
          <p className="text-blue-300 text-lg">The Future of Web3 Experience</p>
        </div>
        
        <div className="space-y-4">
          <Link to="/waitlist">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105">
              Join Waitlist
            </Button>
          </Link>
          
          <Link to="/dashboard">
            <Button variant="outline" className="w-full border-blue-500/30 text-white hover:text-white hover:bg-blue-800/20 font-semibold py-3 px-8 rounded-xl transition-all duration-300">
              View Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
