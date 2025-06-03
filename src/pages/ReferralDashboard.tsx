
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { X, Copy, ArrowLeft, Trophy } from "lucide-react";
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
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center p-4">
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
    <div className="min-h-screen flex flex-col neftit-gradient-bg text-white">
      <Header />
      <main className="flex-grow pt-4 px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* User Stats Card */}
          <div className="bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl overflow-hidden">
            <div className="p-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-6 md:space-y-0">
                <div className="flex items-center space-x-4">
                  <div className="bg-[#3B5EFB] w-16 h-16 rounded-full flex items-center justify-center">
                    <img 
                      src="/blue-penguin.png" 
                      alt="Profile" 
                      className="w-15 h-15 rounded-full" 
                      onError={(e) => {
                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${userInfo?.name || 'User'}&background=3B5EFB&color=fff&size=64`;
                      }} 
                    />
                  </div>
                  <div>
                    <h2 className="text-[#3B5EFB] font-bold text-xl uppercase tracking-wider">{userInfo?.name || "NEFTIT BELIEVER"}</h2>
                    <p className="text-gray-400 text-sm">{userInfo?.email}</p>
                    {joinedDate && (
                      <p className="text-gray-500 text-xs mt-1">JOINED {joinedDate.toUpperCase()}</p>
                    )}
                  </div>
                </div>
                
                <div className="bg-black/30 border border-blue-500/30 rounded-xl p-4 text-center">
                  <h3 className="text-gray-400 text-xs uppercase tracking-wider">YOUR RANK</h3>
                  <p className="text-[#3B5EFB] text-4xl font-bold">{userRank}</p>
                </div>
              </div>
              
              <div className="mt-6 border-t border-blue-500/30 pt-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-6 md:space-y-0">
                  <div>
                    <h3 className="text-white text-xs uppercase tracking-wider font-medium mb-1">YOUR REFERRALS</h3>
                    <p className="text-[#3B5EFB] text-4xl font-bold">{userReferralCount} <span className="text-white text-xl">JOINED!</span></p>
                    <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">INVITE MORE FRIENDS TO CLIMB ON TOP</p>
                  </div>
                  
                  <div className="w-full md:w-96 space-y-3">
                    <h3 className="text-white text-xs uppercase tracking-wider font-medium">INVITE YOUR FRIENDS</h3>
                    <div className="relative">
                      <input 
                        className="bg-black/30 border border-blue-500/30 text-gray-300 text-sm p-3 pr-10 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3B5EFB]"
                        value={referralLink}
                        readOnly
                      />
                      <button 
                        onClick={copyToClipboard}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors"
                        title="Copy to clipboard"
                      >
                        <Copy className="w-4 h-4 text-blue-400" />
                      </button>
                    </div>
                    
                    <button 
                      className="w-full bg-[#3B5EFB] hover:bg-blue-600 text-white rounded-xl py-3 px-4 flex items-center justify-center space-x-2 text-sm font-medium uppercase tracking-wider transition-colors"
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
          <div className="bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-900/60 to-indigo-900/60 px-6 py-4 border-b border-blue-500/30">
              <div className="flex items-center space-x-3">
                <div className="bg-[#3B5EFB]/20 p-2 rounded-lg">
                  <Trophy className="w-6 h-6 text-[#3B5EFB]" strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-white text-xl font-bold uppercase tracking-wider">LEADERBOARD</h3>
                  <p className="text-blue-300 text-xs uppercase tracking-wider">NEFTIT TOP REFERRALS</p>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-3">
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
                <div className="flex flex-col items-center justify-center py-10 bg-black/20 backdrop-blur-sm border border-blue-500/30 rounded-2xl">
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
