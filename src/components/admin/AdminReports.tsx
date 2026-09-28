import React from 'react';
import { AlertCircle, CheckCircle2, XCircle } from 'lucide-react';
import { db } from '../../lib/db';

export const AdminReports: React.FC = () => {
  const reports = db.getReports();

  const handleResolve = (id: string, status: 'resolved' | 'dismissed') => {
    db.resolveReport(id, status, `Reviewed and marked ${status} by admin.`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            User Coupon Flagging &amp; Reports Desk
          </h1>
          <p className="text-xs text-slate-500">
            Investigate community flags concerning expired coupons, checkout rejections, or misleading discount claims.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        {reports.length === 0 ? (
          <div className="p-12 text-center text-slate-400 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
            <h3 className="font-bold text-slate-700 text-sm">All Reports Resolved</h3>
            <p className="text-xs text-slate-400">No community flags pending review.</p>
          </div>
        ) : (
          <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Merchant / Coupon</th>
                <th className="py-3 px-4">Flag Reason</th>
                <th className="py-3 px-4">Shopper Notes</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {reports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-mono text-[11px] text-slate-500 whitespace-nowrap">
                    {new Date(report.timestamp).toLocaleDateString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{report.merchantName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{report.couponTitle}</div>
                  </td>
                  <td className="py-3 px-4 font-semibold text-rose-700">
                    {report.reason.replace(/_/g, ' ')}
                  </td>
                  <td className="py-3 px-4 max-w-xs text-slate-600">
                    {report.userNotes || 'No additional comment'}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        report.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : report.status === 'resolved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {report.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {report.status === 'pending' ? (
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleResolve(report.id, 'resolved')}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-[10px] font-bold transition-colors"
                        >
                          Resolve &amp; Fix
                        </button>
                        <button
                          onClick={() => handleResolve(report.id, 'dismissed')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-[10px] font-medium transition-colors"
                        >
                          Dismiss
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400">Processed</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
