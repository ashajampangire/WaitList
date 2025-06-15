import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useWaitlist } from "@/hooks/useWaitlist";
import { useToast } from "@/hooks/use-toast";

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (email: string, entry: any) => void;
  referralCode?: string;
}

const EmailModal = ({ isOpen, onClose, onSuccess, referralCode }: EmailModalProps) => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const { joinWaitlist, loading } = useWaitlist();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);
    
    // Basic validation
    if (!email.trim()) {
      setValidationError("Please enter your email address");
      return;
    }
    
    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setValidationError("Please enter a valid email address");
      return;
    }

    try {
      // Add timestamp to track when users joined
      const currentTime = new Date().toISOString();
      const entry = await joinWaitlist(
        email.trim(), 
        name.trim() || undefined, 
        referralCode
      );
      
      if (entry) {
        // Add created_at timestamp to the entry data for display in dashboard
        const entryWithTimestamp = {
          ...entry,
          created_at: currentTime
        };
        
        onSuccess(email.trim(), entryWithTimestamp);
        toast({
          title: "Welcome to NEFTIT!",
          description: "You've successfully joined our waitlist.",
        });
        onClose();
        setEmail("");
        setName("");
      }
    } catch (error) {
      console.error("Error during waitlist signup:", error);
      setValidationError("Something went wrong. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#080420] border border-[#3B5EFB]/70 shadow-[0_0_20px_rgba(59,94,251,0.3)] p-6 rounded-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 94, 251, 0.3))' }}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white uppercase mb-6">JOIN THE NEFTIT WAITLIST</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-white font-medium mb-1 block">
              Email Address
            </Label>
            <Input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-[#233876] w-full p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
              required
            />
            {validationError && (
              <p className="text-red-400 text-sm mt-1">{validationError}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              id="name"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-[#233876] w-full p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
            />
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-white text-[#233876] rounded-xl py-3 px-4 w-full uppercase font-bold transition-all duration-300 hover:bg-gray-100 tracking-wide"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="bg-[#233876] hover:bg-blue-700 text-white rounded-xl py-3 px-4 w-full uppercase font-bold transition-all duration-300 tracking-wide"
            >
              {loading ? "Joining..." : "Join Waitlist"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
