import React from 'react';

interface LocationPickerModalProps {
  onClose: () => void;
  currentLocationName: string;
  onSelectLocation: (name: string, stopCode: string) => void;
  onUseCurrentGPS: () => void;
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  onClose,
  currentLocationName,
  onSelectLocation,
  onUseCurrentGPS,
}) => {
  const PRESET_LOCATIONS = [
    {
      name: 'Near Orchard Blvd',
      stopCode: 'B09048',
      desc: 'Orchard Rd • Opp Mandarin Gallery',
      landmark: 'Mandarin Gallery / 313 Somerset',
    },
    {
      name: 'Near Somerset MRT',
      stopCode: '08121',
      desc: 'Somerset Rd • Somerset Station',
      landmark: 'Somerset MRT Exit B',
    },
    {
      name: 'Near Midpoint Orchard',
      stopCode: '09038',
      desc: 'Orchard Rd • Midpoint Orchard',
      landmark: 'Centrepoint / Orchard Gateway',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#D5DCE5]">
        {/* Header */}
        <div className="p-4 bg-[#041453] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#E60028]">
              my_location
            </span>
            <div>
              <h3 className="font-bold text-[15px] leading-tight">Select Location / Stop</h3>
              <p className="text-[11px] text-slate-300">Choose simulated area or live GPS</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3 overflow-y-auto">
          {/* GPS Button */}
          <button
            onClick={() => {
              onUseCurrentGPS();
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-[#041453]/5 border border-[#041453]/20 hover:bg-[#041453]/10 active:scale-98 transition-all"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#041453] text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px]">near_me</span>
              </div>
              <div className="text-left">
                <span className="text-xs font-bold text-[#041453] block">
                  Use Current Device GPS
                </span>
                <span className="text-[11px] text-slate-500">
                  Detect closest bus stop automatically
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-[18px] text-[#041453]">
              chevron_right
            </span>
          </button>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2">
            Preset Transit Hubs
          </div>

          <div className="space-y-2">
            {PRESET_LOCATIONS.map((loc) => {
              const isSelected = currentLocationName === loc.name;
              return (
                <button
                  key={loc.name}
                  onClick={() => {
                    onSelectLocation(loc.name, loc.stopCode);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-[#041453] bg-[#041453]/5 ring-1 ring-[#041453]'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{loc.name}</span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded font-mono">
                        {loc.stopCode}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-500 mt-0.5">{loc.desc}</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">{loc.landmark}</span>
                  </div>
                  {isSelected && (
                    <span className="material-symbols-outlined text-[18px] text-[#041453]">
                      check_circle
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-[#D5DCE5] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2 bg-[#041453] text-white text-xs font-bold rounded-lg"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
