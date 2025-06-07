import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Mail, X, Wallet, Twitter, ArrowLeft } from "lucide-react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import WaitlistCard from "@/components/WaitlistCard";
import EmailModal from "@/components/EmailModal";
import WalletVerificationDialog from "@/components/WalletVerificationDialog";
import TwitterVerificationDialog from "@/components/TwitterVerificationDialog";
import DiscordVerificationDialog from "@/components/DiscordVerificationDialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import { Footer } from "@/components/Footer";

const WaitlistSignup = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get("ref");

  const [completedActions, setCompletedActions] = useState<string[]>([]);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [showTwitterModal, setShowTwitterModal] = useState(false);
  const [showDiscordModal, setShowDiscordModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userWalletAddress, setUserWalletAddress] = useState<string | null>(null);
  const [userTwitterUsername, setUserTwitterUsername] = useState<string | null>(null);
  const [userDiscordUsername, setUserDiscordUsername] = useState<string | null>(null);
  const [waitlistCount, setWaitlistCount] = useState(1247);

  const { toast } = useToast();
  const { getTotalWaitlistCount } = useWaitlist();

  useEffect(() => {
    // Load waitlist count
    const loadWaitlistCount = async () => {
      const count = await getTotalWaitlistCount();
      setWaitlistCount(count);
    };
    loadWaitlistCount();
    
    // Check localStorage for completed actions
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      
      // Set email if available
      if (parsedData.email) {
        setUserEmail(parsedData.email);
        if (!completedActions.includes("email")) {
          setCompletedActions(prev => [...prev, "email"]);
        }
      }
      
      // Set wallet address if available
      if (parsedData.wallet_address) {
        setUserWalletAddress(parsedData.wallet_address);
        if (!completedActions.includes("address")) {
          setCompletedActions(prev => [...prev, "address"]);
        }
      }
      
      // Set Twitter info if available
      if (parsedData.twitter_username && parsedData.twitter_followed) {
        setUserTwitterUsername(parsedData.twitter_username);
        if (!completedActions.includes("twitter")) {
          setCompletedActions(prev => [...prev, "twitter"]);
        }
      }
      
      // Set Discord info if available
      if (parsedData.discord_username && parsedData.discord_joined) {
        setUserDiscordUsername(parsedData.discord_username);
        if (!completedActions.includes("discord")) {
          setCompletedActions(prev => [...prev, "discord"]);
        }
      }
    }
  }, [getTotalWaitlistCount]);

  const handleActionComplete = (actionId: string) => {
    if (actionId === "email") {
      setShowEmailModal(true);
      return;
    }

    if (actionId === "address") {
      setShowWalletModal(true);
      return;
    }

    if (actionId === "twitter") {
      setShowTwitterModal(true);
      return;
    }

    if (actionId === "discord") {
      setShowDiscordModal(true);
      return;
    }
  };

  const handleEmailSuccess = (email: string, entry: any) => {
    setUserEmail(email);
    setCompletedActions([...completedActions, "email"]);
    
    // Get existing user data if available
    const existingData = localStorage.getItem("waitlist_user");
    const parsedExisting = existingData ? JSON.parse(existingData) : {};
    
    // Store user data in localStorage for dashboard with timestamp information
    localStorage.setItem(
      "waitlist_user",
      JSON.stringify({
        ...parsedExisting,
        email,
        referral_code: entry.referral_code,
        name: entry.name,
        wallet_address: userWalletAddress || parsedExisting.wallet_address || null,
        twitter_username: userTwitterUsername || parsedExisting.twitter_username || null,
        twitter_followed: completedActions.includes("twitter") || parsedExisting.twitter_followed || false,
        discord_username: userDiscordUsername || parsedExisting.discord_username || null,
        discord_joined: completedActions.includes("discord") || parsedExisting.discord_joined || false,
        created_at: entry.created_at || parsedExisting.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
  };

  const handleWalletSuccess = (walletAddress: string) => {
    setUserWalletAddress(walletAddress);
    setCompletedActions([...completedActions, "address"]);
    
    // Update localStorage with wallet address
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      localStorage.setItem(
        "waitlist_user",
        JSON.stringify({
          ...parsedData,
          wallet_address: walletAddress,
          updated_at: new Date().toISOString(),
        })
      );
    }
  };
  
  const handleTwitterSuccess = (twitterUsername: string) => {
    setUserTwitterUsername(twitterUsername);
    setCompletedActions([...completedActions, "twitter"]);
    
    // Store twitter info in localStorage
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      localStorage.setItem(
        "waitlist_user",
        JSON.stringify({
          ...parsedData,
          twitter_username: twitterUsername,
          twitter_followed: true,
          updated_at: new Date().toISOString(),
        })
      );
    }
  };
  
  const handleDiscordSuccess = (discordUsername: string) => {
    setUserDiscordUsername(discordUsername);
    setCompletedActions([...completedActions, "discord"]);
    
    // Store discord info in localStorage
    const userData = localStorage.getItem("waitlist_user");
    if (userData) {
      const parsedData = JSON.parse(userData);
      localStorage.setItem(
        "waitlist_user",
        JSON.stringify({
          ...parsedData,
          discord_username: discordUsername,
          discord_joined: true,
          updated_at: new Date().toISOString(),
        })
      );
    }
  };

  // Check if all required actions are completed (email, wallet, twitter, discord)
  const requiredActions = ["email", "address", "twitter", "discord"];
  const allActionsCompleted = requiredActions.every(action => 
    completedActions.includes(action)
  );

  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/images/wait3.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header />
      <div className="flex-grow pt-0 px-4 pb-4">
        <div className="max-w-md mx-auto space-y-6 py-10">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-[#5D43EF] text-5xl font-bold uppercase  mb-4" style={{ textShadow: '10 10px 20px rgba(59, 94, 251, 0.7)' }}>
              JOIN THE WAITLIST
            </h2>
            <p className="text-[#5D43EF EDEAFF]  text-xl uppercase">
              FOR THE NEFTIT WEB3 EXPERIENCE
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-7 px-1 text-[#5D43EF EDEAFF]">
            <WaitlistCard
              icon={<Mail className="h-6 w-6  decoration-[#5D43EF ]" style={{ textShadow: '10 10px 20px rgba(59, 94, 251, 0.7)'}} />}
              title="Enter Email"
              subtitle="To Receive Latest Updates First"
              completed={completedActions.includes("email")}
              onClick={() => handleActionComplete("email")}
            />
            <WaitlistCard
              icon={<Wallet className="h-6 w-6 decoration-[#5D43EF] style={{ textShadow: '10 10px 20px rgba(59, 94, 251, 0.7)" />}
              title="Enter your Wallet Address"
              subtitle="To Receive Web3 Rewards"
              completed={completedActions.includes("address")}
              onClick={() => handleActionComplete("address")}
            />
            <WaitlistCard
              icon={<X className="h-6 w-6 decoration-[#5D43EF] style={{ Shadow: '10 10px 20px rgba(59, 94, 251, 0.7)" />}
              title="Follow Us On X"
              subtitle="To Stay Updated On Latest News"
              completed={completedActions.includes("twitter")}
              onClick={() => handleActionComplete("twitter")}
            />
            <WaitlistCard
              icon={
                <svg className="w-6 h-6 decoration-[#5D43EF] style={{ textShadow: '10 10px 20px rgba(59, 94, 251, 0.7)" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
              }
              title="Join Our Discord"
              subtitle="Join & Become A Part Of our community"
              completed={completedActions.includes("discord")}
              onClick={() => handleActionComplete("discord")}
            />
          </div>

          {/* Enter Button */}
          <div className="mt-8">
            <Button
              className={`w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wide transition-all duration-300 ${
                allActionsCompleted
                  ? "bg-[#5D43EF]  text-white shadow-[0_0_20px_rgba(59,94,251,0.5)]"
                  : "bg-gray-800/70 text-blue-200 cursor-not-allowed"
              }`}
              style={allActionsCompleted ? { filter: 'drop-shadow(0 0 8px rgba(59, 94, 251, 0.5))' } : {}}
              disabled={!allActionsCompleted}
              onClick={() => {
                if (allActionsCompleted) {
                  navigate('/dashboard');
                }
              }}
            >
              <span className="flex items-center justify-center">
                ENTER NEFTIT
                <svg className="ml-2 w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
            </Button>
          </div>


          {/* Email Modal */}
          <EmailModal
            isOpen={showEmailModal}
            onClose={() => setShowEmailModal(false)}
            onSuccess={handleEmailSuccess}
            referralCode={referralCode || undefined}
          />
          
          {/* Wallet Verification Modal */}
          <WalletVerificationDialog
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            onSuccess={handleWalletSuccess}
          />
          
          {/* Twitter Verification Modal */}
          <TwitterVerificationDialog
            isOpen={showTwitterModal}
            onClose={() => setShowTwitterModal(false)}
            onSuccess={handleTwitterSuccess}
          />
          
          {/* Discord Verification Modal */}
          <DiscordVerificationDialog
            isOpen={showDiscordModal}
            onClose={() => setShowDiscordModal(false)}
            onSuccess={handleDiscordSuccess}
          />
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WaitlistSignup;
