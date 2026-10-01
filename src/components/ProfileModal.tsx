import React, { useState } from 'react';
import { COMMUTER_PROFILE } from '../data/transitData';

interface ProfileModalProps {
  onClose: () => void;
  refreshInterval: number;
  onRefreshIntervalChange: (sec: number) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  onClose,
  refreshInterval,
  onRefreshIntervalChange,
}) => {
  const [balance, setBalance] = useState(26.4);
  const [wheelchairOnly, setWheelchairOnly] = useState(false);
  const [vibrateOnArrival, setVibrateOnArrival] = useState(true);
  const [topUpSuccess, setTopUpSuccess] = useState(false);

  const handleQuickTopUp = (amount: number) => {
    setBalance((prev) => parseFloat((prev + amount).toFixed(2)));
    setTopUpSuccess(true);
    setTimeout(() => setTopUpSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-[#D5DCE5]">
        {/* Header */}
        <div className="p-4 bg-[#041453] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold text-white">
              <span className="material-symbols-outlined text-[20px]">person</span>
            </div>
            <div>
              <h3 className="font-bold text-[16px] leading-tight">{COMMUTER_PROFILE.name}</h3>
              <p className="text-[11px] text-slate-300">SBS Transit Commuter Account</p>
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
        <div className="p-4 overflow-y-auto space-y-4">
          {/* SimplyGo Card Replica */}
          <div className="rounded-xl p-4 bg-gradient-to-tr from-[#041453] via-[#152383] to-[#de2264] text-white shadow-md relative overflow-hidden">
            <div className="absolute right-3 top-3 opacity-20 text-[60px] leading-none select-none font-black">
              EZ
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-[12px] font-bold tracking-wider uppercase text-slate-200">
                {COMMUTER_PROFILE.cardType}
              </span>
              <span className="material-symbols-outlined text-[20px]">contactless</span>
            </div>

            <div className="mb-2">
              <span className="text-[11px] text-slate-300 block">Available Transit Balance</span>
              <span className="text-3xl font-extrabold tracking-tight">
                ${balance.toFixed(2)}
              </span>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-300 border-t border-white/20 pt-2 mt-2">
              <span className="font-mono">•••• {COMMUTER_PROFILE.cardNumber.slice(-4)}</span>
              <span className="text-[#0D8A43] bg-white/90 px-1.5 py-0.5 rounded font-bold text-[10px]">
                Auto Top-up Active
              </span>
            </div>
          </div>

          {/* Quick Top up buttons */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-600 font-semibold">
              <span>Quick Card Top-Up (SimplyGo)</span>
              {topUpSuccess && <span className="text-[#0D8A43]">+$10 added!</span>}
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[10, 20, 50].map((amt) => (
                <button
                  key={amt}
                  onClick={() => handleQuickTopUp(amt)}
                  className="py-2 bg-slate-100 hover:bg-slate-200 active:scale-95 text-[#041453] font-bold text-xs rounded-lg transition-all"
                >
                  +${amt}
                </button>
              ))}
            </div>
          </div>

          <hr className="border-slate-200" />

          {/* Preferences */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Live Arrival Preferences
            </span>

            {/* Refresh Rate */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Auto-Sync Rate</span>
                <span className="text-[11px] text-slate-500">Live GPS telemetry frequency</span>
              </div>
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                {[15, 20, 30].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onRefreshIntervalChange(sec)}
                    className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                      refreshInterval === sec
                        ? 'bg-[#041453] text-white shadow-sm'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>

            {/* Wheelchair Accessible Filter */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">
                  Wheelchair Accessible Only
                </span>
                <span className="text-[11px] text-slate-500">Highlight WAB ramps</span>
              </div>
              <button
                onClick={() => setWheelchairOnly(!wheelchairOnly)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  wheelchairOnly ? 'bg-[#0D8A43]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    wheelchairOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Vibration */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-800 block">Arrival Chime / Alert</span>
                <span className="text-[11px] text-slate-500">Notify when bus is 2 minutes away</span>
              </div>
              <button
                onClick={() => setVibrateOnArrival(!vibrateOnArrival)}
                className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                  vibrateOnArrival ? 'bg-[#041453]' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                    vibrateOnArrival ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-[#D5DCE5] flex justify-end">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-[#041453] text-white text-xs font-bold rounded-xl active:scale-98 transition-transform"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
