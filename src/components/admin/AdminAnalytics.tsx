import React from 'react';
import { MousePointerClick, TrendingUp, ShoppingBag, Globe, Shield } from 'lucide-react';
import { db } from '../../lib/db';

export const AdminAnalytics: React.FC = () => {
  const clicks = db.getClicks();
  const merchants = db.getMerchants();
  const coupons = db.getCoupons();
  const deals = db.getDeals();

  // Aggregate by merchant
  const merchantClickMap: Record<string, number> = {};
  clicks.forEach((c) => {
    merchantClickMap[c.merchantName] = (merchantClickMap[c.merchantName] || 0) + 1;
  });

  const sortedMerchants = Object.entries(merchantClickMap).sort((a, b) => b[1] - a[1]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Click Stream &amp; Engagement Analytics
        </h1>
        <p className="text-xs text-slate-500">
          Audited telemetry on coupon reveal clicks, deal transfers, and destination conversion indicators.
        </p>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Outbound Transitions
          </div>
          <div className="text-2xl font-black text-slate-900">{clicks.length}</div>
          <div className="text-[11px] text-slate-500">Recorded with approved attribution</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Coupon Reveal Actions
          </div>
          <div className="text-2xl font-black text-teal-700">
            {clicks.filter((c) => c.type === 'coupon').length}
          </div>
          <div className="text-[11px] text-slate-500">Code copied &amp; merchant opened</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Deal Direct Navigation
          </div>
          <div className="text-2xl font-black text-amber-700">
            {clicks.filter((c) => c.type === 'deal').length}
          </div>
          <div className="text-[11px] text-slate-500">Instant price drop redirects</div>
        </div>
      </div>

      {/* Top Merchants by Click Volume */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-teal-600" />
            <span>Store Outbound Referral Volume</span>
          </h3>

          <div className="space-y-3">
            {sortedMerchants.map(([name, count]) => {
              const max = sortedMerchants[0]?.[1] || 1;
              const pct = Math.round((count / max) * 100);
              return (
                <div key={name} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold">
                    <span className="text-slate-800">{name}</span>
                    <span className="text-slate-900 font-mono">{count} clicks</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="bg-teal-600 h-full rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-600" />
            <span>Privacy Compliance Notice</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            In compliance with our Privacy Policy and international consumer privacy frameworks (GDPR, CCPA), click tracking does not harvest personally identifiable information (PII). Only timestamp, target offer identifier, destination domain, and generic device platform headers are recorded.
          </p>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Fingerprinting:</span>
              <span className="text-emerald-700 font-bold">Disabled</span>
            </div>
            <div className="flex justify-between">
              <span>IP Address Anonymization:</span>
              <span className="text-emerald-700 font-bold">Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Raw Event Stream Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 font-bold text-xs text-slate-900">
          Raw Outbound Click Event Stream (Latest Events)
        </div>
        <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-2.5 px-4">Time</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Target Title</th>
              <th className="py-2.5 px-4">Merchant</th>
              <th className="py-2.5 px-4">User Agent Platform</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
            {clicks.slice(0, 10).map((clk) => (
              <tr key={clk.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                  {new Date(clk.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-2.5 px-4 font-bold text-teal-800 uppercase">
                  {clk.type}
                </td>
                <td className="py-2.5 px-4 font-sans font-medium text-slate-800 truncate max-w-xs">
                  {clk.targetTitle}
                </td>
                <td className="py-2.5 px-4 font-sans font-semibold text-slate-700">
                  {clk.merchantName}
                </td>
                <td className="py-2.5 px-4 text-slate-400 truncate max-w-xs">
                  {clk.userAgent ? (clk.userAgent.includes('iPhone') ? 'iOS Mobile' : clk.userAgent.includes('Windows') ? 'Windows' : 'macOS / Linux') : 'Web Browser'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
