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
import Footer from "@/components/Footer";
import Faq from "@/components/Faq";
import { supabase } from "@/integrations/supabase/client";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const referralCode = searchParams.get("ref");
  
  const { toast } = useToast();
  const { getTotalWaitlistCount, joinWaitlist, validateWalletAddress, updateWaitlistEntry, verifyTwitterFollow, verifyDiscordJoin } = useWaitlist();

  // Store referral code when component mounts
  useEffect(() => {
    if (referralCode) {
      localStorage.setItem('pending_referral_code', referralCode);
      toast({
        title: "Referral Detected",
        description: `You've been referred by a friend!`,
      });
    }
  }, [referralCode]);

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

  const [isSignIn, setIsSignIn] = useState(false);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showSignInForm, setShowSignInForm] = useState(false);

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
      window.open("https://discord.com/invite/neftit", "_blank");
      setShowDiscordInput(true);
      return;
    }
  };

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

    // Password validation for sign up
    if (!isSignIn) {
      if (!password) {
        toast({
          title: "Password Required",
          description: "Please enter a password.",
          variant: "destructive"
        });
        return;
      }

      if (password.length < 8) {
        toast({
          title: "Invalid Password",
          description: "Password must be at least 8 characters long.",
          variant: "destructive"
        });
        return;
      }
    }

    setIsLoading(true);
    try {
      if (isSignIn) {
        // Handle sign in using Supabase
        const { data: user, error } = await supabase
          .from('waitlist_entries')
          .select('*')
          .eq('email', email.trim())
          .single();

        if (error || !user) {
          throw new Error('Invalid credentials');
        }

        if (user.email === email.trim()) {
          // Update state with user data
          setUserEmail(email.trim());
          setEmail(email.trim());
          
          // Restore all user data and completed tasks
          if (user.name) {
            setUserName(user.name);
          }
          if (user.wallet_address) {
            setUserWalletAddress(user.wallet_address);
            setWalletAddress(user.wallet_address);
            setCompletedTasks(prev => ({ ...prev, wallet: true }));
            setCompletedActions(prev => [...prev, "address"]);
          }
          if (user.twitter_username && user.twitter_followed) {
            setUserTwitterUsername(user.twitter_username);
            setTwitterUsername(user.twitter_username);
            setCompletedTasks(prev => ({ ...prev, twitter: true }));
            setCompletedActions(prev => [...prev, "twitter"]);
          }
          if (user.discord_username && user.discord_joined) {
            setUserDiscordUsername(user.discord_username);
            setDiscordUsername(user.discord_username);
            setCompletedTasks(prev => ({ ...prev, discord: true }));
            setCompletedActions(prev => [...prev, "discord"]);
          }

          // Always mark email as completed for signed-in users
          setCompletedTasks(prev => ({ ...prev, email: true }));
          setCompletedActions(prev => [...prev, "email"]);
          setShowEmailInput(false);
          setShowSignInForm(false);

          // Store in localStorage
          localStorage.setItem(
            "waitlist_user",
            JSON.stringify({
              ...user,
              updated_at: new Date().toISOString(),
            })
          );

          // Check if all tasks are completed
          const allTasksCompleted = Object.values({
            email: true,
            wallet: !!user.wallet_address,
            twitter: !!(user.twitter_username && user.twitter_followed),
            discord: !!(user.discord_username && user.discord_joined)
          }).every(Boolean);

          if (allTasksCompleted) {
            toast({ 
              title: "Welcome Back!", 
              description: "All your tasks are completed. You can proceed to the dashboard."
            });
          } else {
            toast({ 
              title: "Signed In!", 
              description: "Welcome back! Please complete any remaining tasks."
            });
          }
        } else {
          throw new Error('Invalid credentials');
        }
      } else {
        // Handle sign up
        const pendingReferral = localStorage.getItem('pending_referral_code');
        const entry = await joinWaitlist(
          email.trim(),
          undefined, // Remove name from signup
          pendingReferral || referralCode,
          password
        );
        
        if (entry) {
          // Add timestamp to track when users joined
          const currentTime = new Date().toISOString();
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

          // Clear pending referral after successful signup
          if (pendingReferral) {
            localStorage.removeItem('pending_referral_code');
          }
        }
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      toast({ 
        title: "Error", 
        description: error.message === 'Invalid credentials' 
          ? "Invalid email or password. Please try again."
          : "Something went wrong. Please try again.", 
        variant: "destructive" 
      }); 
    } finally {
      setIsLoading(false);
    }
  }; 

  const handleWalletSubmit = async () => { 
    if (!walletAddress) { 
      toast({ 
        title: "Wallet Address Required", 
        description: "Please enter your EVM wallet address to receive rewards.", 
        variant: "destructive" 
      }); 
      return; 
    } 

    if (!userName) {
      toast({
        title: "Name Required",
        description: "Please enter your name to continue.",
        variant: "destructive"
      });
      return;
    }

    // Trim and normalize the wallet address
    const normalizedAddress = walletAddress.trim().toLowerCase();

    // Validate the wallet address format
    if (!validateWalletAddress(normalizedAddress)) {
      toast({ 
        title: "Invalid Wallet Address", 
        description: "Please enter a valid Ethereum wallet address (0x followed by 40 hexadecimal characters).", 
        variant: "destructive" 
      }); 
      return;
    }

    try {
      // Check if wallet address is already registered
      const { data: existingWallet, error: checkError } = await supabase
        .from('waitlist_entries')
        .select('email')
        .eq('wallet_address', normalizedAddress)
        .single();

      if (existingWallet && existingWallet.email !== userEmail) {
        toast({ 
          title: "Wallet Already Registered", 
          description: "This wallet address is already registered to another account. Please try a different wallet address.", 
          variant: "destructive" 
        });
        return;
      }

      // Update the user's wallet address in the database
      if (userEmail) {
        const result = await updateWaitlistEntry(userEmail, { 
          wallet_address: normalizedAddress,
          name: userName.trim()
        });
        
        if (!result) {
          throw new Error('Failed to update wallet address');
        }
        
        // Update local state
        setUserWalletAddress(normalizedAddress);
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
              wallet_address: normalizedAddress,
              name: userName.trim(),
              updated_at: new Date().toISOString(),
            })
          );
        }

        toast({ 
          title: "Wallet Address Linked", 
          description: "Your wallet address has been successfully linked to your account." 
        });
      } else {
        toast({ 
          title: "Sign In Required", 
          description: "Please sign in with your email first before adding a wallet address.", 
          variant: "destructive" 
        });
        setShowEmailInput(true);
      }
    } catch (error) {
      console.error("Error in wallet submission:", error);
      
      if (error.message && error.message.includes('duplicate key value')) {
        toast({ 
          title: "Wallet Already Registered", 
          description: "This wallet address is already registered to another account. Please try a different wallet address.", 
          variant: "destructive" 
        });
      } else if (error.message && error.message.includes('network')) {
        toast({ 
          title: "Network Error", 
          description: "Please check your internet connection and try again.", 
          variant: "destructive" 
        });
      } else if (error.message && error.message.includes('timeout')) {
        toast({ 
          title: "Request Timeout", 
          description: "The request took too long. Please try again.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Error Saving Wallet", 
          description: "Unable to save your wallet address. Please try again later.", 
          variant: "destructive" 
        });
      }
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
    <div className="min-h-screen flex flex-col bg-[url(assets/images/4.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header/>
      <div style={{ zoom: 0.75 }} className="flex-grow pt-0 px-4 pb-4">
        <div className="max-w-xl mx-auto space-y-6 py-10">
          {/* Header */}
          <div className="text-center mb-8">
          <h2
            className="text-6xl font-bold uppercase mb-4 bg-gradient-to-b from-[#b3a4f7] via-[#8f6fff] to-[#2d186c] bg-clip-text text--transparent drop-shadow-lg tracking-tight animate-fade-in "
          >
            JOIN THE WAITLIST
          </h2>
            <p className="text-[#5D43EF EDEAFF]  text-3xl uppercase font-semibold tracking-wider drop-shadow-md animate-fade-in delay-150">
              FOR THE NEFTIT <span className="text-3xl font-bold uppercase mb-2 bg-gradient-to-b from-[#EF62BC] via-[#C45AE3] to-[#9D5CF9] bg-clip-text text-transparent">WEB3</span> EXPERIENCE
            </p>
          </div>

          {/* Action Cards */}
          <div className="space-y-5 px-1 text-[#5D43EF EDEAFF]">
            <WaitlistCard
              icon={<img src="/images/email.png" alt="Email Icon" className="w-full h-full object-contain rounded-lg"
                style={{ background: "transparent" }} />}
              title="Enter Email"
              subtitle="To Receive Latest Updates First"
              completed={completedTasks.email}
              onClick={() => handleTaskComplete("email")}
            />
            {showEmailInput && !isSignIn && (
              <div className="bg-[#080420]/90 border border-[#3B5EFB]/70 p-4 rounded-xl shadow-[0_0_15px_rgba(59,94,251,0.3)]">
                <div className="flex flex-col space-y-3">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">
                      Sign Up
                    </h3>
                  </div>
                  <Input
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
                  <Input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
                  <Button 
                    onClick={handleEmailSubmit}
                    disabled={isLoading}
                    className="bg-[#5D43EF] hover:bg-[#4935c8] text-white font-bold py-2 rounded-xl"
                  >
                    {isLoading ? "Loading..." : "Sign Up"}
                  </Button>
                </div>
              </div>
            )}

            {showSignInForm && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-[#080420]/95 border border-[#3B5EFB]/70 p-6 rounded-xl shadow-[0_0_15px_rgba(59,94,251,0.3)] w-full max-w-md mx-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-white">Sign In</h3>
                    <button
                      onClick={() => {
                        setShowSignInForm(false);
                        setEmail("");
                        setPassword("");
                      }}
                      className="text-white/60 hover:text-white"
                    >
                      <X size={24} />
                    </button>
                  </div>
                  <div className="flex flex-col space-y-4">
                    <Input
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                    />
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                    />
                    <Button 
                      onClick={handleEmailSubmit}
                      disabled={isLoading}
                      className="bg-[#5D43EF] hover:bg-[#4935c8] text-white font-bold py-2 rounded-xl"
                    >
                      {isLoading ? "Loading..." : "Sign In"}
                    </Button>
                  </div>
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
                    placeholder="Enter your name"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="bg-[#233876] p-3 rounded-xl text-white font-medium placeholder:text-white/80 focus:outline-none focus:ring-0 border-0"
                  />
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
                  const userData = localStorage.getItem("waitlist_user");
                  if (!userData) {
                    toast({
                      title: "Authentication Required",
                      description: "Please sign up or sign in first.",
                      variant: "destructive"
                    });
                    return;
                  }
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

          {/* Sign In Section */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center gap-2">
              <p className="text-white/80">Already have an account?</p>
              <button
                onClick={() => {
                  navigate('/signin');
                }}
                className="text-[#5D43EF] hover:text-[#4935c8] font-bold transition-colors"
              >
                Sign In
              </button>
            </div>
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
      <Faq />
      <Footer />
    </div>
  );
};

export default Index;