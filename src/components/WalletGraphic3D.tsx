import React, { useRef, useEffect } from 'react';

/**
 * A 3D animated wallet graphic rendered with CSS transforms
 * No external 3D libraries required - uses pure CSS for a lightweight solution
 */
const WalletGraphic3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Animation effect for subtle hovering motion
    const container = containerRef.current;
    if (!container) return;
    
    let animationFrame: number;
    let rotateY = 0;
    let rotateX = 10;
    let hoverOffset = 0;
    let direction = 1;
    
    const animate = () => {
      // Create subtle floating and rotation effect
      rotateY += 0.2;
      hoverOffset += 0.05 * direction;
      
      // Reverse direction when reaching limits
      if (hoverOffset > 5 || hoverOffset < -5) {
        direction *= -1;
      }
      
      if (container) {
        container.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(${hoverOffset}px)`;
      }
      
      animationFrame = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      cancelAnimationFrame(animationFrame);
    };
  }, []);
  
  return (
    <div className="wallet-graphic-container flex justify-center items-center my-6">
      <div 
        ref={containerRef}
        className="wallet-3d relative w-44 h-32 transition-transform duration-300 ease-out"
        style={{ transformStyle: 'preserve-3d', perspective: '800px' }}
      >
        {/* Wallet base */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-800 shadow-xl"
             style={{ transform: 'translateZ(0px)' }}>
          {/* Ethereum logo */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-opacity-20 text-5xl font-bold">Ξ</div>
          </div>
        </div>
        
        {/* Wallet top face */}
        <div className="absolute top-0 left-0 right-0 h-10 rounded-t-xl bg-gradient-to-r from-purple-700 to-indigo-900"
             style={{ transform: 'rotateX(-90deg) translateZ(-10px) translateY(-10px)' }}>
        </div>
        
        {/* Wallet bottom face */}
        <div className="absolute bottom-0 left-0 right-0 h-10 rounded-b-xl bg-gradient-to-r from-purple-900 to-indigo-950"
             style={{ transform: 'rotateX(90deg) translateZ(-10px) translateY(10px)' }}>
        </div>
        
        {/* Wallet left face */}
        <div className="absolute top-0 left-0 bottom-0 w-10 bg-gradient-to-b from-purple-800 to-indigo-900"
             style={{ transform: 'rotateY(90deg) translateZ(-10px) translateX(10px)' }}>
        </div>
        
        {/* Wallet right face */}
        <div className="absolute top-0 right-0 bottom-0 w-10 bg-gradient-to-b from-purple-800 to-indigo-900"
             style={{ transform: 'rotateY(-90deg) translateZ(-10px) translateX(-10px)' }}>
        </div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-xl bg-purple-500 opacity-30 blur-xl"
             style={{ transform: 'translateZ(-10px)', filter: 'blur(20px)' }}>
        </div>
        
        {/* Card in wallet */}
        <div className="absolute top-5 left-5 w-32 h-20 rounded-lg bg-gradient-to-br from-indigo-400/80 to-purple-500/80 shadow-lg"
             style={{ transform: 'translateZ(5px)' }}>
          <div className="absolute top-2 left-2 w-6 h-4 rounded bg-yellow-400/80"></div>
          <div className="absolute bottom-2 left-2 right-2 h-4 rounded bg-gray-800/50"></div>
        </div>
      </div>
    </div>
  );
};

export default WalletGraphic3D;
