import React, { useState } from 'react';
import { SERVICE_ALERTS } from '../data/transitData';
import { ServiceAlert } from '../types/transit';

export const AlertsScreen: React.FC = () => {
  const [alerts, setAlerts] = useState<ServiceAlert[]>(SERVICE_ALERTS);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'all') return true;
    return alert.severity === filterSeverity;
  });

  return (
    <div className="flex flex-col w-full p-4 gap-4 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[20px] font-bold text-[#041453]">Operations & Advisories</h2>
          <p className="text-xs text-slate-500">Live SBS Transit network status</p>
        </div>
        <span className="px-2.5 py-1 bg-[#0D8A43]/10 text-[#0D8A43] text-xs font-bold rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#0D8A43] inline-block animate-pulse" />
          Network Normal
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { key: 'all', label: 'All Alerts' },
          { key: 'normal', label: 'System Status' },
          { key: 'info', label: 'Traffic & Extra Fleets' },
          { key: 'warning', label: 'Night Services' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterSeverity(tab.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all shrink-0 ${
              filterSeverity === tab.key
                ? 'bg-[#041453] text-white shadow-sm'
                : 'bg-white text-slate-600 border border-[#D5DCE5] hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alert Cards */}
      <div className="flex flex-col gap-3">
        {filteredAlerts.map((alert) => {
          const isNormal = alert.severity === 'normal';
          const isWarning = alert.severity === 'warning';
          const isDelay = alert.severity === 'delay';

          return (
            <div
              key={alert.id}
              className={`rounded-xl p-3.5 border shadow-sm flex flex-col gap-2 transition-all ${
                isNormal
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : isWarning
                  ? 'bg-amber-50/70 border-amber-200'
                  : isDelay
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-white border-[#D5DCE5]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span
                    className={`material-symbols-outlined text-[20px] ${
                      isNormal
                        ? 'text-[#0D8A43]'
                        : isWarning
                        ? 'text-[#D97706]'
                        : isDelay
                        ? 'text-[#E60028]'
                        : 'text-[#041453]'
                    }`}
                  >
                    {isNormal
                      ? 'verified'
                      : isWarning
                      ? 'warning'
                      : isDelay
                      ? 'report'
                      : 'info'}
                  </span>
                  <span className="font-bold text-[14px] text-slate-900 leading-tight">
                    {alert.title}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap shrink-0">
                  {alert.timestamp}
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed pl-7">
                {alert.description}
              </p>

              <div className="flex items-center gap-1.5 pl-7 pt-1 flex-wrap">
                <span className="text-[10px] font-bold text-slate-400 uppercase">
                  Affected:
                </span>
                {alert.affectedRoutes.map((rt) => (
                  <span
                    key={rt}
                    className="px-2 py-0.5 rounded bg-white border border-slate-200 text-[#041453] text-[11px] font-bold shadow-2xs"
                  >
                    {rt === 'All Services' ? rt : `Bus ${rt}`}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* SBS Transit Hotline Card */}
      <div className="bg-slate-100 rounded-xl p-3 text-xs text-slate-600 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#041453]">support_agent</span>
          <div>
            <span className="font-bold text-slate-800 block">SBS Transit Customer Service</span>
            <span className="text-[11px] text-slate-500">1800-287-2727 (Toll-Free, 7:30am - 8:00pm)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
