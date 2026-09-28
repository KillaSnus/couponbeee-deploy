import React, { useEffect, useState } from 'react';
import { ShieldCheck, ExternalLink, ArrowRight, Loader2 } from 'lucide-react';
import { db } from '../../lib/db';

interface RedirectPageProps {
  id: string; // coupon or deal ID
  onNavigate: (path: string) => void;
}

export const RedirectPage: React.FC<RedirectPageProps> = ({ id, onNavigate }) => {
  const [countdown, setCountdown] = useState(3);
  const coupon = db.getCouponById(id);
  const deal = db.getDealById(id);

  const target = coupon || deal;
  const destination = coupon ? coupon.affiliateUrl : deal ? deal.dealUrl : 'https://biorals.com';
  const merchantName = target?.merchantName || 'Merchant Partner';

  useEffect(() => {
    if (target) {
      db.recordClick(
        coupon ? 'coupon' : 'deal',
        target.id,
        target.title,
        target.merchantId,
        target.merchantName || 'Merchant',
        destination
      );
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          window.location.href = destination;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [destination, target, coupon]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-8 text-center space-y-6 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center mx-auto text-teal-600">
          <ShieldCheck className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-xs uppercase tracking-wider font-bold text-teal-700">
            Approved Outbound Redirect
          </span>
          <h1 className="text-xl font-bold text-slate-900">
            Transferring to {merchantName}
          </h1>
          <p className="text-xs text-slate-500">
            Applying verified discount link and logging click event to maintain link integrity.
          </p>
        </div>

        <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 py-3 bg-slate-50 rounded-2xl border border-slate-100">
          <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
          <span>Redirecting in {countdown} seconds...</span>
        </div>

        <div className="space-y-2 pt-2">
          <a
            href={destination}
            rel="sponsored nofollow noopener"
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
          >
            <span>Proceed to {merchantName} Immediately</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => onNavigate('/')}
            className="text-xs text-slate-400 hover:text-slate-600 underline-offset-2 hover:underline"
          >
            Return to Biorals homepage
          </button>
        </div>

        <p className="text-[10px] text-slate-400 border-t border-slate-100 pt-4">
          Biorals attaches non-cloaked affiliate parameters (<code className="text-slate-500 font-mono">rel=&quot;sponsored nofollow noopener&quot;</code>) in compliance with search engine guidelines.
        </p>
      </div>
    </div>
  );
};
