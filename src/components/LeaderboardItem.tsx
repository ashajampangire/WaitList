
interface LeaderboardItemProps {
  rank: number;
  name: string;
  referrals: number;
  isCurrentUser?: boolean;
}

const LeaderboardItem = ({ rank, name, referrals, isCurrentUser = false }: LeaderboardItemProps) => {
  const getRankColor = (rank: number) => {
    return "bg-[#5D43EF]"; // Consistent blue color for all ranks
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
