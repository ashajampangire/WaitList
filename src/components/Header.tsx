import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className }) => {
  return (
    <header className={`w-full py-2 px-4 flex items-center justify-between ${className}`}>
      <div className="flex items-center">
        <Link to="/" className="flex items-center">
          <div className="relative">
            <img 
              src="/Logo_Neftit.png" 
              alt="NEFTIT Logo" 
              className="h-8 md:h-10 object-contain transition-transform hover:scale-105" 
            />
          </div>
        </Link>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger className="focus:outline-none">
          <div className="p-2 rounded-full hover:bg-[#5D3FD3]/30 transition-colors duration-200">
            <MoreHorizontal className="h-6 w-6 text-white" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-[#0B0420] border border-blue-500/30 text-white">
          <Link to="/" className="w-full">
            <DropdownMenuItem className="cursor-pointer hover:bg-[#5D3FD3]/30 focus:bg-[#5D3FD3]/30">
              Home
            </DropdownMenuItem>
          </Link>
          <Link to="/waitlist" className="w-full">
            <DropdownMenuItem className="cursor-pointer hover:bg-[#5D3FD3]/30 focus:bg-[#5D3FD3]/30">
              Join Waitlist
            </DropdownMenuItem>
          </Link>
          <Link to="/dashboard" className="w-full">
            <DropdownMenuItem className="cursor-pointer hover:bg-[#5D3FD3]/30 focus:bg-[#5D3FD3]/30">
              Dashboard
            </DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};
