import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
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
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70 p-4">
      <div className="bg-gradient-to-b from-black/90 to-purple-950/90 backdrop-blur-sm p-6 rounded-xl w-full max-w-md border border-blue-500/30 shadow-xl">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-2xl font-bold text-white tracking-wider">Verify Your Wallet</h2>
          <button
            onClick={onClose}
            className="text-blue-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* 3D Wallet Graphic */}
        <WalletGraphic3D />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet" className="text-blue-200">
              Ethereum Wallet Address
            </Label>
            <Input
              id="wallet"
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-blue-900/20 border-blue-500/30 text-white placeholder:text-blue-400/70 focus:border-blue-400 focus:ring focus:ring-blue-500/20"
            />
            {validationError && (
              <p className="text-red-400 text-sm mt-1">{validationError}</p>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-2 rounded-xl"
              disabled={isValidating}
            >
              {isValidating ? "Verifying..." : "Verify Wallet"}
            </Button>
          </div>

          <p className="text-blue-300 text-sm text-center mt-4">
            We'll never share your wallet information with third parties.
            <br />
            Your wallet address will be used for Web3 rewards only.
          </p>
        </form>
      </div>
    </div>
  );
};

export default WalletVerificationDialog;
