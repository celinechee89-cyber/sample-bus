import React from 'react';

export type NavTab = 'arrivals' | 'map' | 'favorites' | 'alerts';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  favoritesCount: number;
  alertsCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  alertsCount,
}) => {
  return (
    <nav className="fixed bottom-0 w-full z-40 pb-[max(env(safe-area-inset-bottom,0px),8px)] bg-white/95 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.06)] border-t border-[#D5DCE5]/50">
      <div className="max-w-md mx-auto flex justify-around items-center h-16 px-1">
        {/* Arrivals */}
        <button
          onClick={() => onTabChange('arrivals')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative ${
            activeTab === 'arrivals' ? 'text-[#041453] font-bold' : 'text-[#454650] hover:text-[#041453]'
          }`}
          aria-label="Bus Arrivals"
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'arrivals' ? 'material-symbols-filled' : ''
            }`}
          >
            directions_bus
          </span>
          <span className="text-[11px] tracking-wide mt-0.5 font-medium">Arrivals</span>
          {activeTab === 'arrivals' && (
            <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#E60028]" />
          )}
        </button>

        {/* Map */}
        <button
          onClick={() => onTabChange('map')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative ${
            activeTab === 'map' ? 'text-[#041453] font-bold' : 'text-[#454650] hover:text-[#041453]'
          }`}
          aria-label="Route Map"
        >
          <span
            className={`material-symbols-outlined text-[24px] ${
              activeTab === 'map' ? 'material-symbols-filled' : ''
            }`}
          >
            map
          </span>
          <span className="text-[11px] tracking-wide mt-0.5 font-medium">Map</span>
          {activeTab === 'map' && (
            <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#E60028]" />
          )}
        </button>

        {/* Favorites */}
        <button
          onClick={() => onTabChange('favorites')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative ${
            activeTab === 'favorites' ? 'text-[#041453] font-bold' : 'text-[#454650] hover:text-[#041453]'
          }`}
          aria-label="Favorites"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                activeTab === 'favorites' ? 'material-symbols-filled' : ''
              }`}
            >
              bookmark
            </span>
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#de2264] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[11px] tracking-wide mt-0.5 font-medium">Favorites</span>
          {activeTab === 'favorites' && (
            <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#E60028]" />
          )}
        </button>

        {/* Alerts */}
        <button
          onClick={() => onTabChange('alerts')}
          className={`flex flex-col items-center justify-center flex-1 h-full min-h-[44px] transition-colors relative ${
            activeTab === 'alerts' ? 'text-[#041453] font-bold' : 'text-[#454650] hover:text-[#041453]'
          }`}
          aria-label="Service Alerts"
        >
          <div className="relative">
            <span
              className={`material-symbols-outlined text-[24px] ${
                activeTab === 'alerts' ? 'material-symbols-filled' : ''
              }`}
            >
              notifications_active
            </span>
            {alertsCount > 0 && (
              <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-[#E60028] ring-2 ring-white" />
            )}
          </div>
          <span className="text-[11px] tracking-wide mt-0.5 font-medium">Alerts</span>
          {activeTab === 'alerts' && (
            <span className="absolute top-1 w-1.5 h-1.5 rounded-full bg-[#E60028]" />
          )}
        </button>
      </div>
    </nav>
  );
};
