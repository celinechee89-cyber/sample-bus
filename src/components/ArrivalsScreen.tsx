import React, { useState, useEffect, useRef } from 'react';
import { BusStop, BusService, OccupancyLevel } from '../types/transit';

interface ArrivalsScreenProps {
  currentStop: BusStop;
  selectedBus: BusService;
  onSelectBus: (serviceNo: string) => void;
  onSelectStop: (stopCode: string) => void;
  onOpenWalkingGuide: () => void;
  onOpenRouteModal: (bus: BusService) => void;
  isBookmarked: boolean;
  onToggleBookmark: (serviceNo: string) => void;
  onNearMeClick: () => void;
  refreshSecondsTotal: number;
}

export const ArrivalsScreen: React.FC<ArrivalsScreenProps> = ({
  currentStop,
  selectedBus,
  onSelectBus,
  onSelectStop,
  onOpenWalkingGuide,
  onOpenRouteModal,
  isBookmarked,
  onToggleBookmark,
  onNearMeClick,
  refreshSecondsTotal,
}) => {
  const [searchQuery, setSearchQuery] = useState('Bus 65');
  const [secondsLeft, setSecondsLeft] = useState(refreshSecondsTotal);
  const [isSyncing, setIsSyncing] = useState(false);
  const [gpsSecondsAgo, setGpsSecondsAgo] = useState(4);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync / countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          handleSync();
          return refreshSecondsTotal;
        }
        return prev - 1;
      });
      setGpsSecondsAgo((prev) => (prev >= 30 ? 2 : prev + 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [refreshSecondsTotal]);

  const handleSync = () => {
    setIsSyncing(true);
    setGpsSecondsAgo(1);
    setSecondsLeft(refreshSecondsTotal);
    setTimeout(() => {
      setIsSyncing(false);
      showToast('Live bus timings synced with LTA DataMall');
    }, 700);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchQuery.trim().replace(/^bus\s+/i, '');
    if (!clean) return;

    // Check if it matches a service
    const foundService = currentStop.services.find(
      (s) => s.serviceNo.toLowerCase() === clean.toLowerCase()
    );
    if (foundService) {
      onSelectBus(foundService.serviceNo);
      showToast(`Selected Bus ${foundService.serviceNo}`);
      return;
    }

    // Try finding by number in general
    onSelectBus(clean);
    showToast(`Searching arrivals for Bus ${clean}...`);
  };

  // Occupancy helper
  const getOccupancyConfig = (occ: OccupancyLevel) => {
    switch (occ) {
      case 'seats':
        return {
          label: 'Seats',
          colorClass: 'text-[#0D8A43]',
          bgClass: 'bg-[#0D8A43]/15',
          dotClass: 'bg-[#0D8A43]',
        };
      case 'standing':
        return {
          label: 'Standing',
          colorClass: 'text-[#D97706]',
          bgClass: 'bg-[#D97706]/15',
          dotClass: 'bg-[#D97706]',
        };
      case 'limited':
      default:
        return {
          label: 'Limited',
          colorClass: 'text-[#D92D20]',
          bgClass: 'bg-[#D92D20]/15',
          dotClass: 'bg-[#D92D20]',
        };
    }
  };

  // Frequent quick picks
  const FREQUENT_CHIPS = ['65', '14', '7', '147', '190', '166'];

  // Other services (excluding the currently active bus)
  const otherServices = currentStop.services.filter(
    (s) => s.serviceNo !== selectedBus.serviceNo
  );

  return (
    <div className="flex flex-col w-full pb-6 relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-22 left-1/2 -translate-x-1/2 z-50 bg-[#041453] text-white px-4 py-2 rounded-full text-xs font-semibold shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <span className="material-symbols-outlined text-[16px] text-[#0D8A43]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="px-4 pt-3 pb-5 flex flex-col gap-3.5">
        {/* Search Bar + Near Me Button */}
        <div className="flex flex-col gap-2">
          <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 w-full">
            <div className="relative flex-1 flex items-center bg-white rounded-xl shadow-sm border border-[#D5DCE5]/60 focus-within:border-[#041453] transition-colors">
              <span className="material-symbols-outlined absolute left-3 text-[#041453] text-[20px]">
                search
              </span>
              <input
                ref={searchInputRef}
                aria-label="Enter Bus Service Number"
                className="w-full pl-10 pr-9 py-3 bg-transparent text-[14px] text-[#191c1e] placeholder:text-[#454650]/60 focus:outline-none rounded-xl font-medium"
                id="busSearchInput"
                placeholder="Enter Bus Service No. (e.g. 65, 14, 147)"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  aria-label="Clear input"
                  className="absolute right-2.5 w-6 h-6 rounded-full bg-[#EBEFF5] flex items-center justify-center text-[#454650] hover:text-[#191c1e] transition-colors"
                  id="clearSearchBtn"
                  type="button"
                  onClick={handleClearSearch}
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              )}
            </div>
            <button
              onClick={() => {
                onNearMeClick();
                showToast('Found nearest stop: Opp Mandarin Gallery (85m)');
              }}
              aria-label="Locate Nearest Bus Stop"
              className="h-11 px-3.5 bg-[#041453] text-white rounded-xl font-semibold text-[13px] flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform shrink-0 hover:bg-[#1e2b68]"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-[#E60028] animate-pulse">
                near_me
              </span>
              <span className="font-semibold">Near Me</span>
            </button>
          </form>

          {/* Quick Route Picks */}
          <div
            aria-label="Quick Route Picks"
            className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5"
            role="region"
          >
            <span className="text-[11px] font-bold text-[#454650] uppercase tracking-wider shrink-0 mr-1">
              Frequent:
            </span>
            {FREQUENT_CHIPS.map((chip) => {
              const isActive = selectedBus.serviceNo === chip;
              return (
                <button
                  key={chip}
                  onClick={() => {
                    onSelectBus(chip);
                    setSearchQuery(`Bus ${chip}`);
                  }}
                  className={`px-3 py-1 rounded-full text-[13px] font-bold transition-all shadow-sm ${
                    isActive
                      ? 'bg-[#041453] text-white ring-1 ring-[#041453]'
                      : 'bg-white text-[#041453] hover:bg-[#EBEFF5] border border-[#D5DCE5]/40'
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* Nearest Bus Stop Card */}
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#D5DCE5]/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#E60028] text-[18px]">
                location_on
              </span>
              <span className="font-semibold text-[14px] text-[#041453]">
                Nearest Bus Stop
              </span>
              <span className="text-[12px] text-[#475569]">
                ({currentStop.distanceMeters}m away)
              </span>
            </div>
            <span className="px-2 py-0.5 bg-[#eceef1] text-[#041453] text-[12px] font-bold font-mono rounded">
              {currentStop.code}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2">
            <div className="flex flex-col">
              <span className="text-[18px] text-[#191c1e] font-extrabold leading-tight">
                {currentStop.name}
              </span>
              <span className="text-[12px] text-[#454650] mt-0.5">
                {currentStop.road} • {currentStop.directionDesc}
              </span>
            </div>
            <button
              onClick={onOpenWalkingGuide}
              className="px-3 py-1.5 bg-[#EBEFF5] hover:bg-slate-200 text-[#041453] rounded-lg text-[12px] font-bold flex items-center gap-1 shrink-0 active:scale-95 transition-transform"
              title="View Walking Route"
            >
              <span className="material-symbols-outlined text-[16px]">directions_walk</span>
              <span>{currentStop.walkMinutes} min</span>
            </button>
          </div>

          <div className="pt-1 flex items-center justify-between text-[#454650] text-[12px] border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D8A43] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D8A43]"></span>
              </span>
              <span className="text-[#0D8A43] font-semibold">Live Feed</span>
              <span>•</span>
              <span id="countdownTimer" className="tabular-nums">
                {isSyncing ? 'Updating live...' : `Refreshes in ${secondsLeft}s`}
              </span>
            </div>
            <button
              className="flex items-center gap-0.5 text-[#041453] font-semibold hover:underline text-[12px] active:scale-95 transition-transform"
              onClick={handleSync}
            >
              <span
                className={`material-symbols-outlined text-[14px] ${
                  isSyncing ? 'animate-spin' : ''
                }`}
              >
                refresh
              </span>{' '}
              Sync
            </button>
          </div>
        </div>

        {/* Primary Selected Bus Card (Bus 65) */}
        <div className="bg-white rounded-xl shadow-md p-3.5 border border-[#D5DCE5]/80 flex flex-col gap-3 relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#E60028] to-[#de2264] flex items-center justify-center shadow-md shrink-0">
                <span className="text-[26px] font-extrabold text-white leading-none tracking-tight">
                  {selectedBus.serviceNo}
                </span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[15px] text-[#041453]">
                    {selectedBus.operator}
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#041453]/10 text-[#041453] text-[10px] font-bold rounded">
                    {selectedBus.category}
                  </span>
                </div>
                <span className="text-[14px] font-bold text-[#191c1e]">
                  To {selectedBus.destination}
                </span>
                <span className="text-[12px] text-[#475569]">{selectedBus.via}</span>
              </div>
            </div>
            <button
              onClick={() => {
                onToggleBookmark(selectedBus.serviceNo);
                showToast(
                  isBookmarked
                    ? `Removed Bus ${selectedBus.serviceNo} from Favorites`
                    : `Added Bus ${selectedBus.serviceNo} to Favorites`
                );
              }}
              aria-label={`Bookmark bus ${selectedBus.serviceNo}`}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-transform active:scale-90 ${
                isBookmarked
                  ? 'bg-[#de2264]/15 text-[#de2264]'
                  : 'bg-[#EBEFF5] text-slate-400 hover:text-slate-600'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[20px] ${
                  isBookmarked ? 'material-symbols-filled' : ''
                }`}
              >
                bookmark
              </span>
            </button>
          </div>

          {/* 3 Arrival Countdown Columns */}
          <div className="grid grid-cols-3 gap-2">
            {/* Next Bus */}
            {(() => {
              const occ = getOccupancyConfig(selectedBus.nextBus.occupancy);
              return (
                <div className="bg-[#f2f4f7] rounded-lg p-2.5 flex flex-col items-center text-center">
                  <span className="text-[11px] font-bold text-[#454650] uppercase tracking-wider">
                    Next Bus
                  </span>
                  <div className="my-1 flex items-baseline gap-0.5">
                    <span
                      className={`text-[24px] font-extrabold ${occ.colorClass} ${
                        selectedBus.nextBus.min === 'Arr' ? 'animate-pulse' : ''
                      }`}
                    >
                      {selectedBus.nextBus.min}
                    </span>
                    {selectedBus.nextBus.min !== 'Arr' && (
                      <span className="text-[12px] text-[#191c1e] font-semibold">min</span>
                    )}
                  </div>
                  <span
                    className={`px-2 py-0.5 ${occ.bgClass} ${occ.colorClass} text-[11px] rounded-full font-bold`}
                  >
                    {occ.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2 text-[#454650]">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      title={
                        selectedBus.nextBus.deck === 'DD'
                          ? 'Double Decker'
                          : selectedBus.nextBus.deck === 'BD'
                          ? 'Bendy Bus'
                          : 'Single Deck'
                      }
                    >
                      {selectedBus.nextBus.deck === 'DD'
                        ? 'directions_bus'
                        : selectedBus.nextBus.deck === 'BD'
                        ? 'airport_shuttle'
                        : 'airport_shuttle'}
                    </span>
                    <span className="text-[11px] font-bold">{selectedBus.nextBus.deck}</span>
                    {selectedBus.nextBus.accessible && (
                      <span
                        className="material-symbols-outlined text-[15px]"
                        title="Wheelchair Accessible"
                      >
                        accessible
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* 2nd Bus */}
            {(() => {
              const occ = getOccupancyConfig(selectedBus.secondBus.occupancy);
              return (
                <div className="bg-[#f2f4f7] rounded-lg p-2.5 flex flex-col items-center text-center">
                  <span className="text-[11px] font-bold text-[#454650] uppercase tracking-wider">
                    2nd Bus
                  </span>
                  <div className="my-1 flex items-baseline gap-0.5">
                    <span className={`text-[24px] font-extrabold ${occ.colorClass}`}>
                      {selectedBus.secondBus.min}
                    </span>
                    <span className="text-[12px] text-[#191c1e] font-semibold">min</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 ${occ.bgClass} ${occ.colorClass} text-[11px] rounded-full font-bold`}
                  >
                    {occ.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2 text-[#454650]">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      title={
                        selectedBus.secondBus.deck === 'DD' ? 'Double Decker' : 'Single Deck'
                      }
                    >
                      {selectedBus.secondBus.deck === 'DD'
                        ? 'directions_bus'
                        : 'airport_shuttle'}
                    </span>
                    <span className="text-[11px] font-bold">{selectedBus.secondBus.deck}</span>
                    {selectedBus.secondBus.accessible && (
                      <span
                        className="material-symbols-outlined text-[15px]"
                        title="Wheelchair Accessible"
                      >
                        accessible
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* 3rd Bus */}
            {(() => {
              const occ = getOccupancyConfig(selectedBus.thirdBus.occupancy);
              return (
                <div className="bg-[#f2f4f7] rounded-lg p-2.5 flex flex-col items-center text-center">
                  <span className="text-[11px] font-bold text-[#454650] uppercase tracking-wider">
                    3rd Bus
                  </span>
                  <div className="my-1 flex items-baseline gap-0.5">
                    <span className="text-[24px] font-extrabold text-[#191c1e]">
                      {selectedBus.thirdBus.min}
                    </span>
                    <span className="text-[12px] text-[#191c1e] font-semibold">min</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 ${occ.bgClass} ${occ.colorClass} text-[11px] rounded-full font-bold`}
                  >
                    {occ.label}
                  </span>
                  <div className="flex items-center gap-1.5 mt-2 text-[#454650]">
                    <span
                      className="material-symbols-outlined text-[16px]"
                      title={
                        selectedBus.thirdBus.deck === 'DD' ? 'Double Decker' : 'Single Deck'
                      }
                    >
                      {selectedBus.thirdBus.deck === 'DD'
                        ? 'directions_bus'
                        : 'airport_shuttle'}
                    </span>
                    <span className="text-[11px] font-bold">{selectedBus.thirdBus.deck}</span>
                    {selectedBus.thirdBus.accessible && (
                      <span
                        className="material-symbols-outlined text-[15px]"
                        title="Wheelchair Accessible"
                      >
                        accessible
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Live Bus Tracker Box */}
          <div
            onClick={() => onOpenRouteModal(selectedBus)}
            className="bg-[#EBEFF5] hover:bg-[#e4e9f2] cursor-pointer rounded-lg p-3 flex flex-col gap-2 transition-colors group"
            title="Click to view full route stops"
          >
            <div className="flex items-center justify-between text-[#454650]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[#041453] text-[16px]">
                  navigation
                </span>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#041453]">
                  Live Bus Tracker
                </span>
                <span className="text-[10px] text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">
                  (Tap for route)
                </span>
              </div>
              <span className="text-[11px] text-[#475569] font-mono">
                GPS Synced {gpsSecondsAgo}s ago
              </span>
            </div>

            <div className="relative w-full pt-4 pb-2">
              <div className="h-1.5 w-full bg-[#e0e3e6] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#0D8A43] via-[#E60028] to-[#041453] rounded-full transition-all duration-700"
                  style={{ width: `${selectedBus.tracker.progressPercent}%` }}
                />
              </div>

              <div className="flex items-center justify-between mt-2.5 text-left">
                <div className="flex flex-col max-w-[40%]">
                  <span className="text-[12px] font-bold text-[#475569] leading-tight truncate">
                    {selectedBus.tracker.previousStopCode} {selectedBus.tracker.previousStop}
                  </span>
                  <span className="text-[11px] text-[#0D8A43] font-semibold">Departed Stop</span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-[#E60028] text-white flex items-center justify-center shadow-md animate-bounce -mt-7">
                    <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                  </div>
                  <span className="text-[11px] font-bold text-[#E60028] mt-1 whitespace-nowrap">
                    Bus {selectedBus.serviceNo} (~{selectedBus.tracker.distanceMeters}m)
                  </span>
                </div>

                <div className="flex flex-col items-end max-w-[40%] text-right">
                  <span className="text-[12px] font-bold text-[#041453] leading-tight truncate">
                    {currentStop.code} Opp Mandarin
                  </span>
                  <span className="text-[10px] bg-[#041453] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                    YOUR STOP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Services Here */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-1">
            <span className="font-bold text-[15px] text-[#041453]">Other Services Here</span>
            <span className="text-[12px] text-[#475569]">
              {otherServices.length} more services
            </span>
          </div>

          <div className="flex flex-col gap-2">
            {otherServices.map((service) => {
              const occ = getOccupancyConfig(service.nextBus.occupancy);
              return (
                <div
                  key={service.serviceNo}
                  onClick={() => {
                    onSelectBus(service.serviceNo);
                    setSearchQuery(`Bus ${service.serviceNo}`);
                    showToast(`Switched tracking to Bus ${service.serviceNo}`);
                  }}
                  className="bg-white rounded-xl p-3 shadow-sm border border-[#D5DCE5]/60 hover:border-[#041453] cursor-pointer flex items-center justify-between transition-all hover:shadow active:scale-99"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-lg bg-[#EBEFF5] text-[#041453] text-[15px] flex items-center justify-center font-extrabold shrink-0">
                      {service.serviceNo}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[14px] text-[#191c1e]">
                        {service.destination}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5 text-[12px]">
                        <span className={`w-2 h-2 rounded-full ${occ.dotClass}`} />
                        <span className="text-[#454650] font-medium">{occ.label}</span>
                        <span className="text-[#454650]">•</span>
                        <span className="text-[11px] font-bold text-[#475569]">
                          {service.nextBus.deck}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <div className="flex items-baseline gap-1">
                      <span className={`text-[20px] font-extrabold ${occ.colorClass}`}>
                        {service.nextBus.min}
                      </span>
                      {service.nextBus.min !== 'Arr' && (
                        <span className="text-[12px] text-[#191c1e] font-semibold">min</span>
                      )}
                    </div>
                    <span className="text-[11px] text-[#475569]">
                      Next: {service.secondBus.min} min
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Nearby Alternative Stops */}
        <div className="bg-white rounded-xl p-3.5 shadow-sm border border-[#D5DCE5]/60 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#041453] text-[18px]">
                alt_route
              </span>
              <span className="font-bold text-[14px] text-[#041453]">
                Nearby Alternative Stops
              </span>
            </div>
            <span className="text-[12px] text-[#475569]">&lt; 300m</span>
          </div>

          <div className="flex flex-col gap-2 pt-0.5">
            {/* Somerset Station */}
            <div
              onClick={() => onSelectStop('08121')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f4f7] hover:bg-[#EBEFF5] cursor-pointer transition-colors"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#191c1e]">
                    Somerset Station
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#eceef1] text-[#475569] text-[11px] font-mono rounded font-semibold">
                    08121
                  </span>
                </div>
                <span className="text-[11px] text-[#475569]">
                  180m away • Bus 65 arriving in 3 mins
                </span>
              </div>
              <button
                aria-label="View Somerset Station stop"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#041453] shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>

            {/* Midpoint Orchard */}
            <div
              onClick={() => onSelectStop('09038')}
              className="flex items-center justify-between p-2.5 rounded-lg bg-[#f2f4f7] hover:bg-[#EBEFF5] cursor-pointer transition-colors"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-[13px] font-bold text-[#191c1e]">
                    Midpoint Orchard
                  </span>
                  <span className="px-1.5 py-0.2 bg-[#eceef1] text-[#475569] text-[11px] font-mono rounded font-semibold">
                    09038
                  </span>
                </div>
                <span className="text-[11px] text-[#475569]">
                  240m away • Opp direction to HarbourFront
                </span>
              </div>
              <button
                aria-label="View Midpoint Orchard stop"
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#041453] shadow-sm hover:scale-105 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Occupancy Legend */}
        <div className="flex items-center justify-center gap-5 py-2 text-[#454650] text-[11px] font-bold">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D8A43]"></span>
            <span>Seats</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></span>
            <span>Standing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#D92D20]"></span>
            <span>Limited</span>
          </div>
        </div>
      </div>
    </div>
  );
};
