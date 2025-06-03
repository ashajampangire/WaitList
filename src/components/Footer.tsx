import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-blue-500/30 bg-[#0B0420] backdrop-blur-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 order-2 md:order-1">
            <span className="text-white text-sm">
              © 2025 <span className="text-[#3B5EFB] font-bold uppercase">NEFTIT</span>. ALL RIGHTS RESERVED.
            </span>
          </div>
          
          <div className="flex items-center gap-6 order-1 md:order-2">
            <a 
              href="https://twitter.com/intent/follow?screen_name=neftitxyz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#3B5EFB] hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a 
              href="https://discord.gg/GHc9samP" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#3B5EFB] hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
              aria-label="Discord"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
              </svg>
            </a>
            <a 
              href="https://github.com/neftit" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#3B5EFB] hover:text-blue-400 transition-all duration-300 transform hover:scale-110"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
