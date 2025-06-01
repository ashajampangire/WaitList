
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface WaitlistCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  completed: boolean;
  onClick: () => void;
}

const WaitlistCard = ({ icon, title, subtitle, completed, onClick }: WaitlistCardProps) => {
  return (
    <Card 
      className={`bg-black/20 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:bg-black/30 hover:border-purple-400/40 hover:scale-105 ${
        completed ? "ring-2 ring-purple-500" : ""
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            completed ? "bg-purple-600" : "bg-purple-600/80"
          }`}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-lg">{title}</h3>
            <p className="text-purple-300 text-sm">{subtitle}</p>
          </div>
        </div>
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
          completed 
            ? "bg-purple-600 border-purple-600" 
            : "border-purple-400/50 hover:border-purple-400"
        }`}>
          {completed && (
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WaitlistCard;
