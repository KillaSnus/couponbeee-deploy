import React, { useState, useMemo } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { db } from '../../lib/db';
import { Deal } from '../../types';
import { DealCard } from '../cards/DealCard';

interface DealsPageProps {
  onNavigate: (path: string) => void;
  onGetDeal: (deal: Deal) => void;
}

export const DealsPage: React.FC<DealsPageProps> = ({ onNavigate, onGetDeal }) => {
  const deals = db.getDeals();
  const categories = db.getCategories();

  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [maxPrice, setMaxPrice] = useState<number>(1000);
  const [onlyFeatured, setOnlyFeatured] = useState(false);

  const filtered = useMemo(() => {
    return deals.filter((d) => {
      if (!d.active) return false;
      if (selectedCategory !== 'ALL' && d.category !== selectedCategory) return false;
      if (d.salePrice > maxPrice) return false;
      if (onlyFeatured && !d.featured) return false;
      return true;
    });
  }, [deals, selectedCategory, maxPrice, onlyFeatured]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-semibold">
          <Flame className="w-3.5 h-3.5 text-amber-600" />
          <span>Factual Price Drops &amp; Clearance Reductions</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Today&apos;s Verified Deals &amp; Discounts
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Genuine markdown offers and clearance deals checked directly against current retail store prices. No fake coupon codes required.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Max Price Slider */}
          <div>
            <div className="flex justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              <span>Max Price</span>
              <span className="text-slate-900 font-mono">${maxPrice}</span>
            </div>
            <input
              type="range"
              min="10"
              max="1000"
              step="10"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-teal-600"
            />
          </div>

          {/* Featured Toggle */}
          <div className="flex items-end">
            <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl w-full cursor-pointer hover:bg-slate-100/80 transition-colors select-none text-xs font-semibold text-slate-700">
              <input
                type="checkbox"
                checked={onlyFeatured}
                onChange={(e) => setOnlyFeatured(e.target.checked)}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Featured Deals Only</span>
            </label>
          </div>
        </div>
      </div>

      {/* Deals Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((deal) => (
          <DealCard
            key={deal.id}
            deal={deal}
            onGetDeal={onGetDeal}
            onNavigateToMerchant={(slug) => onNavigate(`/stores/${slug}`)}
          />
        ))}
      </div>
    </div>
  );
};
