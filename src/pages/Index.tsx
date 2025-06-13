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
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import { Footer } from "@/components/Footer";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get("ref");
  
  const { toast } = useToast();
  const { getTotalWaitlistCount, joinWaitlist, validateWalletAddress, updateWaitlistEntry, verifyTwitterFollow, verifyDiscordJoin } = useWaitlist();

  // Handle the referral code from URL
  useEffect(() => {
    if (referralCode) {
      console.log('Referral code from URL:', referralCode);
      // Store the referral code in localStorage to use it when the user signs up
      localStorage.setItem('pending_referral_code', referralCode);
      
      // Show a toast notification about the referral
      toast({
        title: "Referral Detected",
        description: `You've been referred by a friend!`,
      });
    }
  }, [referralCode, toast]);

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

  // New state management as requested
  const [completedTasks, setCompletedTasks] = useState({ 
    email: false, 
    wallet: false, 
    twitter: false, 
    discord: false 
  }); 
  const [showLeaderboard, setShowLeaderboard] = useState(false); 
  const [email, setEmail] = useState(""); 
  const [walletAddress, setWalletAddress] = useState(""); 
  const [twitterUsername, setTwitterUsername] = useState(""); 
  const [discordUsername, setDiscordUsername] = useState(""); 
  const [userName, setUserName] = useState(""); 
  const [userRank, setUserRank] = useState(1); 
  const [referralCount, setReferralCount] = useState(12); 

  // States to show input fields 
  const [showEmailInput, setShowEmailInput] = useState(false); 
  const [showWalletInput, setShowWalletInput] = useState(false); 
  const [showTwitterInput, setShowTwitterInput] = useState(false); 
  const [showDiscordInput, setShowDiscordInput] = useState(false); 

  
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
        setEmail(parsedData.email);
        if (!completedActions.includes("email")) {
          setCompletedActions(prev => [...prev, "email"]);
          setCompletedTasks(prev => ({ ...prev, email: true }));
        }
      }
      
      // Set wallet address if available
      if (parsedData.wallet_address) {
        setUserWalletAddress(parsedData.wallet_address);
        setWalletAddress(parsedData.wallet_address);
        if (!completedActions.includes("address")) {
          setCompletedActions(prev => [...prev, "address"]);
          setCompletedTasks(prev => ({ ...prev, wallet: true }));
        }
      }
      
      // Set Twitter info if available
      if (parsedData.twitter_username && parsedData.twitter_followed) {
        setUserTwitterUsername(parsedData.twitter_username);
        setTwitterUsername(parsedData.twitter_username);
        if (!completedActions.includes("twitter")) {
          setCompletedActions(prev => [...prev, "twitter"]);
          setCompletedTasks(prev => ({ ...prev, twitter: true }));
        }
      }
      
      // Set Discord info if available
      if (parsedData.discord_username && parsedData.discord_joined) {
        setUserDiscordUsername(parsedData.discord_username);
        setDiscordUsername(parsedData.discord_username);
        if (!completedActions.includes("discord")) {
          setCompletedActions(prev => [...prev, "discord"]);
          setCompletedTasks(prev => ({ ...prev, discord: true }));
        }
      }

      // Set user name if available
      if (parsedData.name) {
        setUserName(parsedData.name);
      }
    }
  }, [getTotalWaitlistCount]);

  const handleActionComplete = (actionId: string) => {
    if (actionId === "email") {
      // Use new inline input approach instead of modal
      setShowEmailInput(prev => !prev);
      return;
    }

    if (actionId === "wallet" || actionId === "address") {
      // Use new inline input approach instead of modal
      setShowWalletInput(prev => !prev);
      return;
    }

    if (actionId === "twitter") {
      // Redirect to Twitter follow link and show input
      window.open("https://twitter.com/intent/follow?screen_name=neftitxyz", "_blank");
      setShowTwitterInput(true);
      return;
    }

    if (actionId === "discord") {
      // Redirect to Discord join link and show input
      window.open("https://discord.gg/GHc9samP", "_blank");
      setShowDiscordInput(true);
      return;
    }
  };

  // New handlers for inline inputs
  const handleEmailSubmit = async () => { 
    if (!email) { 
      toast({ 
        title: "Email Required", 
        description: "Please enter your email address.", 
        variant: "destructive" 
      }); 
      return; 
    } 

    // Email format validation using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      toast({ 
        title: "Invalid Email", 
        description: "Please enter a valid email address.", 
        variant: "destructive" 
      }); 
      return;
    }

    try {
      // Add timestamp to track when users joined
      const currentTime = new Date().toISOString();
      const entry = await joinWaitlist(
        email.trim(), 
        userName.trim() || undefined, 
        referralCode
      );
      
      if (entry) {
        // Add created_at timestamp to the entry data for display in dashboard
        const entryWithTimestamp = {
          ...entry,
          created_at: currentTime
        };
        
        // Update state
        setUserEmail(email.trim());
        setCompletedTasks(prev => ({ 
          ...prev, 
          email: true 
        })); 
        setCompletedActions([...completedActions, "email"]);
        setShowEmailInput(false); 

        // Store in localStorage
        const existingData = localStorage.getItem("waitlist_user");
        const parsedExisting = existingData ? JSON.parse(existingData) : {};
        localStorage.setItem(
          "waitlist_user",
          JSON.stringify({
            ...parsedExisting,
            email: email.trim(),
            referral_code: entry.referral_code,
            name: userName || parsedExisting.name || null,
            wallet_address: userWalletAddress || parsedExisting.wallet_address || null,
            twitter_username: userTwitterUsername || parsedExisting.twitter_username || null,
            twitter_followed: completedActions.includes("twitter") || parsedExisting.twitter_followed || false,
            discord_username: userDiscordUsername || parsedExisting.discord_username || null,
            discord_joined: completedActions.includes("discord") || parsedExisting.discord_joined || false,
            created_at: entry.created_at || parsedExisting.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
        );

        toast({ 
          title: "Email Submitted!", 
          description: "Email task completed successfully." 
        }); 
      }
    } catch (error) {
      console.error("Error during waitlist signup:", error);
      toast({ 
        title: "Error", 
        description: "Something went wrong. Please try again.", 
        variant: "destructive" 
      }); 
    }
  }; 

  const handleTwitterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Twitter username is provided
    if (!twitterUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Twitter username",
        variant: "destructive",
      });
      return;
    }

    // Format the username (remove @ if present)
    const formattedUsername = twitterUsername.startsWith('@') 
      ? twitterUsername.substring(1) 
      : twitterUsername;

    // Validate the Twitter username format
    const twitterUsernameRegex = /^[a-zA-Z0-9_]{1,15}$/;
    if (!twitterUsernameRegex.test(formattedUsername)) {
      toast({ 
        title: "Invalid Username", 
        description: "Please enter a valid Twitter username (1-15 characters, alphanumeric and underscores).", 
        variant: "destructive" 
      }); 
      return;
    }

    try {
      const userData = localStorage.getItem("waitlist_user");
      if (!userData) {
        toast({
          title: "Email Required",
          description: "Please complete email signup first before verifying Twitter follow.",
          variant: "destructive",
        });
        setShowEmailInput(true);
        return;
      }

      const parsedData = JSON.parse(userData);
      if (!parsedData.email) {
        toast({
          title: "Email Required",
          description: "Please complete email signup first before verifying Twitter follow.",
          variant: "destructive",
        });
        setShowEmailInput(true);
        return;
      }

      // Check if email signup is completed
      if (!completedTasks.email) {
        toast({
          title: "Email Required",
          description: "Please complete email signup first before verifying Twitter follow.",
          variant: "destructive",
        });
        setShowEmailInput(true);
        return;
      }

      const isFollowing = await verifyTwitterFollow(parsedData.email, formattedUsername);
      if (isFollowing) {
        setUserTwitterUsername(formattedUsername);
        setCompletedTasks(prev => ({ 
          ...prev, 
          twitter: true 
        })); 
        setCompletedActions(prev => [...prev, "twitter"]);
        setShowTwitterInput(false);

        // Store twitter info in localStorage
        localStorage.setItem(
          "waitlist_user",
          JSON.stringify({
            ...parsedData,
            twitter_username: formattedUsername,
            twitter_followed: true,
            updated_at: new Date().toISOString(),
          })
        );

        toast({ 
          title: "Twitter Follow Verified!", 
          description: "Twitter task completed successfully." 
        });
      } else {
        toast({ 
          title: "Not Following", 
          description: "Please follow our Twitter account to complete this task.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error verifying Twitter follow:", error);
      if (error.message === "User not found") {
        toast({ 
          title: "Email Required", 
          description: "Please complete email signup first before verifying Twitter follow.", 
          variant: "destructive" 
        });
        setShowEmailInput(true);
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to verify Twitter follow. Please try again.", 
          variant: "destructive" 
        });
      }
    }
  };

  const handleDiscordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if Discord username is provided
    if (!discordUsername.trim()) {
      toast({
        title: "Error",
        description: "Please enter your Discord username",
        variant: "destructive",
      });
      return;
    }

    try {
      const userData = localStorage.getItem("waitlist_user");
      if (!userData) {
        toast({
          title: "Email Required",
          description: "Please complete email signup first before verifying Discord join.",
          variant: "destructive",
        });
        setShowEmailInput(true);
        return;
      }

      const parsedData = JSON.parse(userData);
      if (!parsedData.email) {
        toast({
          title: "Email Required",
          description: "Please complete email signup first before verifying Discord join.",
          variant: "destructive",
        });
        setShowEmailInput(true);
        return;
      }

      // Check if email signup is completed
      if (!completedTasks.email) {
        toast({
          title: "Email Required",
          description: "Please complete email signup first before verifying Discord join.",
          variant: "destructive",
        });
        setShowEmailInput(true);
        return;
      }

      const hasJoined = await verifyDiscordJoin(parsedData.email, discordUsername.trim());
      if (hasJoined) {
        setUserDiscordUsername(discordUsername);
        setCompletedTasks(prev => ({ 
          ...prev, 
          discord: true 
        })); 
        setCompletedActions(prev => [...prev, "discord"]);
        setShowDiscordInput(false);

        // Store discord info in localStorage
        localStorage.setItem(
          "waitlist_user",
          JSON.stringify({
            ...parsedData,
            discord_username: discordUsername.trim(),
            discord_joined: true,
            updated_at: new Date().toISOString(),
          })
        );

        toast({ 
          title: "Discord Join Verified!", 
          description: "Discord task completed successfully." 
        });
      } else {
        toast({ 
          title: "Not a Member", 
          description: "Please join our Discord server to complete this task.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error verifying Discord join:", error);
      if (error.message === "User not found") {
        toast({ 
          title: "Email Required", 
          description: "Please complete email signup first before verifying Discord join.", 
          variant: "destructive" 
        });
        setShowEmailInput(true);
      } else {
        toast({ 
          title: "Error", 
          description: "Failed to verify Discord join. Please try again.", 
          variant: "destructive" 
        });
      }
    }
  };

  const handleWalletSubmit = async () => { 
    if (!walletAddress) { 
      toast({ 
        title: "Wallet Address Required", 
        description: "Please enter your EVM wallet address.", 
        variant: "destructive" 
      }); 
      return; 
    } 

    // Validate the wallet address format
    if (!validateWalletAddress(walletAddress)) {
      toast({ 
        title: "Invalid Wallet Address", 
        description: "Please enter a valid Ethereum wallet address.", 
        variant: "destructive" 
      }); 
      return;
    }

    try {
      // Update the user's wallet address in the database
      if (userEmail) {
        await updateWaitlistEntry(userEmail, { wallet_address: walletAddress });
      }
      
      // Update local state
      setUserWalletAddress(walletAddress);
      setCompletedTasks(prev => ({ 
        ...prev, 
        wallet: true 
      }));
      setCompletedActions(prev => [...prev, "address"]);
      setShowWalletInput(false);

      // Update localStorage
      const storedUserData = localStorage.getItem("waitlist_user");
      if (storedUserData) {
        const parsedData = JSON.parse(storedUserData);
        localStorage.setItem(
          "waitlist_user",
          JSON.stringify({
            ...parsedData,
            wallet_address: walletAddress,
            updated_at: new Date().toISOString(),
          })
        );
      }

      toast({ 
        title: "Wallet Address Saved!", 
        description: "Your wallet address has been saved successfully." 
      });
    } catch (error) {
      console.error("Error saving wallet address:", error);
      toast({ 
        title: "Error", 
        description: "Failed to save wallet address. Please try again.", 
        variant: "destructive" 
      });
    }
  };

  const handleTwitterFollow = async () => {
    if (!twitterUsername) {
      toast({
        title: "Error",
        description: "Please enter your Twitter username",
        variant: "destructive",
      });
      return;
    }

    // Format the username (remove @ if present)
    const formattedUsername = twitterUsername.startsWith('@') 
      ? twitterUsername.substring(1) 
      : twitterUsername;

    // Validate the Twitter username format
    const twitterUsernameRegex = /^[a-zA-Z0-9_]{1,15}$/;
    if (!twitterUsernameRegex.test(formattedUsername)) {
      toast({ 
        title: "Invalid Username", 
        description: "Please enter a valid Twitter username (1-15 characters, alphanumeric and underscores).", 
        variant: "destructive" 
      }); 
      return;
    }

    try {
      const userData = localStorage.getItem("waitlist_user");
      if (!userData) {
        toast({
          title: "Error",
          description: "User data not found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const parsedData = JSON.parse(userData);
      if (!parsedData.email) {
        toast({
          title: "Error",
          description: "User email not found. Please try again.",
          variant: "destructive",
        });
        return;
      }

      const isFollowing = await verifyTwitterFollow(parsedData.email, formattedUsername);
      if (isFollowing) {
        setUserTwitterUsername(formattedUsername);
        setCompletedTasks(prev => ({ 
          ...prev, 
          twitter: true 
        })); 
        setCompletedActions(prev => [...prev, "twitter"]);
        setShowTwitterInput(false);

        // Store twitter info in localStorage
        localStorage.setItem(
          "waitlist_user",
          JSON.stringify({
            ...parsedData,
            twitter_username: formattedUsername,
            twitter_followed: true,
            updated_at: new Date().toISOString(),
          })
        );

        toast({ 
          title: "Twitter Follow Verified!", 
          description: "Twitter task completed successfully." 
        });
      } else {
        toast({ 
          title: "Not Following", 
          description: "Please follow our Twitter account to complete this task.", 
          variant: "destructive" 
        });
      }
    } catch (error) {
      console.error("Error verifying Twitter follow:", error);
      toast({ 
        title: "Error", 
        description: "Failed to verify Twitter follow. Please try again.", 
        variant: "destructive" 
      }); 
    }
  };

  // Add missing success handlers for modals
  const handleTaskComplete = (actionId: string) => {
    // This function is used for the new inline input approach
    handleActionComplete(actionId);
  };

  const handleEmailSuccess = (email: string, name?: string) => {
    setUserEmail(email);
    if (name) setUserName(name);
    setCompletedTasks(prev => ({ ...prev, email: true }));
    setCompletedActions(prev => [...prev, "email"]);
    toast({ 
      title: "Email Submitted!", 
      description: "Email task completed successfully." 
    });
  };

  const handleWalletSuccess = (address: string) => {
    setUserWalletAddress(address);
    setCompletedTasks(prev => ({ ...prev, wallet: true }));
    setCompletedActions(prev => [...prev, "address"]);
    toast({ 
      title: "Wallet Address Submitted!", 
      description: "Wallet task completed successfully." 
    });
  };

  const handleTwitterSuccess = (username: string) => {
    setUserTwitterUsername(username);
    setCompletedTasks(prev => ({ ...prev, twitter: true }));
    setCompletedActions(prev => [...prev, "twitter"]);
    toast({ 
      title: "Twitter Follow Verified!", 
      description: "Twitter task completed successfully." 
    });
  };

  const handleDiscordSuccess = (username: string) => {
    setUserDiscordUsername(username);
    setCompletedTasks(prev => ({ ...prev, discord: true }));
    setCompletedActions(prev => [...prev, "discord"]);
    toast({ 
      title: "Discord Join Verified!", 
      description: "Discord task completed successfully." 
    });
  };

  // Check if all required actions are completed (email, wallet, twitter, discord)
  const requiredActions = ["email", "address", "twitter", "discord"];
  const allActionsCompleted = requiredActions.every(action => 
    completedActions.includes(action)
  );

  // Alternative way to check completion using the new state
  const allTasksCompleted = Object.values(completedTasks).every(Boolean);

  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/images/background1.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header />
      <div className="flex-grow pt-0 px-4 pb-4">
        <div className="max-w-xl mx-auto space-y-6 py-10">
          {/* Header */}
          <div className="text-center mb-8">
          <h2
            className="text-5xl font-bold uppercase mb-2 bg-gradient-to-b from-[#b3a4f7] via-[#8f6fff] to-[#2d186c] bg-clip-text text-pretty  "
          >
            JOIN THE WAITLIST
          </h2>
            <p className="text-[#5D43EF EDEAFF]  text-3xl uppercase">
              FOR THE NEFTIT WEB3 EXPERIENCE
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-5 px-1 text-[#5D43EF EDEAFF]">
            <WaitlistCard
              icon={<img src="/images/email.png" alt="Email Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Connect Email"
              subtitle="To Receive Latest Updates First"
              completed={completedTasks.email}
              onClick={() => handleTaskComplete("email")}
            />
            {showEmailInput && (
              <div className="bg-[#080420]/90 border border-[#3B5EFB]/70 p-4 rounded-xl shadow-[0_0_15px_rgba(59,94,251,0.3)]">
                <div className="flex flex-col space-y-3">
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
                  <Input
                    type="text"
                    placeholder="Your name (optional)"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
                  <Button 
                    onClick={handleEmailSubmit}
                    className="bg-[#5D43EF] hover:bg-[#4935c8] text-white font-bold py-2 rounded-xl"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}

            <WaitlistCard
              icon={<img src="/images/WALLET.png" alt="Wallet Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Enter Wallet Address"
              subtitle="To Receive Web3 Rewards"
              completed={completedTasks.wallet}
              onClick={() => handleTaskComplete("wallet")}
            />
            {showWalletInput && (
              <div className="bg-[#080420]/90 border border-[#3B5EFB]/70 p-4 rounded-xl shadow-[0_0_15px_rgba(59,94,251,0.3)]">
                <div className="flex flex-col space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter your EVM wallet address"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
                  <Button 
                    onClick={handleWalletSubmit}
                    className="bg-[#5D43EF] hover:bg-[#4935c8] text-white font-bold py-2 rounded-xl"
                  >
                    Submit
                  </Button>
                </div>
              </div>
            )}

            <WaitlistCard
              icon={<img src="/images/x.png" alt="X Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Follow Us On X"
              subtitle="To Stay Updated On Latest News"
              completed={completedTasks.twitter}
              onClick={() => handleTaskComplete("twitter")}
            />
            {showTwitterInput && (
              <div className="bg-[#080420]/90 border border-[#3B5EFB]/70 p-4 rounded-xl shadow-[0_0_15px_rgba(59,94,251,0.3)]">
                <div className="flex flex-col space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter your Twitter username"
                    value={twitterUsername}
                    onChange={(e) => setTwitterUsername(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
                  <Button 
                    onClick={handleTwitterSubmit}
                    className="bg-[#5D43EF] hover:bg-[#4935c8] text-white font-bold py-2 rounded-xl"
                  >
                    Confirm Follow
                  </Button>
                </div>
              </div>
            )}

            <WaitlistCard
              icon={<img src="/images/discord1.png" alt="Discord Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Join Our Discord"
              subtitle="Join & Become A Part Of our community"
              completed={completedTasks.discord}
              onClick={() => handleTaskComplete("discord")}
            />
            {showDiscordInput && (
              <div className="bg-[#080420]/90 border border-[#3B5EFB]/70 p-4 rounded-xl shadow-[0_0_15px_rgba(59,94,251,0.3)]">
                <div className="flex flex-col space-y-3">
                  <Input
                    type="text"
                    placeholder="Enter your Discord username"
                    value={discordUsername}
                    onChange={(e) => setDiscordUsername(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
                  <Button 
                    onClick={handleDiscordSubmit}
                    className="bg-[#5D43EF] hover:bg-[#4935c8] text-white font-bold py-2 rounded-xl"
                  >
                    Confirm Join
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Enter Button */}
          <div className="mt-10">
          <Button
  className={`w-full py-6 px-6 rounded-xl font-bold text-2xl uppercase tracking-wide transition-all duration-300 ${
    allTasksCompleted
      ? "bg-[#5D43EF] text-white shadow-[0_0_20px_rgba(59,94,251,0.5)]"
      : "bg-gray-800/70 text-blue-200 cursor-not-allowed"
  }`}
  style={allTasksCompleted ? { } : {}}
  disabled={!allTasksCompleted}
  onClick={() => {
    if (allTasksCompleted) {
      navigate('/dashboard');
    }
  }}
>
  <span className="flex items-center justify-center">
    ENTER NEFTIT
    <svg className="ml-4 w-20 h-20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  </span>
</Button>
          </div>

          {/* Email Modal - Keep for backward compatibility but don't use */}
            <EmailModal
              isOpen={showEmailModal}
              onClose={() => setShowEmailModal(false)}
              onSuccess={handleEmailSuccess}
              referralCode={new URLSearchParams(window.location.search).get('referralCode') || undefined}
            />
          
          {/* Wallet Verification Modal - Keep for backward compatibility but don't use */}
          <WalletVerificationDialog
            isOpen={showWalletModal}
            onClose={() => setShowWalletModal(false)}
            onSuccess={handleWalletSuccess}
          />
          
          {/* Twitter Verification Modal - Keep for backward compatibility but don't use */}
          <TwitterVerificationDialog
            isOpen={showTwitterModal}
            onClose={() => setShowTwitterModal(false)}
            onSuccess={handleTwitterSuccess}
          />
          
          {/* Discord Verification Modal - Keep for backward compatibility but don't use */}
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

export default Index;