
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { X, Copy, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import LeaderboardItem from "@/components/LeaderboardItem";
import { Footer } from "@/components/Footer";

const ReferralDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userReferralCount, setUserReferralCount] = useState(0);
  const [userRank, setUserRank] = useState("#001");
  const [joinedDate, setJoinedDate] = useState<string | null>(null);
  const { toast } = useToast();
  const { getLeaderboard } = useWaitlist();

  const referralLink = userInfo?.referral_code 
    ? `${window.location.origin}/waitlist?ref=${userInfo.referral_code}`
    : "https://neftit.com/waitlist";

  useEffect(() => {
    // Load user info from localStorage (set during waitlist signup)
    const storedUser = localStorage.getItem('waitlist_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserInfo(userData);
    }

    // Load leaderboard data
    const loadLeaderboard = async () => {
      const data = await getLeaderboard();
      // Show top 10 entries in the leaderboard
      setLeaderboardData(data.slice(0, 10));
      
      // Find user's position and referral count
      if (userInfo?.email) {
        const userEntry = data.find((entry: any) => entry.email === userInfo.email);
        if (userEntry) {
          // Ensure referral count is a number
          setUserReferralCount(typeof userEntry.referral_count === 'number' ? 
            userEntry.referral_count : parseInt(userEntry.referral_count || '0'));
          
          // Find user's rank in the leaderboard
          const rank = data.findIndex((entry: any) => entry.email === userInfo.email) + 1;
          setUserRank(`#${rank.toString().padStart(3, '0')}`);
          
          // Set joined date if available
          if (userEntry.created_at) {
            const joinDate = new Date(userEntry.created_at);
            setJoinedDate(joinDate.toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'short', 
              day: 'numeric' 
            }));
          }
        }
      }
    };

    if (userInfo?.email) {
      loadLeaderboard();
    }
  }, [getLeaderboard, userInfo?.email]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link has been copied to clipboard.",
    });
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent("Join me on the NEFTIT waitlist for the future of Web3! 🚀");
    const url = encodeURIComponent(referralLink);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`, "_blank");
  };

  // Redirect to waitlist if no user info
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-[url(assets/images/wait2.jpg)] bg-cover bg-center bg-no-repeat from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-white">Access Denied</h1>
          <p className="text-purple-300">Please join the waitlist first to access your dashboard.</p>
          <Button
            onClick={() => window.location.href = "/waitlist"}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            Join Waitlist
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/images/wait2.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header />
      <main className="flex-grow pt-4 px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* User Stats Card */}
          <div className=" backdrop-blur-sm border  border-[#5D43EF EDEAFF] rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-8 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className=" w-16 h-16 rounded-full flex items-center justify-center">
                    <img 
                      src="src/assets/images/blue-penguin.png" 
                      alt="Profile" 
                      className="w-15 h-15 rounded-full" 
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${userInfo?.name || 'User'}&background=3B5EFB&color=fff&size=64`;
                      }} 
                    />
                  </div>
                  <div>
                    <h2 className="text-[#5D43EF] font-bold text-xl uppercase tracking-wider">{userInfo?.name || "NEFTIT BELIEVER"}</h2>
                    <p className="text-gray-400 text-sm">{userInfo?.email}</p>
                    {joinedDate && (
                      <p className="text-[#5D43EF] text-2xl mt-1">JOINED {joinedDate.toUpperCase()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <img 
                      src="src/assets/images/trophy.png" 
                      alt="trophy"
                      className="w-28 h-28 object-contain" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-[#5D43E EDEAFF] text-3xl font-bold uppercase tracking-wider">YOUR RANK</h3>
                    <p className="text-[rgb(174,172,183)] text-border-[rgb(4,3,9)] text-3xl font-bold tracking-wider">{userRank}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 border border-[#5D43EF EDEAFF] rounded-2xl p-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  <div className="space-y-2">
                    <h3 className="text-white text-xl font-bold  uppercase tracking-wider">YOUR REFERRALS</h3>
                    <p className="text-[#5D43EF] text-4xl font-bold">{userReferralCount} <span className="text-[#5D43EF ] text-3xl">JOINED!</span></p>
                    <p className="text-[#5D43EF EDEAFF] text-sm uppercase ">INVITE MORE FRIENDS TO CLIMB ON TOP</p>
                  </div>
                  
                  <div className="w-full lg:w-96 space-y-4">
                    <h3 className="text-[#5D43EF EDEAFF] text-sm font-bold uppercase tracking-wider">INVITE YOUR FRIENDS</h3>
                    <div className="relative">
                      <input 
                        className=" border border-[#5D43EF EDEAFF] text-[#5D43EF] text-sm p-3 pr-10 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D43EF]"
                        value={referralLink}
                        readOnly
                      />
                      <button 
                        onClick={copyToClipboard}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-[#5D43EF]" />
                      </button>
                    </div>
                    
                    <button 
                      className="w-full bg-[#5D43EF]  text-white rounded-xl py-3 px-4 flex items-center justify-center space-x-2 text-sm font-medium uppercase tracking-wider transition-colors"
                      onClick={shareOnTwitter}
                    >
                      <X className="w-4 h-4" />
                      <span>SHARE ON TWITTER</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <div className="backdrop-blur-sm border border-[#5D43EF EDEAFF] rounded-2xl overflow-hidden">
            <div className="px-8 py-6">
              <div className="relative">
                <h3 className="text-5xl font-bold uppercase tracking-tight bg-gradient-to-r from-[#5D43EF] to-[#8B5CF6] bg-clip-text text-transparent">
                  LEADERBOARD
                </h3>
                <p className="text-[#5D43EF EDEAFF] text-sm font-medium uppercase tracking-wider mt-2">
                  NEFTIT TOP REFERRALS
                </p>
                <div className="absolute bottom-0 left-0 w-16 h-1  rounded-full"></div>
              </div>
            </div>
            
            <div className="p-4 space-y-3  border  border-[#5D43EF EDEAFF]">
              {leaderboardData.length > 0 ? (
                leaderboardData.map((item, index) => (
                  <LeaderboardItem 
                    key={item.email}
                    rank={index + 1}
                    name={item.name || 'Anonymous'}
                    referrals={item.referral_count}
                    isCurrentUser={item.email === userInfo?.email}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-black/20 backdrop-blur-sm  border  border-[#5D43EF EDEAFF] rounded-2xl">
                  <p className="text-purple-300 text-center mb-2">No referrals data available yet.</p>
                  <p className="text-purple-400 text-sm text-center">Be the first to invite your friends!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReferralDashboard;
