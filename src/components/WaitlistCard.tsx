
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface WaitlistCardProps {
  icon: ReactNode;
  title: string;
  subtitle: string;
  completed: boolean;
  onClick: () => void;
  className?: string;
}

const WaitlistCard = ({ icon, title, subtitle, completed, onClick, className = "" }: WaitlistCardProps) => {
  return (
    <Card 
      className={`bg-[url(assets/images/wait2.jpg)] bg-cover bg-center bg-no-repeat backdrop-blur-sm border border-[#5D43EF EDEAFF] rounded-2xl p-5 px-8 cursor-pointer transition-all duration-300 hover:bg-[#080420]/90 hover:border-[#5D43EF EDEAFF] ${
        completed ? "border-[#5D43EF EDEAFF] shadow-[0_0_15px_rgba(59,94,251,0.3)]" : ""
      } ${className}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-5">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-[#3B5EFB] shadow-[0_0_10px_rgba(59,94,251,0.4)]`} style={{ filter: 'drop-shadow(0 0 5px rgba(59, 94, 251, 0.4))' }}>
            <div className="text-white">
              {icon}
            </div>
          </div>
          <div>
            <h3 className="text-white font-bold text-2xl">{title}</h3>
            <p className="text-white/80 text-lg">{subtitle}</p>
          </div>
        </div>
        <div>
          {completed ? (
  <div className="w-10 h-10 rounded-full bg-[#5D43EF] border border-[#5D43EF EDEAFF] flex items-center justify-center shadow-[0_0_8px_rgba(59,94,251,0.5)]" style={{ filter: 'drop-shadow(0 0 3px rgba(59, 94, 251, 0.5))' }}>
    <img src="/images/checked1.png" alt="Checked" className="w-10 h-10 object-contain rounded-full" />
  </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18L15 12L9 6" stroke="#3B5EFB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default WaitlistCard;
