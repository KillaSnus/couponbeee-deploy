import React, { useState, useMemo } from 'react';
import { ShieldCheck, Sparkles } from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon } from '../../types';
import { CouponCard } from '../cards/CouponCard';

interface CouponsPageProps {
  onNavigate: (path: string) => void;
  onGetCode: (coupon: Coupon) => void;
  onReportCoupon: (coupon: Coupon) => void;
}

export const CouponsPage: React.FC<CouponsPageProps> = ({
  onNavigate,
  onGetCode,
  onReportCoupon,
}) => {
  const allCoupons = db.getCoupons();
  const categories = db.getCategories();
  const merchants = db.getMerchants();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyExclusive, setOnlyExclusive] = useState(false);
  const [sortBy, setSortBy] = useState<'priority' | 'newest' | 'helpful'>('priority');

  const filtered = useMemo(() => {
    return allCoupons
      .filter((c) => {
        if (c.status !== 'active') return false;

        if (selectedCategory !== 'ALL') {
          const merchant = merchants.find((m) => m.id === c.merchantId);
          if (!merchant || !merchant.categories.includes(selectedCategory)) return false;
        }

        if (onlyVerified && c.verificationStatus !== 'TESTED') return false;
        if (onlyExclusive && !c.isExclusive) return false;

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'helpful') {
          return (b.helpfulCount || 0) - (a.helpfulCount || 0);
        }
        return b.editorialPriority - a.editorialPriority;
      });
  }, [allCoupons, selectedCategory, onlyVerified, onlyExclusive, sortBy, merchants]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Factual Verification Logs</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Active Verified Coupons &amp; Promo Codes
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Browse valid coupon codes tested by our editorial analysts on live merchant checkouts. No deceptive clickbait or expired codes.
        </p>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 font-medium text-slate-700"
            >
              <option value="ALL">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 font-medium text-slate-700"
            >
              <option value="priority">Editorial Recommendation</option>
              <option value="newest">Recently Verified &amp; Added</option>
              <option value="helpful">Community Upvoted</option>
            </select>
          </div>

          {/* Verification Filter */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl w-full cursor-pointer hover:bg-slate-100/80 transition-colors select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={onlyVerified}
                onChange={(e) => setOnlyVerified(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Tested on Checkout Only</span>
            </label>
          </div>

          {/* Exclusive Filter */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl w-full cursor-pointer hover:bg-slate-100/80 transition-colors select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={onlyExclusive}
                onChange={(e) => setOnlyExclusive(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Exclusive Offers</span>
            </label>
          </div>
        </div>

        {/* Status Count */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Displaying <strong className="text-slate-800">{filtered.length}</strong> active verified coupons
          </span>
          {(selectedCategory !== 'ALL' || onlyVerified || onlyExclusive) && (
            <button
              onClick={() => {
                setSelectedCategory('ALL');
                setOnlyVerified(false);
                setOnlyExclusive(false);
              }}
              className="text-teal-700 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Coupons List */}
      <div className="space-y-4">
        {filtered.map((coupon) => (
          <CouponCard
            key={coupon.id}
            coupon={coupon}
            onGetCode={onGetCode}
            onReport={onReportCoupon}
            onNavigateToMerchant={(slug) => onNavigate(`/stores/${slug}`)}
          />
        ))}
      </div>
    </div>
  );
};
