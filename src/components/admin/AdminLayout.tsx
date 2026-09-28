import React from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  Flame,
  ShieldCheck,
  Upload,
  AlertCircle,
  BarChart2,
  FileText,
  Sliders,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { db } from '../../lib/db';

interface AdminLayoutProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentPath,
  onNavigate,
  children,
}) => {
  const stats = db.getStats();

  const navItems = [
    { path: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/admin/stores', label: 'Stores & Merchants', icon: ShoppingBag, count: stats.totalMerchants },
    { path: '/admin/coupons', label: 'Coupons Manager', icon: Tag, count: stats.activeCoupons },
    { path: '/admin/deals', label: 'Deals Manager', icon: Flame, count: stats.activeDeals },
    { path: '/admin/verification', label: 'Verification Desk', icon: ShieldCheck },
    { path: '/admin/import', label: 'Bulk Import (CSV/JSON)', icon: Upload },
    { path: '/admin/reports', label: 'User Reports', icon: AlertCircle, count: stats.pendingReports },
    { path: '/admin/analytics', label: 'Click & Conversion Analytics', icon: BarChart2 },
    { path: '/admin/settings', label: 'Affiliate Networks & Settings', icon: Sliders },
    { path: '/admin/logs', label: 'Audit Logs', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-800">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Admin Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950 font-black text-xs">
              B
            </div>
            <div>
              <span className="font-extrabold text-white text-sm tracking-tight block">
                BIORALS CMS
              </span>
              <span className="text-[10px] text-teal-400 font-medium block">
                Editorial Control Console
              </span>
            </div>
          </div>
          <button
            onClick={() => onNavigate('/')}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            title="Exit to Public Website"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              item.path === '/admin'
                ? currentPath === '/admin' || currentPath === '/admin/dashboard'
                : currentPath === item.path || currentPath.startsWith(item.path);

            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-teal-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      isActive ? 'bg-black/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-800 text-[11px] text-slate-500 space-y-1">
          <div className="flex items-center justify-between">
            <span>Data Storage:</span>
            <span className="text-emerald-400 font-semibold">IndexedDB / Local</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Sync Mode:</span>
            <span className="text-teal-400">Reactive Store</span>
          </div>
          <div className="pt-2">
            <button
              onClick={() => {
                if (confirm('Reset database to initial authentic seed data?')) {
                  db.resetToDefaults();
                  window.location.reload();
                }
              }}
              className="w-full py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[10px] flex items-center justify-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to Seed Data</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          {children}
        </div>
      </main>
    </div>
  );
};
