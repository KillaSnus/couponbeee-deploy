import React, { useState } from 'react';
import {
  ShieldCheck,
  Clock,
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Flag,
  Copy,
  Check,
  ExternalLink,
  Scissors,
} from 'lucide-react';
import { Coupon } from '../../types';
import { db } from '../../lib/db';

interface CouponCardProps {
  coupon: Coupon;
  onGetCode: (coupon: Coupon) => void;
  onReport: (coupon: Coupon) => void;
  onNavigateToMerchant?: (slug: string) => void;
}

export const CouponCard: React.FC<CouponCardProps> = ({
  coupon,
  onGetCode,
  onReport,
  onNavigateToMerchant,
}) => {
  const [showTerms, setShowTerms] = useState(false);
  const [voted, setVoted] = useState<'yes' | 'no' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleVote = (type: 'yes' | 'no') => {
    if (voted) return;
    setVoted(type);
    db.voteCoupon(coupon.id, type === 'yes');
  };

  const handleCopyInline = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(coupon.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Format verified date
  const formattedTestedDate = coupon.lastVerifiedAt
    ? new Date(coupon.lastVerifiedAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : null;

  const isExpired = coupon.status === 'expired' || coupon.verificationStatus === 'EXPIRED';

  return (
    <div
      className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md ${
        isExpired ? 'border-slate-200 opacity-75' : 'border-slate-200/90 hover:border-slate-300'
      }`}
    >
      <div className="p-5 sm:p-6 flex flex-col md:flex-row gap-5 items-start md:items-center justify-between">
        {/* Left Column: Discount Badge & Main Info */}
        <div className="flex items-start gap-4 flex-1">
          {/* Discount Block */}
          <div className="shrink-0 w-20 sm:w-24 h-20 sm:h-24 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-100/80 rounded-2xl flex flex-col items-center justify-center p-2 text-center text-teal-900 shadow-inner">
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-teal-800 leading-none">
              {coupon.discountValue}
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700/80 mt-1">
              {coupon.discountType === 'percentage' ? 'DISCOUNT' : 'OFFER'}
            </span>
            {coupon.isExclusive && (
              <span className="mt-1 text-[9px] font-semibold text-amber-700 bg-amber-100/90 px-1.5 py-0.2 rounded">
                EXCLUSIVE
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-1.5 flex-1 min-w-0">
            {/* Merchant + Verification Trust Bar */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {coupon.merchantName && (
                <button
                  onClick={() => onNavigateToMerchant && coupon.merchantSlug && onNavigateToMerchant(coupon.merchantSlug)}
                  className="font-bold text-slate-800 hover:text-teal-700 transition-colors"
                >
                  {coupon.merchantName}
                </button>
              )}

              {coupon.verificationStatus === 'TESTED' && formattedTestedDate && (
                <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 font-semibold px-2 py-0.5 rounded-md text-[11px] border border-emerald-100">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Tested on {formattedTestedDate}
                </span>
              )}

              {coupon.verificationStatus === 'UNVERIFIED' && (
                <span className="text-slate-500 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                  Unverified
                </span>
              )}

              {isExpired && (
                <span className="text-rose-700 bg-rose-50 font-semibold px-2 py-0.5 rounded text-[11px] border border-rose-200">
                  Expired
                </span>
              )}
            </div>

            {/* Title */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug hover:text-teal-700 transition-colors cursor-pointer"
                onClick={() => onGetCode(coupon)}>
              {coupon.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {coupon.description}
            </p>

            {/* Expiry & Source info */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Expires: {new Date(coupon.expiryDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Source: {coupon.sourceType.replace(/_/g, ' ')}</span>
            </div>
          </div>
        </div>

        {/* Right Column: CTA & Code reveal trigger */}
        <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row md:flex-col items-stretch md:items-end gap-2.5 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
          {/* Main CTA */}
          <button
            onClick={() => onGetCode(coupon)}
            className="group relative flex items-center justify-between sm:justify-center gap-3 px-6 py-3 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all shadow-sm hover:shadow active:scale-[0.99] overflow-hidden"
          >
            <span className="text-xs uppercase tracking-wider flex items-center gap-1.5">
              <Scissors className="w-3.5 h-3.5 -rotate-45" /> Get Code
            </span>
            <div className="flex items-center gap-1.5 bg-black/15 px-2.5 py-1 rounded-lg border border-white/20 font-mono text-xs tracking-wider">
              <span>{coupon.code.slice(0, 3)}***</span>
              <ExternalLink className="w-3 h-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            </div>
          </button>

          {/* Quick inline copy helper */}
          <div className="flex items-center justify-between md:justify-end gap-3 text-xs text-slate-500 px-1">
            <button
              onClick={handleCopyInline}
              className="hover:text-slate-900 transition-colors flex items-center gap-1 text-[11px]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700 font-semibold">Code copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Copy Code</span>
                </>
              )}
            </button>

            <span className="text-slate-300">·</span>

            <button
              onClick={() => onReport(coupon)}
              className="hover:text-rose-600 transition-colors flex items-center gap-1 text-[11px]"
            >
              <Flag className="w-3 h-3 text-slate-400 hover:text-rose-500" />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Sub-bar: Helpfulness voting & Terms Dropdown */}
      <div className="bg-slate-50/80 px-5 sm:px-6 py-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <span>Did this code work?</span>
          <button
            onClick={() => handleVote('yes')}
            disabled={voted !== null}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              voted === 'yes' ? 'bg-emerald-100 text-emerald-800 font-bold' : 'hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            <ThumbsUp className="w-3.5 h-3.5" />
            <span>{(coupon.helpfulCount || 0) + (voted === 'yes' ? 1 : 0)}</span>
          </button>
          <button
            onClick={() => handleVote('no')}
            disabled={voted !== null}
            className={`flex items-center gap-1 px-2 py-0.5 rounded transition-colors ${
              voted === 'no' ? 'bg-rose-100 text-rose-800 font-bold' : 'hover:bg-slate-200/80 text-slate-600'
            }`}
          >
            <ThumbsDown className="w-3.5 h-3.5" />
            <span>{(coupon.unhelpfulCount || 0) + (voted === 'no' ? 1 : 0)}</span>
          </button>
        </div>

        <button
          onClick={() => setShowTerms(!showTerms)}
          className="flex items-center gap-1 font-medium text-slate-600 hover:text-slate-900 transition-colors"
        >
          <span>Terms & Details</span>
          {showTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Expandable Terms Drawer */}
      {showTerms && (
        <div className="p-4 bg-slate-50 border-t border-slate-200/70 text-xs text-slate-600 space-y-2">
          <div>
            <span className="font-semibold text-slate-800">Coupon Terms: </span>
            {coupon.terms}
          </div>
          {coupon.lastVerifiedAt && (
            <div className="text-slate-500">
              <span className="font-semibold text-slate-700">Verification Method: </span>
              {coupon.verificationMethod?.replace(/_/g, ' ')} on {formattedTestedDate}.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
