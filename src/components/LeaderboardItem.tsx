
interface LeaderboardItemProps {
  rank: number;
  name: string;
  referrals: number;
}

const LeaderboardItem = ({ rank, name, referrals }: LeaderboardItemProps) => {
  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-500 to-yellow-600";
      case 2:
        return "bg-gradient-to-r from-gray-400 to-gray-500";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-700";
      default:
        return "bg-purple-600";
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:bg-black/30">
      <div className="flex items-center space-x-4">
        <div className={`w-10 h-10 rounded-full ${getRankColor(rank)} flex items-center justify-center text-white font-bold`}>
          {rank}
        </div>
        <span className="text-white font-semibold text-lg">{name}</span>
      </div>
      <div className="text-purple-300 font-bold text-xl">
        {referrals}
      </div>
    </div>
  );
};

export default LeaderboardItem;
