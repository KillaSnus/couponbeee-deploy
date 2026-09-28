import React, { useState } from 'react';
import { X, PlusCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import { db } from '../../lib/db';

interface SubmitCouponModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMerchantName?: string;
}

export const SubmitCouponModal: React.FC<SubmitCouponModalProps> = ({
  isOpen,
  onClose,
  defaultMerchantName = '',
}) => {
  const [merchantName, setMerchantName] = useState(defaultMerchantName);
  const [merchantUrl, setMerchantUrl] = useState('');
  const [couponCode, setCouponCode] = useState('');
  const [discountValue, setDiscountValue] = useState('');
  const [description, setDescription] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [submitterEmail, setSubmitterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    db.submitUserCoupon({
      merchantName,
      merchantUrl,
      couponCode: couponCode.trim().toUpperCase(),
      discountValue,
      description,
      expiryDate,
      submitterEmail,
    });
    setSubmitted(true);
    setTimeout(() => {
      onClose();
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-teal-700 mb-2">
          <PlusCircle className="w-6 h-6" />
          <h3 className="text-xl font-bold text-slate-900">Submit a Verified Coupon</h3>
        </div>

        <p className="text-xs text-slate-500 mb-4">
          Share a legitimate promo code you used. All submissions undergo manual checkout testing before being published to preserve data integrity.
        </p>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <CheckCircle2 className="w-14 h-14 text-emerald-500 mx-auto" />
            <h4 className="text-lg font-bold text-slate-900">Thank you for sharing!</h4>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Our editorial testing desk has queued your coupon for verification. If it tests successfully at checkout, it will be published with attribution.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Store / Merchant Name *</label>
                <input
                  type="text"
                  required
                  value={merchantName}
                  onChange={(e) => setMerchantName(e.target.value)}
                  placeholder="e.g. Hostinger, Nike"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Store Website *</label>
                <input
                  type="text"
                  required
                  value={merchantUrl}
                  onChange={(e) => setMerchantUrl(e.target.value)}
                  placeholder="e.g. hostinger.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="e.g. SAVE20"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl font-mono uppercase font-bold focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discount Amount *</label>
                <input
                  type="text"
                  required
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="e.g. 20% OFF or $15 OFF"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Offer Details & Requirements</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What items or plans does this apply to? Any minimum purchase?"
                rows={2}
                className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expiry Date (Optional)</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Your Email (Optional)</label>
                <input
                  type="email"
                  value={submitterEmail}
                  onChange={(e) => setSubmitterEmail(e.target.value)}
                  placeholder="For credit / notification"
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:border-teal-500"
                />
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                To combat coupon fraud, community submissions are reviewed by an editorial analyst within 24 hours.
              </span>
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
                className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold transition-colors shadow-sm"
              >
                Submit Coupon
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
