import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { X, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useWaitlist } from "@/hooks/useWaitlist";
import LeaderboardItem from "@/components/LeaderboardItem";
import Footer from "@/components/Footer";

const ReferralDashboard = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<any>(null);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [userReferralCount, setUserReferralCount] = useState(0);
  const [userRank, setUserRank] = useState(0);
  const [joinedDate, setJoinedDate] = useState<string | null>(null);
  const { toast } = useToast();
  const { getLeaderboard } = useWaitlist();

  const referralLink = userInfo?.referral_code 
    ? `${window.location.origin}?ref=${userInfo.referral_code}`
    : window.location.origin;

  useEffect(() => {
    const storedUser = localStorage.getItem('waitlist_user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUserInfo(userData);
    }
  }, []);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const data = await getLeaderboard();
        if (!data || !Array.isArray(data)) return;

        const sortedData = [...data].sort((a, b) => {
          const countA = typeof a.referral_count === 'number' ? a.referral_count : parseInt(a.referral_count || '0', 10);
          const countB = typeof b.referral_count === 'number' ? b.referral_count : parseInt(b.referral_count || '0', 10);
          if (countB !== countA) return countB - countA;
          const idA = typeof a.numeric_id === 'number' ? a.numeric_id : parseInt(a.numeric_id || '0', 10);
          const idB = typeof b.numeric_id === 'number' ? b.numeric_id : parseInt(b.numeric_id || '0', 10);
          return idA - idB;
        });

        const topTen = sortedData.slice(0, 10);
        setLeaderboardData(topTen);

        if (userInfo?.email) {
          const userEntry = sortedData.find(entry => entry.email === userInfo.email);
          if (userEntry) {
            const count = typeof userEntry.referral_count === 'number' 
              ? userEntry.referral_count 
              : parseInt(userEntry.referral_count || '0', 10);
            setUserReferralCount(count);

            const rank = sortedData.findIndex(entry => entry.email === userInfo.email) + 1;
            setUserRank(rank);

            if (userEntry.created_at) {
              const joinDate = new Date(userEntry.created_at);
              setJoinedDate(joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }));
            }
          }
        }
      } catch (error) {
        console.error('Error loading leaderboard:', error);
        toast({
          title: "Error",
          description: "Failed to load leaderboard data",
          variant: "destructive"
        });
      }
    };

    loadLeaderboard();
    const interval = setInterval(loadLeaderboard, 30000);
    return () => clearInterval(interval);
  }, [getLeaderboard, userInfo?.email, toast]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    toast({
      title: "Link copied!",
      description: "Referral link has been copied to clipboard."
    });
  };

  const shareOnTwitter = () => {
    const tweetText = encodeURIComponent("Join me on the NEFTIT waitlist for the future of Web3! 🚀");
    const url = encodeURIComponent(referralLink);
    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${url}`, "_blank");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[url(assets/images/4.jpg)] bg-cover bg-center bg-no-repeat text-white">
      <Header/>
      <main style={{ zoom: 0.95 }} className="flex-grow pt-4 px-4 pb-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="backdrop-blur-sm border border-[#5D43EF EDEAFF] rounded-2xl overflow-hidden">
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-14 md:space-y-0">
                <div className="flex items-center space-x-8">
                  <div className="w-32 h-32 rounded-full bg-white flex items-center justify-center shadow-md overflow-hidden ml-1" style={{ outline: '3px solid #6E47FF' }}>
                    <img src="src/assets/images/nft.jpg" alt="Profile" className="w-24 h-24 object-contain ml-1" style={{ transform: 'scale(1.2)' }} />
                  </div>
                  <div>
                    <h2 className="text-[#5D43EF] font-bold text-2xl uppercase tracking-wider">{userInfo?.name || "NEFTIT BELIEVER"}</h2>
                    <p className="text-gray-400 text-lg">{userInfo?.email}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <img src="src/assets/images/trophy.png" alt="trophy" className="w-24 h-21 object-contain" />
                  <div className="text-center">
                    <h3 className="py-4 text-[#5D43E EDEAFF] text-4xl font-extrabold uppercase tracking m-0 leading-none">YOUR RANK</h3>
                    <div className="py-4 w-20 h-10 flex items-center justify-center text-white font-bold text-4xl">
                      #{userRank}
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-[97%] h-[1px] mt-6 mb-6 bg-purple-500 mx-auto rounded-full" />
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                <div className="space-y-2">
                  <h2 className="text-white text-2xl font-bold uppercase tracking-wider">YOUR REFERRALS</h2>
                  <p className="text-[#5D43EF] text-5xl font-bold tracking">{userReferralCount} <span className="text-[#5D43EF] text-5xl">JOINED!</span></p>
                  <p className="text-[#5D43EF EDEAFF] text-md uppercase tracking-wider">INVITE MORE FRIENDS TO CLIMB ON TOP</p>
                </div>
                <div className="w-full lg:w-96 space-y-4">
                  <h2 className="text-[#5D43EF EDEAFF] text-xl font-bold uppercase tracking">INVITE YOUR FRIENDS</h2>
                  <div className="relative">
                    <input className="border border-[#5D43EF EDEAFF] text-[#5D43EF] text-lg p-2 pr-10 w-full rounded-xl focus:outline-none focus:ring-2 focus:ring-[#5D43EF]" value={referralLink} readOnly />
                    <button onClick={copyToClipboard} className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg hover:bg-blue-500/20 transition-colors" title="Copy to clipboard">
                      <Copy className="w-4 h-4 text-[#5D43EF]" />
                    </button>
                  </div>
                  <button onClick={shareOnTwitter} className="w-full bg-gradient-to-b from-[#8f6fff] to-[#2d186c] text-white rounded-2xl py-1 px-4 flex items-center justify-center space-x-2 text-md font-medium uppercase tracking-wider transition-colors">
                    <X className="w-10 h-10" />
                    <span>SHARE ON TWITTER</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="backdrop-blur-sm border border-[#5D43EF EDEAFF] rounded-2xl overflow-hidden">
            <div className="px-10 py-6">
              <h3 className="text-5xl font-bold uppercase bg-gradient-to-b from-[#b3a4f7] via-[#8f6fff] to-[#2d186c] bg-clip-text text-transparent">
                LEADERBOARD
              </h3>
              <p className="text-[#5D43EF EDEAFF] text-lg font-medium uppercase tracking-wider mt-2">
                NEFTIT TOP 10 REFERRALS
              </p>
            </div>
            <div className="p-4 space-y-3 border border-[#5D43EF EDEAFF]">
              {leaderboardData.length > 0 ? (
                leaderboardData.map((item, index) => {
                  const itemCount = typeof item.referral_count === 'number' ? item.referral_count : parseInt(item.referral_count || '0', 10);
                  const actualRank = index + 1;
                  return (
                    <LeaderboardItem 
                      key={item.email}
                      rank={actualRank}
                      name={item.name || 'Anonymous'}
                      referrals={itemCount}
                      isCurrentUser={item.email === userInfo?.email}
                    />
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 bg-black/20 backdrop-blur-sm border border-[#5D43EF EDEAFF] rounded-2xl">
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
