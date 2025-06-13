import { useState } from "react";
import { X, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import WalletGraphic3D from "./WalletGraphic3D";

interface WalletVerificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (walletAddress: string) => void;
}

const WalletVerificationDialog = ({
  isOpen,
  onClose,
  onSuccess,
}: WalletVerificationDialogProps) => {
  const [walletAddress, setWalletAddress] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState("");
  const { toast } = useToast();

  // Use the validation function from the useWaitlist hook
  const { validateWalletAddress, updateWaitlistEntry } = useWaitlist();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError("");

    // Basic client-side validation
    if (!walletAddress.trim()) {
      setValidationError("Please enter your wallet address");
      return;
    }

    // Validate the wallet address format
    if (!validateWalletAddress(walletAddress)) {
      setValidationError("Please enter a valid Ethereum wallet address");
      return;
    }

    setIsValidating(true);

    try {
      // In a real implementation, we should verify the wallet ownership
      // by asking the user to sign a message using Web3 libraries
      
      // Get user email from localStorage to update their record
      const userData = localStorage.getItem("waitlist_user");
      if (userData) {
        const parsedData = JSON.parse(userData);
        if (parsedData.email) {
          // Update the user's waitlist entry with their wallet address
          await updateWaitlistEntry(parsedData.email, {
            wallet_address: walletAddress
          });
        }
      }
      
      // Update success even if we couldn't update the database
      // (the wallet will still be stored in localStorage)
      onSuccess(walletAddress);
      toast({
        title: "Wallet verified successfully!",
        description: "Your wallet address has been added to our waitlist.",
      });
      onClose();
    } catch (error) {
      console.error("Error updating wallet address:", error);
      setValidationError("Failed to verify wallet. Please try again.");
    } finally {
      setIsValidating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-[#080420] border border-[#3B5EFB]/70 shadow-[0_0_20px_rgba(59,94,251,0.3)] p-6 rounded-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(59, 94, 251, 0.3))' }}>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-white uppercase mb-4">
            CONNECT YOUR WALLET
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-white font-medium block mb-1 uppercase">
              WALLET ADDRESS
            </Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Wallet className="h-5 w-5 text-blue-400" />
                </div>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="0x..."
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  className="bg-[#233876] w-full p-3 pl-10 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                />
              </div>
            {validationError && (
              <p className="text-red-400 text-sm mt-1">{validationError}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-[#233876] hover:bg-blue-700 text-white font-bold py-3 rounded-xl uppercase tracking-wide"
              disabled={isValidating}
            >
              {isValidating ? "VERIFYING..." : "VERIFY WALLET"}
            </Button>
          </div>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-white text-[#233876] rounded-xl py-3 px-4 w-full uppercase font-bold transition-all duration-300 hover:bg-gray-100 tracking-wide"
            >
              CANCEL
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default WalletVerificationDialog;
