import React from 'react';

interface WalkingDirectionsModalProps {
  onClose: () => void;
  stopName: string;
  stopCode: string;
  distanceMeters: number;
}

export const WalkingDirectionsModal: React.FC<WalkingDirectionsModalProps> = ({
  onClose,
  stopName,
  stopCode,
  distanceMeters,
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden border border-[#D5DCE5]">
        {/* Header */}
        <div className="p-4 bg-[#041453] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#E60028]">
              directions_walk
            </span>
            <div>
              <h3 className="font-bold text-[15px] leading-tight">Walking Route Guide</h3>
              <p className="text-[11px] text-slate-300">
                {distanceMeters}m • ~1 minute walk to {stopCode}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Mini Route Guide */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="bg-[#EBEFF5] p-3 rounded-xl flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[11px] text-slate-500 font-medium">Destination</span>
              <span className="text-sm font-bold text-[#041453]">{stopName}</span>
              <span className="text-xs text-slate-600">Sheltered walkway along Orchard Rd</span>
            </div>
            <div className="text-right">
              <span className="text-lg font-extrabold text-[#0D8A43]">1 MIN</span>
              <span className="block text-[10px] text-slate-500">{distanceMeters}m away</span>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#041453] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                1
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-800">Exit Orchard Central / 313@Somerset</p>
                <p className="text-slate-500 mt-0.5">Head northwest along Orchard Road walkway (40m)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#041453] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                2
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-800">Pass the covered pedestrian crossing</p>
                <p className="text-slate-500 mt-0.5">Directly across from Mandarin Gallery (35m)</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-[#0D8A43] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                <span className="material-symbols-outlined text-[14px]">check</span>
              </div>
              <div className="text-xs">
                <p className="font-semibold text-slate-800">Arrive at Bus Stop {stopCode}</p>
                <p className="text-slate-500 mt-0.5">Bus shelter with interactive arrival screen</p>
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">umbrella</span>
            <span>100% Barrier-free sheltered connection from Somerset MRT Station.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-[#D5DCE5] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#041453] text-white text-xs font-bold rounded-xl active:scale-98 transition-transform"
          >
            Got it, take me to live bus
          </button>
        </div>
      </div>
    </div>
  );
};
