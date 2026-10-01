import React from 'react';
import { SbsLogo } from './SbsLogo';

interface HeaderProps {
  onSearchClick: () => void;
  onProfileClick: () => void;
  onLocationClick: () => void;
  currentLocationName: string;
}

export const Header: React.FC<HeaderProps> = ({
  onSearchClick,
  onProfileClick,
  onLocationClick,
  currentLocationName,
}) => {
  return (
    <header className="fixed top-0 w-full z-40 bg-white/95 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] border-b border-[#D5DCE5]/40 transition-colors">
      <div className="max-w-md mx-auto h-20 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SbsLogo size="md" className="h-8 shrink-0" />
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[16px] text-[#041453] tracking-tight">
                SBS Transit
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#0D8A43]/10 text-[#0D8A43] text-[11px] font-bold tracking-wider flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0D8A43] inline-block"></span>
                Normal
              </span>
            </div>
            <button
              onClick={onLocationClick}
              className="flex items-center gap-1 text-[#454650] hover:text-[#041453] transition-colors text-left"
              title="Change simulated location"
            >
              <span className="material-symbols-outlined text-[14px] text-[#E60028]">
                near_me
              </span>
              <span className="text-[12px] text-[#454650] font-medium truncate max-w-[130px]">
                {currentLocationName}
              </span>
              <span className="material-symbols-outlined text-[13px] text-slate-400">
                arrow_drop_down
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearchClick}
            aria-label="Search Transit"
            className="w-10 h-10 flex items-center justify-center rounded-full text-[#454650] hover:bg-[#EBEFF5] transition-colors active:scale-95"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          <button
            onClick={onProfileClick}
            aria-label="Commuter Profile"
            className="w-8 h-8 rounded-full bg-[#041453] flex items-center justify-center shadow-sm text-white hover:opacity-90 active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">person</span>
          </button>
        </div>
      </div>
    </header>
  );
};
