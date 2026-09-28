import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  ThumbsUp,
  ThumbsDown,
  Info,
  Flag,
} from 'lucide-react';
import { Coupon } from '../../types';
import { db } from '../../lib/db';

interface CouponCodeModalProps {
  coupon: Coupon | null;
  onClose: () => void;
  onReport: (coupon: Coupon) => void;
}

export const CouponCodeModal: React.FC<CouponCodeModalProps> = ({ coupon, onClose, onReport }) => {
  const [copied, setCopied] = useState(false);
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null);

  if (!coupon) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleVote = (type: 'yes' | 'no') => {
    if (voted) return;
    setVoted(type);
    db.voteCoupon(coupon.id, type === 'yes');
  };

  const formattedDate = coupon.lastVerifiedAt
    ? new Date(coupon.lastVerifiedAt).toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const destination = coupon.affiliateUrl || coupon.landingUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-slate-200 text-slate-900 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 mx-auto shadow-xs">
            <span className="text-lg font-black">{coupon.discountValue}</span>
          </div>

          <h3 className="text-xl font-bold text-slate-900 leading-tight pt-1">
            {coupon.title}
          </h3>

          <p className="text-xs text-slate-500">
            Copy this coupon code and apply it during checkout on{' '}
            <strong className="text-slate-700">{coupon.merchantName}</strong>.
          </p>
        </div>

        {/* Code Box */}
        <div className="relative mb-6">
          <div className="flex items-center justify-between p-2 pl-4 bg-slate-100 border-2 border-dashed border-teal-500/60 rounded-2xl">
            <span className="font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider select-all truncate mr-2">
              {coupon.code}
            </span>
            <button
              onClick={handleCopy}
              className={`flex items-center gap-1.5 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all shadow-xs ${
                copied
                  ? 'bg-emerald-600 text-white shadow-emerald-500/20'
                  : 'bg-teal-600 hover:bg-teal-700 text-white'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>COPIED!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>COPY CODE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Browser Tab Notice */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 mb-5 flex items-start gap-3 text-xs text-slate-600">
          <Info className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p>
              We opened <strong>{coupon.merchantName}</strong> in a new tab. Paste this code at checkout to claim your discount.
            </p>
            <a
              href={destination}
              target="_blank"
              rel="sponsored nofollow noopener"
              className="inline-flex items-center gap-1 text-teal-700 font-bold hover:underline"
            >
              <span>Reopen {coupon.merchantName} store</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Verification Record (Real facts, no fake claims) */}
        {coupon.verificationStatus === 'TESTED' && formattedDate && (
          <div className="mb-5 p-3.5 bg-emerald-50/60 border border-emerald-200/70 rounded-2xl text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tested on {formattedDate}</span>
            </div>
            <p className="text-emerald-800/80 text-[11px] leading-relaxed">
              Our editorial analyst tested this code directly in the merchant shopping cart. The discount applied successfully to the order subtotal.
            </p>
          </div>
        )}

        {/* Terms */}
        <div className="text-[11px] text-slate-500 mb-6 bg-slate-50/60 p-3 rounded-xl border border-slate-100">
          <span className="font-semibold text-slate-700">Terms: </span>
          {coupon.terms}
        </div>

        {/* Modal Footer: Helpfulness Feedback */}
        <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <span>Did it work?</span>
            <button
              onClick={() => handleVote('yes')}
              disabled={voted !== null}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                voted === 'yes'
                  ? 'bg-emerald-100 border-emerald-300 text-emerald-800 font-bold'
                  : 'hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => handleVote('no')}
              disabled={voted !== null}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg border transition-colors ${
                voted === 'no'
                  ? 'bg-rose-100 border-rose-300 text-rose-800 font-bold'
                  : 'hover:bg-slate-100 border-slate-200 text-slate-700'
              }`}
            >
              <ThumbsDown className="w-3.5 h-3.5" />
              <span>No</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onReport(coupon);
            }}
            className="flex items-center gap-1 text-slate-400 hover:text-rose-600 transition-colors text-[11px]"
          >
            <Flag className="w-3 h-3" />
            <span>Report code</span>
          </button>
        </div>
      </div>
    </div>
  );
};
