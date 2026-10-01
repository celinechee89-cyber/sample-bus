import React, { useState } from 'react';
import { BusStop, BusService } from '../types/transit';

interface MapScreenProps {
  stops: BusStop[];
  selectedStop: BusStop;
  selectedBus: BusService;
  onSelectStop: (stopCode: string) => void;
  onSelectBus: (serviceNo: string) => void;
  onSwitchToArrivals: () => void;
}

export const MapScreen: React.FC<MapScreenProps> = ({
  stops,
  selectedStop,
  selectedBus,
  onSelectStop,
  onSelectBus,
  onSwitchToArrivals,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [hoveredStop, setHoveredStop] = useState<BusStop | null>(null);

  // Simulated live buses on the map
  const activeBuses = [
    { id: 'b1', service: '65', x: 48, y: 52, heading: 'East', speed: 34, occ: '#0D8A43' },
    { id: 'b2', service: '14', x: 30, y: 64, heading: 'East', speed: 28, occ: '#0D8A43' },
    { id: 'b3', service: '124', x: 65, y: 38, heading: 'South', speed: 31, occ: '#D97706' },
    { id: 'b4', service: '174', x: 20, y: 75, heading: 'West', speed: 26, occ: '#0D8A43' },
  ];

  return (
    <div className="flex flex-col w-full h-[calc(100vh-144px)] relative bg-[#EBEFF5] overflow-hidden">
      {/* Map Control Header */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-col gap-2">
        <div className="bg-white/95 backdrop-blur-md rounded-xl p-2.5 shadow-md border border-[#D5DCE5] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#041453] text-[20px]">
              layers
            </span>
            <span className="text-xs font-bold text-[#041453]">Transit Map • Orchard</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setActiveFilter(activeFilter === '65' ? 'all' : '65')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === '65'
                  ? 'bg-[#E60028] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Route 65
            </button>
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-[#041453] text-white shadow-sm'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              All Stops
            </button>
          </div>
        </div>
      </div>

      {/* Interactive Transit Vector Map */}
      <div className="w-full h-full relative select-none flex items-center justify-center">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full object-cover"
          preserveAspectRatio="none"
        >
          {/* Background grid / road network */}
          <rect width="100" height="100" fill="#f0f3f8" />
          
          {/* Green parks */}
          <rect x="5" y="8" width="22" height="18" rx="3" fill="#dcfce7" opacity="0.6" />
          <rect x="70" y="65" width="25" height="25" rx="3" fill="#dcfce7" opacity="0.6" />
          <text x="7" y="16" fontSize="2.5" fill="#15803d" fontWeight="bold">Fort Canning</text>

          {/* Major Roads */}
          {/* Orchard Road Corridor */}
          <path
            d="M 10 75 Q 35 60 50 48 T 90 20"
            fill="none"
            stroke="#ffffff"
            strokeWidth="7"
            strokeLinecap="round"
          />
          <path
            d="M 10 75 Q 35 60 50 48 T 90 20"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="5"
            strokeLinecap="round"
          />
          {/* Somerset / Grange Road */}
          <path
            d="M 15 50 L 50 55 L 85 40"
            fill="none"
            stroke="#ffffff"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <path
            d="M 15 50 L 50 55 L 85 40"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Road Labels */}
          <text x="32" y="58" fontSize="2.4" fill="#64748b" fontWeight="600" transform="rotate(-15 32 58)">
            Orchard Road
          </text>
          <text x="45" y="53" fontSize="2.0" fill="#64748b" fontWeight="600">
            Somerset Rd
          </text>

          {/* Bus 65 Polyline Route */}
          <path
            d="M 10 75 Q 35 60 50 48 T 90 20"
            fill="none"
            stroke="#E60028"
            strokeWidth="2"
            strokeDasharray="2 1"
            opacity="0.85"
          />

          {/* Live User Location Pin */}
          <circle cx="50" cy="45" r="3.5" fill="#041453" opacity="0.15">
            <animate attributeName="r" values="2;5;2" dur="2s" repeatCount="indefinite" />
          </circle>
          <circle cx="50" cy="45" r="1.8" fill="#E60028" stroke="#ffffff" strokeWidth="0.8" />

          {/* Bus Stops */}
          {stops.map((stop) => {
            const isSelected = stop.code === selectedStop.code;
            return (
              <g
                key={stop.code}
                onClick={() => onSelectStop(stop.code)}
                onMouseEnter={() => setHoveredStop(stop)}
                onMouseLeave={() => setHoveredStop(null)}
                className="cursor-pointer"
              >
                <circle
                  cx={stop.coordinates.x}
                  cy={stop.coordinates.y}
                  r={isSelected ? '4' : '3'}
                  fill={isSelected ? '#041453' : '#ffffff'}
                  stroke="#041453"
                  strokeWidth="1.2"
                  filter="drop-shadow(0 1px 2px rgba(0,0,0,0.2))"
                />
                <circle
                  cx={stop.coordinates.x}
                  cy={stop.coordinates.y}
                  r={isSelected ? '2' : '1.2'}
                  fill={isSelected ? '#E60028' : '#041453'}
                />
                {/* Stop Code Tag */}
                <rect
                  x={stop.coordinates.x - 5}
                  y={stop.coordinates.y - 7}
                  width="10"
                  height="3.5"
                  rx="0.8"
                  fill="#041453"
                  opacity={isSelected ? 1 : 0.85}
                />
                <text
                  x={stop.coordinates.x}
                  y={stop.coordinates.y - 4.6}
                  fontSize="2.1"
                  fill="#ffffff"
                  fontWeight="bold"
                  textAnchor="middle"
                  fontFamily="Public Sans"
                >
                  {stop.code}
                </text>
              </g>
            );
          })}

          {/* Live Moving SBS Buses */}
          {activeBuses.map((bus) => (
            <g key={bus.id} className="cursor-pointer" onClick={() => onSelectBus(bus.service)}>
              <rect
                x={bus.x - 3.5}
                y={bus.y - 2.5}
                width="7"
                height="5"
                rx="1"
                fill="#E60028"
                stroke="#ffffff"
                strokeWidth="0.6"
                filter="drop-shadow(0 1px 3px rgba(0,0,0,0.3))"
              />
              <text
                x={bus.x}
                y={bus.y + 1}
                fontSize="2.4"
                fill="#ffffff"
                fontWeight="900"
                textAnchor="middle"
              >
                {bus.service}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Zoom / Recenter Controls */}
        <div className="absolute right-3 top-16 z-20 flex flex-col gap-1.5">
          <button
            onClick={() => onSelectStop('B09048')}
            className="w-9 h-9 rounded-xl bg-white shadow-md border border-[#D5DCE5] flex items-center justify-center text-[#041453] hover:bg-slate-50 active:scale-95 transition-all"
            title="Recenter on current bus stop"
          >
            <span className="material-symbols-outlined text-[18px]">my_location</span>
          </button>
        </div>
      </div>

      {/* Selected Stop Bottom Sheet Preview */}
      <div className="absolute bottom-3 left-3 right-3 z-30 bg-white rounded-xl shadow-xl border border-[#D5DCE5] p-3 flex flex-col gap-2 animate-in slide-in-from-bottom-2 duration-200">
        <div className="flex items-start justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-[#041453]">
                {selectedStop.code}
              </span>
              <span className="text-[11px] text-slate-500">{selectedStop.road}</span>
            </div>
            <span className="text-[15px] font-bold text-slate-900 mt-0.5">
              {selectedStop.name}
            </span>
          </div>
          <button
            onClick={onSwitchToArrivals}
            className="px-3 py-1.5 bg-[#041453] text-white rounded-lg text-xs font-bold flex items-center gap-1 hover:bg-[#1e2b68] active:scale-95 transition-all"
          >
            <span>View Board</span>
            <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </button>
        </div>

        {/* Quick arrivals carousel */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-1">
          {selectedStop.services.map((svc) => (
            <div
              key={svc.serviceNo}
              onClick={() => {
                onSelectBus(svc.serviceNo);
                onSwitchToArrivals();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200 hover:border-[#041453] cursor-pointer flex items-center gap-2 shrink-0 transition-all"
            >
              <span className="w-6 h-6 rounded bg-[#E60028] text-white text-[11px] font-bold flex items-center justify-center">
                {svc.serviceNo}
              </span>
              <div className="flex items-baseline gap-0.5">
                <span className="text-xs font-bold text-[#0D8A43]">{svc.nextBus.min}</span>
                {svc.nextBus.min !== 'Arr' && (
                  <span className="text-[10px] text-slate-500">m</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
