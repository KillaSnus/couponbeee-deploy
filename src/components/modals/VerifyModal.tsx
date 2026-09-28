import React, { useState } from 'react';
import { X, ShieldCheck, CheckCircle2, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { Coupon } from '../../types';
import { db } from '../../lib/db';

interface VerifyModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onVerified: () => void;
}

export const VerifyModal: React.FC<VerifyModalProps> = ({ coupon, onClose, onVerified }) => {
  const [result, setResult] = useState<'successful' | 'failed' | 'expired' | 'requires_review'>('successful');
  const [notes, setNotes] = useState('');
  const [adminName, setAdminName] = useState('Sarah Jenkins (Lead Editor)');
  const [discountTested, setDiscountTested] = useState(coupon?.discountValue || '');

  if (!coupon) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.verifyCoupon(coupon.id, result, notes, adminName, discountTested);
    onVerified();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl relative border border-slate-200 text-slate-900">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-teal-700 mb-1">
          <ShieldCheck className="w-6 h-6" />
          <h3 className="text-lg font-bold text-slate-900">Run Editorial Verification Test</h3>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Testing coupon <strong className="font-mono text-slate-800">{coupon.code}</strong> for{' '}
          <strong className="text-slate-800">{coupon.merchantName}</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 mb-1.5">Verification Outcome *</label>
            <div className="grid grid-cols-2 gap-2">
              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  result === 'successful'
                    ? 'border-emerald-500 bg-emerald-50/70 text-emerald-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="verifResult"
                  value="successful"
                  checked={result === 'successful'}
                  onChange={() => setResult('successful')}
                  className="text-emerald-600"
                />
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Test Successful</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  result === 'failed'
                    ? 'border-rose-500 bg-rose-50/70 text-rose-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="verifResult"
                  value="failed"
                  checked={result === 'failed'}
                  onChange={() => setResult('failed')}
                  className="text-rose-600"
                />
                <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Test Failed</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  result === 'expired'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="verifResult"
                  value="expired"
                  checked={result === 'expired'}
                  onChange={() => setResult('expired')}
                  className="text-amber-600"
                />
                <Clock className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Expired</span>
              </label>

              <label
                className={`p-2.5 rounded-xl border flex items-center gap-2 cursor-pointer transition-colors ${
                  result === 'requires_review'
                    ? 'border-slate-500 bg-slate-100 text-slate-900 font-bold'
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="verifResult"
                  value="requires_review"
                  checked={result === 'requires_review'}
                  onChange={() => setResult('requires_review')}
                  className="text-slate-600"
                />
                <AlertTriangle className="w-4 h-4 text-slate-600 shrink-0" />
                <span>Needs Review</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Discount Amount Verified</label>
            <input
              type="text"
              value={discountTested}
              onChange={(e) => setDiscountTested(e.target.value)}
              placeholder="e.g. 10% deducted on $120 order"
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Checkout Test Notes *</label>
            <textarea
              required
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tested on cart with 12-month tier. Successfully deducted $15.00 before payment step."
              rows={3}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Editor / Verifier Name</label>
            <input
              type="text"
              value={adminName}
              onChange={(e) => setAdminName(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
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
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-sm"
            >
              Log Verification Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
