
import { useState, useEffect } from "react";
import { X, Copy, ArrowLeft, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import LeaderboardItem from "@/components/LeaderboardItem";

const ReferralDashboard = () => {
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
    <div className="min-h-screen bg-gradient-to-b from-black to-purple-950 text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
        {/* Back Button */}
        <div className="flex justify-start">
          <Button
            onClick={() => window.location.href = "/waitlist"}
            variant="ghost"
            className="text-white hover:bg-blue-800/30 rounded-full p-2"
            aria-label="Back to waitlist"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
        </div>

        {/* User Profile Card */}
        <div className="bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  <div className="w-8 h-8 rounded-full bg-blue-400"></div>
                </div>
              </div>
              <div>
                <h2 className="text-purple-300 text-2xl font-bold">
                  {userInfo?.name || "NEFTIT BELIEVER"}
                </h2>
                <p className="text-purple-400">{userInfo?.email}</p>
                {userInfo?.wallet_address && (
                  <p className="text-purple-400 text-sm truncate" title={userInfo.wallet_address}>
                    Wallet: {userInfo.wallet_address.substring(0, 6)}...{userInfo.wallet_address.substring(38)}
                  </p>
                )}
                {joinedDate && (
                  <p className="text-purple-400 text-sm">Joined: {joinedDate}</p>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-3">
                <div className="relative group">
                  {/* Trophy background glow */}
                  <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full opacity-40 blur-lg group-hover:opacity-60 transition duration-500"></div>
                  
                  {/* Trophy container with gradient background */}
                  <div className="relative w-16 h-16 bg-gradient-to-br from-blue-500/20 to-indigo-600/20 rounded-full border border-blue-500/30 flex items-center justify-center shadow-lg">
                    <div className="absolute inset-0 bg-black/20 rounded-full"></div>
                    
                    {/* Trophy icon with glow effect */}
                    <div className="relative">
                      <div className="absolute inset-0 text-blue-300 blur-md opacity-60">
                        <Trophy className="w-10 h-10" strokeWidth={2} />
                      </div>
                      <div className="relative text-blue-400 animate-pulse">
                        <Trophy className="w-10 h-10" strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-white text-2xl font-bold">YOUR RANK</h3>
                  <p className="bg-gradient-to-r from-blue-400 to-cyan-500 text-transparent bg-clip-text text-3xl font-bold">{userRank}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Referrals and Invite Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Your Referrals */}
          <div className="space-y-4">
            <div>
              <h3 className="text-white text-xl font-bold mb-2">YOUR REFERRALS</h3>
              <div className="text-purple-300 text-6xl font-bold">
                {userReferralCount} <span className="text-2xl">JOINED!</span>
              </div>
              <p className="text-purple-400 text-sm mt-2">INVITE MORE FRIENDS TO CLIMB ON TOP</p>
            </div>
          </div>

          {/* Invite Friends */}
          <div className="space-y-4">
            <h3 className="text-white text-xl font-bold">INVITE YOUR FRIENDS</h3>
            <div className="space-y-3">
              <Input
                value={referralLink}
                readOnly
                className="bg-black/20 border-purple-500/20 text-white rounded-xl"
              />
              <div className="flex space-x-3">
                <Button
                  onClick={shareOnTwitter}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-2 font-semibold"
                >
                  <X className="w-4 h-4 mr-2" />
                  SHARE ON X
                </Button>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  className="flex-1 border-purple-500/30 text-purple-300 hover:bg-purple-800/20 rounded-xl py-2 font-semibold"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  COPY LINK
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-gradient-to-br from-black/30 to-slate-900/30 backdrop-blur-sm border border-indigo-500/30 rounded-2xl p-6 shadow-lg shadow-blue-900/20">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white text-3xl font-bold mb-1">LEADERBOARD</h3>
              <p className="text-purple-400">NEFTIT TOP REFERRERS</p>
            </div>
            <div className="hidden md:block">
              <div className="px-4 py-2 bg-purple-600/20 rounded-lg border border-purple-500/30">
                <span className="text-purple-300 font-medium">Updated {new Date().toLocaleDateString()}</span>
              </div>
            </div>
          </div>
          
          {/* Leaderboard Header */}
          <div className="grid grid-cols-12 gap-4 mb-4 text-blue-200 font-semibold px-4 py-3 border-b border-blue-500/30">
            <div className="col-span-1 flex items-center">
              <span className="text-sm tracking-wider">#</span>
            </div>
            <div className="col-span-5 flex items-center">
              <span className="text-sm tracking-wider">NAME</span>
            </div>
            <div className="col-span-3 flex items-center">
              <span className="text-sm tracking-wider">JOINED</span>
            </div>
            <div className="col-span-3 flex items-center justify-end">
              <span className="text-sm tracking-wider">REFERRALS</span>
            </div>
          </div>
          
          <div className="space-y-2">
            {leaderboardData.length > 0 ? (
              leaderboardData.map((item, index) => (
                <div 
                  key={item.email}
                  className={`grid grid-cols-12 gap-4 p-4 items-center transition-all duration-200 hover:bg-blue-600/10 ${
                    index === 0 ? 'bg-gradient-to-r from-blue-500/10 to-cyan-600/5 border border-blue-500/30 rounded-xl shadow-sm' : 
                    index === 1 ? 'bg-gradient-to-r from-cyan-400/10 to-teal-500/5 border border-teal-400/30 rounded-xl' : 
                    index === 2 ? 'bg-gradient-to-r from-indigo-600/10 to-blue-700/5 border border-indigo-600/30 rounded-xl' : 
                    'bg-black/20 backdrop-blur-sm border border-blue-500/20 rounded-xl'
                  }`}
                >
                  <div className="col-span-1">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-gradient-to-br from-blue-400 to-blue-600 shadow shadow-blue-600/50' : 
                      index === 1 ? 'bg-gradient-to-br from-cyan-400 to-teal-600 shadow shadow-teal-600/50' : 
                      index === 2 ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 shadow shadow-indigo-700/50' : 
                      'bg-gradient-to-br from-slate-500 to-slate-700'
                    }`}>
                      {index + 1}
                    </div>
                  </div>
                  <div className="col-span-5">
                    <div className="flex flex-col">
                      <span className="text-white font-semibold truncate">{item.name || 'Anonymous'}</span>
                      <span className="text-purple-400 text-xs truncate">{item.email.substring(0, 3)}****{item.email.split('@')[1]}</span>
                    </div>
                  </div>
                  <div className="col-span-3">
                    <div className="bg-purple-900/30 px-3 py-1 rounded-md border border-purple-500/20 inline-block">
                      <span className="text-purple-300 text-sm">{item.joined_date || 'Unknown'}</span>
                    </div>
                  </div>
                  <div className="col-span-3 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`font-bold text-xl ${
                        index === 0 ? 'text-blue-400' : 
                        index === 1 ? 'text-teal-400' : 
                        index === 2 ? 'text-indigo-400' : 
                        'text-blue-300'
                      }`}>{item.referral_count}</span>
                      <span className="text-purple-400 text-xs">invites</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl">
                <p className="text-purple-300 text-center mb-2">No referrals data available yet.</p>
                <p className="text-purple-400 text-sm text-center">Be the first to invite your friends!</p>
              </div>
            )}
          </div>
          
          {leaderboardData.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-purple-400 text-sm">
                Invite more friends to climb the ranks and earn rewards!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReferralDashboard;
