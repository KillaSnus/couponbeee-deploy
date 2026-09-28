import React, { useState } from 'react';
import { ShieldCheck, Plus, ExternalLink, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon } from '../../types';
import { VerifyModal } from '../modals/VerifyModal';

export const AdminVerification: React.FC = () => {
  const coupons = db.getCoupons();
  const logs = db.getVerificationLogs();
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [filterResult, setFilterResult] = useState<string>('ALL');

  const filteredLogs = logs.filter((l) => (filterResult === 'ALL' ? true : l.result === filterResult));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Checkout Verification Desk
          </h1>
          <p className="text-xs text-slate-500">
            Log real cart checkout tests, record exact price deductions, and timestamp verified promotional codes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            onChange={(e) => {
              const c = coupons.find((item) => item.id === e.target.value);
              if (c) setSelectedCoupon(c);
            }}
            value=""
            className="px-3 py-2 bg-teal-600 text-white text-xs font-bold rounded-xl shadow-xs focus:outline-none cursor-pointer"
          >
            <option value="" disabled>
              + Run Test on a Coupon...
            </option>
            {coupons.map((c) => (
              <option key={c.id} value={c.id}>
                {c.merchantName}: {c.code} ({c.discountValue})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Verification Standard Explainer */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-teal-600" />
          <span>Biorals Empirical Verification Standard</span>
        </h3>
        <p className="text-xs text-slate-600 leading-relaxed">
          Every verified status tag on Biorals represents an analyst simulating a live consumer purchase. We enter the code into the merchant checkout field, verify that the order subtotal drops by the stated percentage or dollar amount, and record the test timestamp. Codes that fail or expire are downgraded immediately.
        </p>
      </div>

      {/* Verification Logs Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span className="font-semibold text-slate-800">
            Audit Trail: {filteredLogs.length} Logged Checkout Tests
          </span>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">Filter Result:</span>
            <select
              value={filterResult}
              onChange={(e) => setFilterResult(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-2 py-1 text-xs"
            >
              <option value="ALL">All Outcomes</option>
              <option value="successful">Successful</option>
              <option value="failed">Failed</option>
              <option value="expired">Expired</option>
              <option value="requires_review">Requires Review</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
            <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Merchant / Offer</th>
                <th className="py-3 px-4">Outcome</th>
                <th className="py-3 px-4">Discount Verified</th>
                <th className="py-3 px-4">Analyst Notes</th>
                <th className="py-3 px-4">Verifier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-mono text-[11px]">
                    {new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-bold text-slate-900">{log.merchantName}</div>
                    <div className="text-[11px] text-slate-500 truncate max-w-xs">{log.couponTitle}</div>
                  </td>
                  <td className="py-3 px-4">
                    {log.result === 'successful' && (
                      <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Successful
                      </span>
                    )}
                    {log.result === 'failed' && (
                      <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-100">
                        <XCircle className="w-3 h-3 text-rose-600" /> Failed
                      </span>
                    )}
                    {log.result === 'expired' && (
                      <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-0.5 rounded text-[10px] font-bold border border-amber-100">
                        <Clock className="w-3 h-3 text-amber-600" /> Expired
                      </span>
                    )}
                    {log.result === 'requires_review' && (
                      <span className="inline-flex items-center gap-1 text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold">
                        <AlertTriangle className="w-3 h-3 text-slate-500" /> Review
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 font-semibold text-teal-800">
                    {log.discountTested || 'Verified'}
                  </td>
                  <td className="py-3 px-4 max-w-xs text-[11px] text-slate-600">
                    {log.notes}
                  </td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {log.adminName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedCoupon && (
        <VerifyModal
          coupon={selectedCoupon}
          onClose={() => setSelectedCoupon(null)}
          onVerified={() => setSelectedCoupon(null)}
        />
      )}
    </div>
  );
};
