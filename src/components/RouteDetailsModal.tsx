import React from 'react';
import { BusService } from '../types/transit';
import { ROUTE_65_STOPS } from '../data/transitData';

interface RouteDetailsModalProps {
  bus: BusService;
  onClose: () => void;
  onSelectStop?: (stopCode: string) => void;
}

export const RouteDetailsModal: React.FC<RouteDetailsModalProps> = ({
  bus,
  onClose,
  onSelectStop,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[88vh] flex flex-col shadow-2xl overflow-hidden border border-[#D5DCE5]">
        {/* Modal Header */}
        <div className="p-4 bg-[#041453] text-white flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-[#E60028] flex items-center justify-center font-extrabold text-[22px] shadow-md">
              {bus.serviceNo}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[16px] text-white">Route Journey</span>
                <span className="text-[10px] uppercase font-bold bg-white/20 px-2 py-0.5 rounded">
                  {bus.category}
                </span>
              </div>
              <p className="text-xs text-slate-300">
                To <span className="text-white font-semibold">{bus.destination}</span> {bus.via}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Live Status Summary */}
        <div className="bg-[#f2f4f7] px-4 py-2.5 border-b border-[#D5DCE5] flex items-center justify-between text-xs text-[#454650]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0D8A43] animate-pulse" />
            <span className="font-semibold text-[#041453]">3 Buses Tracking Live</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">Updated just now</span>
        </div>

        {/* Stops Timeline */}
        <div className="flex-1 overflow-y-auto p-4 space-y-0 relative">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Stops along route ({ROUTE_65_STOPS.length} stops)
          </div>

          <div className="relative pl-6 space-y-4">
            {/* Timeline vertical bar */}
            <div className="absolute left-[9px] top-2 bottom-3 w-0.5 bg-gradient-to-b from-[#0D8A43] via-[#E60028] to-[#041453]" />

            {ROUTE_65_STOPS.map((stop, idx) => {
              const isTarget = stop.stopCode === 'B09048';
              return (
                <div
                  key={stop.stopCode}
                  onClick={() => onSelectStop && onSelectStop(stop.stopCode)}
                  className={`relative flex items-start justify-between cursor-pointer rounded-lg p-2 transition-all ${
                    isTarget
                      ? 'bg-[#041453]/5 ring-1 ring-[#041453] shadow-sm'
                      : 'hover:bg-slate-50'
                  }`}
                >
                  {/* Stop node circle */}
                  <div
                    className={`absolute -left-6 mt-1 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-colors ${
                      isTarget
                        ? 'bg-[#041453] border-white text-white shadow ring-2 ring-[#041453]/30'
                        : stop.isPassed
                        ? 'bg-[#0D8A43] border-white text-white'
                        : 'bg-white border-slate-300'
                    }`}
                  >
                    {isTarget ? (
                      <span className="material-symbols-outlined text-[12px]">location_on</span>
                    ) : stop.isPassed ? (
                      <span className="material-symbols-outlined text-[10px]">check</span>
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                    )}
                  </div>

                  {/* Stop Details */}
                  <div className="flex flex-col pr-2">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span
                        className={`text-[13px] font-bold ${
                          isTarget ? 'text-[#041453]' : 'text-slate-900'
                        }`}
                      >
                        {stop.stopName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                        {stop.stopCode}
                      </span>
                      {isTarget && (
                        <span className="text-[10px] bg-[#041453] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">
                          Your Stop
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {stop.roadName} • {stop.distanceFromStartKm.toFixed(1)} km
                    </span>
                  </div>

                  {/* Live bus marker at this stop if present */}
                  {stop.hasBusHere && (
                    <div className="shrink-0 flex flex-col items-end animate-in fade-in">
                      <div className="flex items-center gap-1 bg-[#E60028] text-white px-2 py-0.5 rounded text-[11px] font-bold shadow-sm">
                        <span className="material-symbols-outlined text-[13px]">directions_bus</span>
                        <span>Bus {bus.serviceNo}</span>
                      </div>
                      <span className="text-[9px] text-[#0D8A43] font-semibold mt-0.5">
                        {stop.hasBusHere.occupancy === 'seats' ? 'Seats Avail' : 'Standing'} •{' '}
                        {stop.hasBusHere.deck}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-[#D5DCE5] flex items-center justify-between">
          <div className="flex items-center gap-2 text-[11px] text-slate-500">
            <span className="w-2.5 h-2.5 rounded-full bg-[#0D8A43]" /> Seats
            <span className="w-2.5 h-2.5 rounded-full bg-[#D97706]" /> Standing
            <span className="w-2.5 h-2.5 rounded-full bg-[#D92D20]" /> Limited
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#041453] text-white text-xs font-semibold rounded-lg hover:bg-opacity-95"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
