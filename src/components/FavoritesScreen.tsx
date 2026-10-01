import React from 'react';
import { BusStop, BusService } from '../types/transit';

interface FavoritesScreenProps {
  favoriteServiceNos: string[];
  stops: BusStop[];
  onSelectBus: (serviceNo: string) => void;
  onSelectStop: (stopCode: string) => void;
  onToggleBookmark: (serviceNo: string) => void;
  onSwitchToArrivals: () => void;
}

export const FavoritesScreen: React.FC<FavoritesScreenProps> = ({
  favoriteServiceNos,
  stops,
  onSelectBus,
  onSelectStop,
  onToggleBookmark,
  onSwitchToArrivals,
}) => {
  // Collect all services matching favoriteServiceNos
  const favoriteServices: { service: BusService; stop: BusStop }[] = [];
  stops.forEach((stop) => {
    stop.services.forEach((svc) => {
      if (
        favoriteServiceNos.includes(svc.serviceNo) &&
        !favoriteServices.some((item) => item.service.serviceNo === svc.serviceNo)
      ) {
        favoriteServices.push({ service: svc, stop });
      }
    });
  });

  return (
    <div className="flex flex-col w-full p-4 gap-4 pb-20">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#041453]">Saved Favorites</h2>
          <p className="text-xs text-slate-500">Quick-access departures for regular routes</p>
        </div>
        <span className="px-2.5 py-1 bg-[#de2264]/10 text-[#de2264] text-xs font-bold rounded-full">
          {favoriteServiceNos.length} Pinned
        </span>
      </div>

      {favoriteServices.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-300 flex flex-col items-center justify-center gap-3">
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
            <span className="material-symbols-outlined text-[28px]">bookmark_border</span>
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">No Pinned Buses Yet</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-[240px]">
              Tap the bookmark icon on any bus card in the Arrivals tab to add your daily commutes
              here.
            </p>
          </div>
          <button
            onClick={onSwitchToArrivals}
            className="px-4 py-2 bg-[#041453] text-white rounded-xl text-xs font-bold mt-2"
          >
            Explore Live Arrivals
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {favoriteServices.map(({ service, stop }) => (
            <div
              key={service.serviceNo}
              className="bg-white rounded-xl p-3.5 shadow-sm border border-[#D5DCE5] flex flex-col gap-2.5 transition-all hover:shadow"
            >
              <div className="flex items-start justify-between">
                <div
                  className="flex items-center gap-3 cursor-pointer"
                  onClick={() => {
                    onSelectBus(service.serviceNo);
                    onSelectStop(stop.code);
                    onSwitchToArrivals();
                  }}
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E60028] to-[#de2264] flex items-center justify-center shadow-sm text-white font-extrabold text-xl">
                    {service.serviceNo}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm text-[#041453]">{service.operator}</span>
                      <span className="text-[10px] bg-slate-100 px-1.5 py-0.2 rounded font-semibold text-slate-600">
                        {service.category}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-slate-900 block">
                      To {service.destination}
                    </span>
                    <span className="text-[11px] text-slate-500">{stop.name}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleBookmark(service.serviceNo)}
                  className="w-8 h-8 rounded-full bg-[#de2264]/10 text-[#de2264] flex items-center justify-center"
                  title="Remove from favorites"
                >
                  <span className="material-symbols-outlined text-[18px] material-symbols-filled">
                    bookmark
                  </span>
                </button>
              </div>

              {/* Timing Grid */}
              <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-100">
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    Next Bus
                  </span>
                  <span className="text-lg font-extrabold text-[#0D8A43]">
                    {service.nextBus.min}
                    {service.nextBus.min !== 'Arr' && <span className="text-xs font-normal">m</span>}
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    2nd Bus
                  </span>
                  <span className="text-lg font-extrabold text-[#D97706]">
                    {service.secondBus.min}
                    <span className="text-xs font-normal">m</span>
                  </span>
                </div>
                <div className="bg-slate-50 rounded-lg p-2 text-center">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">
                    3rd Bus
                  </span>
                  <span className="text-lg font-extrabold text-slate-800">
                    {service.thirdBus.min}
                    <span className="text-xs font-normal">m</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
