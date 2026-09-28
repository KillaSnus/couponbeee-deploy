import React from 'react';
import { FileText, ShieldCheck } from 'lucide-react';
import { db } from '../../lib/db';

export const AdminLogs: React.FC = () => {
  const verificationLogs = db.getVerificationLogs();
  const clicks = db.getClicks();

  const auditEvents = [
    ...verificationLogs.map((l) => ({
      id: l.id,
      timestamp: l.timestamp,
      action: `VERIFICATION: ${l.result.toUpperCase()}`,
      detail: `Tested ${l.couponTitle} (${l.merchantName}) by ${l.adminName}`,
      type: 'verification',
    })),
    ...clicks.slice(0, 15).map((c) => ({
      id: c.id,
      timestamp: c.timestamp,
      action: `CLICK_OUTBOUND: ${c.type.toUpperCase()}`,
      detail: `${c.targetTitle} -> ${c.merchantName}`,
      type: 'click',
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">System Audit &amp; Event Logs</h1>
        <p className="text-xs text-slate-500">
          Immutable event log tracing checkout tests, status revisions, and click stream records.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100 font-mono text-[11px]">
          <thead className="bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-sans">
            <tr>
              <th className="py-2.5 px-4">Timestamp</th>
              <th className="py-2.5 px-4">Event Action</th>
              <th className="py-2.5 px-4">Event Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {auditEvents.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-50">
                <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                  {new Date(ev.timestamp).toLocaleString()}
                </td>
                <td className="py-2.5 px-4 font-bold text-slate-800">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] ${
                      ev.type === 'verification' ? 'bg-teal-50 text-teal-800' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {ev.action}
                  </span>
                </td>
                <td className="py-2.5 px-4 font-sans text-slate-700">{ev.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
