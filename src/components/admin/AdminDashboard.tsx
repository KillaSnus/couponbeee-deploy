import React from 'react';
import {
  ShoppingBag,
  Tag,
  Flame,
  ShieldCheck,
  MousePointerClick,
  AlertCircle,
  PlusCircle,
  Upload,
  ArrowRight,
} from 'lucide-react';
import { db } from '../../lib/db';

interface AdminDashboardProps {
  onNavigate: (path: string) => void;
  onOpenVerifyModal?: (couponId: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onNavigate }) => {
  const stats = db.getStats();
  const merchants = db.getMerchants();
  const coupons = db.getCoupons();
  const verificationLogs = db.getVerificationLogs().slice(0, 5);
  const reports = db.getReports().filter((r) => r.status === 'pending');

  const topCoupons = [...coupons].sort((a, b) => b.clickCount - a.clickCount).slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Editorial Overview Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time status of merchant directory, live coupon validations, and click events.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => onNavigate('/admin/import')}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Upload className="w-3.5 h-3.5 text-teal-600" />
            <span>Import CSV</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/verification')}
            className="px-3.5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Verify Coupons</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Merchants</span>
            <ShoppingBag className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalMerchants}</div>
          <div className="text-[11px] text-slate-500">Across 6 commercial sectors</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Coupons</span>
            <Tag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700">{stats.activeCoupons}</div>
          <div className="text-[11px] text-emerald-800 font-medium">
            {stats.recentlyVerifiedCount} verified in checkout
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Outbound Clicks</span>
            <MousePointerClick className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{stats.totalClicks}</div>
          <div className="text-[11px] text-slate-500">Tracked with direct attribution</div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pending Reports</span>
            <AlertCircle className="w-4 h-4 text-rose-500" />
          </div>
          <div className={`text-2xl font-black ${stats.pendingReports > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
            {stats.pendingReports}
          </div>
          <div className="text-[11px] text-slate-500">Awaiting test desk evaluation</div>
        </div>
      </div>

      {/* Reports Banner If Any Pending */}
      {reports.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-rose-900">
                {reports.length} user reports require checkout re-testing
              </h3>
              <p className="text-[11px] text-rose-700">
                Users flagged potential expired or non-working codes on {reports.map((r) => r.merchantName).join(', ')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/admin/reports')}
            className="px-3.5 py-1.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 shrink-0"
          >
            Review Reports
          </button>
        </div>
      )}

      {/* Two-Column Lower Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Verification Logs */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Recent Checkout Verification Logs</span>
            </h3>
            <button
              onClick={() => onNavigate('/admin/verification')}
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 space-y-2">
            {verificationLogs.map((log) => (
              <div key={log.id} className="pt-2 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{log.merchantName}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.result === 'successful'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {log.result.toUpperCase()}
                  </span>
                </div>
                <div className="text-slate-600 font-medium truncate">{log.couponTitle}</div>
                <p className="text-[11px] text-slate-500 italic">&ldquo;{log.notes}&rdquo;</p>
                <div className="text-[10px] text-slate-400">
                  By {log.adminName} · {new Date(log.timestamp).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Active Coupons by Click Volume */}
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-indigo-600" />
              <span>Highest Click Traffic Offers</span>
            </h3>
            <button
              onClick={() => onNavigate('/admin/coupons')}
              className="text-xs font-semibold text-teal-700 hover:underline flex items-center gap-1"
            >
              <span>Manage Codes</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="space-y-3">
            {topCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-3 bg-slate-50 rounded-xl border border-slate-200/70 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5 truncate mr-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[11px]">
                      {coupon.code}
                    </span>
                    <span className="font-semibold text-slate-800">{coupon.merchantName}</span>
                  </div>
                  <div className="text-slate-500 text-[11px] truncate">{coupon.title}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-black text-slate-900">{coupon.clickCount} clicks</div>
                  <div className="text-[10px] text-emerald-700 font-semibold">{coupon.discountValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
