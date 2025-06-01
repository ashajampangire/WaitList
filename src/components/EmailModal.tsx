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
      <DialogContent className="sm:max-w-md bg-purple-900 border-purple-500/20">
        <DialogHeader>
          <DialogTitle className="text-white text-xl font-bold text-center">
            Join the NEFTIT Waitlist
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-purple-200">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-black/20 border-purple-500/20 text-white placeholder-purple-300"
              required
            />
            {validationError && (
              <p className="text-red-400 text-sm mt-1">{validationError}</p>
            )}
          </div>
          <div>
            <Input
              type="text"
              placeholder="Your name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-black/20 border-purple-500/20 text-white placeholder-purple-300"
            />
          </div>
          <div className="flex space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-800/20"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
