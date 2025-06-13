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
          <div className="relative top-4 left-4">
            <img 
              src="src/assets/images/Logo_Neftit.png" 
              alt="NEFTIT Logo" 
              className="h-10 md:h-12 object-contain transition-transform hover:scale-110 drop-shadow-[0_0_16px_rgba(93,67,239,0.7)]" 
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
