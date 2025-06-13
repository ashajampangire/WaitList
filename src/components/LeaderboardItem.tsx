
interface LeaderboardItemProps {
  rank: number;
  name: string;
  referrals: number; // Ensure this is treated as a number
  isCurrentUser?: boolean;
}

const LeaderboardItem = ({ rank, name, referrals, isCurrentUser = false }: LeaderboardItemProps) => {
  const getRankColor = (rank: number) => {
    // Different colors for top 3 ranks
    if (rank === 1) return "bg-[#FFD700]"; // Gold for 1st place
    if (rank === 2) return "bg-[#C0C0C0]"; // Silver for 2nd place
    if (rank === 3) return "bg-[#CD7F32]"; // Bronze for 3rd place
    return "bg-[#5D43EF]"; // Default blue color for other ranks
  };

  return (
    <div className={`border border-silver-500/30 rounded-2xl p-4 flex items-center justify-between transition-all ${isCurrentUser ? 'ring-2 ring-[#3B5EFB]' : ''}`}>
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full ${getRankColor(rank)} flex items-center justify-center text-white font-bold text-sm`}>
          {rank}
        </div>
        <span className="text-white font-medium text-sm uppercase tracking-wider">{name}</span>
      </div>
      <div className="flex items-center">
        <span className="text-white font-bold text-lg mr-2">{referrals}</span>
        <span className="text-gray-400 text-xs uppercase">REFERRALS</span>
      </div>
    </div>
  );
};

export default LeaderboardItem;
