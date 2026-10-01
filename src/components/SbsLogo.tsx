import React, { useState } from 'react';

interface SbsLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SbsLogo: React.FC<SbsLogoProps> = ({ className = '', size = 'md' }) => {
  const [imgError, setImgError] = useState(false);

  const hotlinkUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDbP4H3Fii4ZXweMhOGLvppLCxtD64FPY3IIBYc5n9auux20VFUIGid5AsIzePz9wwdJ5oEdjfGmFH6h88vG-rWjOFnMndYyX62ZoBN6V_JE263O7vMhV_k9URHK2VIxoG9XDJ4iZewsN4O7kSgccN0kbhJFsx9gxu7ErBfyyWYmxbQ4J2IbSPUJxvEoQo4qteGPdQTh1jwYdbxQZSDmMx2W6XE2eeNeROfHeSrsHo76UYk5Z3dMgEZCw';

  if (!imgError) {
    return (
      <img
        src={hotlinkUrl}
        alt="SBS Transit Live Arrival"
        onError={() => setImgError(true)}
        className={`object-contain select-none ${
          size === 'sm' ? 'h-6' : size === 'lg' ? 'h-10' : 'h-8'
        } ${className}`}
      />
    );
  }

  // Pixel-accurate vector badge fallback from Image 1 & 2
  return (
    <div
      className={`inline-flex items-center gap-2 bg-[#041453] px-2.5 py-1 rounded-xl text-white select-none ${
        size === 'sm' ? 'h-6 text-[10px]' : size === 'lg' ? 'h-10 text-[14px]' : 'h-8 text-[12px]'
      } ${className}`}
    >
      <div className="bg-[#de2264] rounded-md p-1 flex items-center justify-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}
        >
          <rect x="3" y="4" width="18" height="13" rx="2" fill="white" stroke="none" />
          <line x1="6" y1="8" x2="18" y2="8" stroke="#de2264" strokeWidth="2" strokeLinecap="round" />
          <circle cx="7.5" cy="19" r="1.8" fill="white" />
          <circle cx="16.5" cy="19" r="1.8" fill="white" />
        </svg>
      </div>
      <div className="flex flex-col leading-tight font-bold">
        <span className="tracking-tight text-white font-extrabold text-[13px]">SBS Transit</span>
        <span className="text-[9px] tracking-wider font-semibold text-slate-300 uppercase">
          Live Arrival
        </span>
      </div>
    </div>
  );
};
