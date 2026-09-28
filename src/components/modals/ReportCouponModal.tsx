import React, { useState } from 'react';
import { X, Flag, CheckCircle2 } from 'lucide-react';
import { Coupon } from '../../types';
import { db } from '../../lib/db';

interface ReportCouponModalProps {
  coupon: Coupon | null;
  onClose: () => void;
}

export const ReportCouponModal: React.FC<ReportCouponModalProps> = ({ coupon, onClose }) => {
  const [reason, setReason] = useState<'code_expired' | 'code_invalid' | 'misleading_discount' | 'other'>('code_invalid');
  const [userNotes, setUserNotes] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!coupon) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.submitReport({
      couponId: coupon.id,
      couponTitle: coupon.title,
      merchantName: coupon.merchantName || 'Merchant',
      reason,
      userNotes,
      userEmail,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-rose-600 mb-3">
          <Flag className="w-5 h-5" />
          <h3 className="text-lg font-bold text-slate-900">Report Coupon</h3>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Help our editorial community keep savings data honest. Report issues with code{' '}
          <strong className="text-slate-700 font-mono">{coupon.code}</strong> on{' '}
          <strong className="text-slate-700">{coupon.merchantName}</strong>.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="text-base font-bold text-slate-900">Report Submitted</h4>
            <p className="text-xs text-slate-500">
              Our editorial testing desk will re-verify this coupon immediately. Thank you!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">What is the issue?</label>
              <div className="space-y-1.5">
                {[
                  { id: 'code_invalid', label: 'Code did not work / Invalid code error' },
                  { id: 'code_expired', label: 'Coupon has expired' },
                  { id: 'misleading_discount', label: 'Discount amount is inaccurate' },
                  { id: 'other', label: 'Other issue or restriction' },
                ].map((item) => (
                  <label
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-xl border border-slate-200 hover:bg-slate-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={item.id}
                      checked={reason === item.id}
                      onChange={() => setReason(item.id as any)}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span className="text-slate-800">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Additional details (Optional)</label>
              <textarea
                value={userNotes}
                onChange={(e) => setUserNotes(e.target.value)}
                placeholder="What error message did the merchant checkout display?"
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Your email (Optional for follow-up)</label>
              <input
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500 text-xs"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold transition-colors"
              >
                Send Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
