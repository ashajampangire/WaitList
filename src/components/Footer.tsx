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
  <div className="max-w-8xl mx-auto px-4 md:px-8 py-10">
    <div className="flex flex-col gap-y-8 md:grid md:grid-cols-3 md:gap-12">
      {/* NEFTIT Section */}
      <div className="space-y-4 md:pl-10">
        <h3 className="text-white text-3xl font-bold mb-8">NEFTIT</h3>
        <p className="text-gray-400 text-base leading-relaxed max-w-md">
          NEFTIT is a Web3 engagement platform designed to empower NFT projects and communities through gamified interactions.
        </p>
      </div>

      {/* Newsletter Section */}
      <div className="space-y-4 w-full max-w-2xl mx-auto md:ml-auto">
        <h3 className="text-white text-2xl font-bold mb-8 text-left md:text-center">GET NEFTIT UPDTAES IN YOUR INBOX</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row">
          <Input
            type="email"
            placeholder="Your email..."
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700/30 border-gray-600/50 text-white placeholder:text-gray-400 h-12 rounded-lg flex-1 min-w-[180px] text-base"
          />
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white h-12 px-8 rounded-lg font-semibold text-base transition-all duration-200 w-full sm:w-auto"
          >
            SUBMIT
          </Button>
        </form>
      </div>

      {/* Social Section */}
      <div className="space-y-4 w-full max-w-xl mx-auto md:pl-20 md:pr-40 md:ml-auto">
        <h3 className="text-white text-2xl font-bold mb-8 text-left md:text-center">SOCIAL</h3>
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
    <div className="border-t border-gray-700/30 mt-12 pt-4 flex flex-col md:flex-row justify-between items-center gap-6">
      <p className="text-gray-500 text-base pl-0 md:pl-8">© 2025 NEFTIT</p>
      <div className="flex flex-col gap-4 md:flex-row md:gap-8 text-base pr-0 md:pr-20 items-center">
        <a href="#" className="text-gray-500 hover:text-white transition-colors">
          Docs
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