import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address.",
        variant: "destructive"
      });
      return;
    }
    toast({
      title: "Subscribed!",
      description: "You've been added to our mailing list."
    });
    setEmail("");
  };

  return (
    <footer className="relative backdrop-blur-sm border-t border-gray-700/30 bg-gray-900/60">
      <div className="max-w-7xl mx-auto px-0 py-10">
        <div className="grid md:grid-cols-3 gap-20">
          {/* NEFTIT Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-6">NEFTIT</h3>
            <p className="text-gray-400 text-base leading-relaxed max-w-md">
              NEFTIT is a Web3 engagement platform designed to empower NFT projects and communities through gamified interactions.
            </p>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">GET NEFTIT UPDATES IN YOUR INBOX</h3>
            <form onSubmit={handleSubmit} className="flex gap-3">
              <Input
                type="email"
                placeholder="Your email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-700/30 border-gray-600/50 text-white placeholder:text-gray-400 h-12 rounded-lg flex-1 text-base"
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-lg font-semibold text-base transition-all duration-200"
              >
                SUBMIT
              </Button>
            </form>
          </div>

          {/* Social Section */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold mb-6">SOCIAL</h3>
            <div className="space-y-4">
              <a href="https://twitter.com/neftitxyz" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-white transition-colors text-base font-medium">
                TWITTER →
              </a>
              <a href="https://discord.gg/GHc9samP" target="_blank" rel="noopener noreferrer" className="flex items-center text-gray-400 hover:text-white transition-colors text-base font-medium">
                DISCORD →
              </a>
              <a href="#" className="flex items-center text-gray-400 hover:text-white transition-colors text-base font-medium">
                TELEGRAM →
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700/30 mt-12 pt-2 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-500 text-base">© 2025 NEFTIT</p>
          <div className="flex gap-8 text-base">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Docs
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Media Kit
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;