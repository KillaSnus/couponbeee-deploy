import React from 'react';
import {
  Server,
  Layers,
  Cpu,
  ShoppingBag,
  GraduationCap,
  Home as HomeIcon,
  ChevronRight,
  Tag,
} from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon, Deal } from '../../types';
import { MerchantCard } from '../cards/MerchantCard';
import { CouponCard } from '../cards/CouponCard';

interface CategoriesPageProps {
  slug?: string;
  onNavigate: (path: string) => void;
  onGetCode: (coupon: Coupon) => void;
  onReportCoupon: (coupon: Coupon) => void;
}

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  slug,
  onNavigate,
  onGetCode,
  onReportCoupon,
}) => {
  const categories = db.getCategories();
  const merchants = db.getMerchants();
  const coupons = db.getCoupons();

  const iconMap: Record<string, React.ReactNode> = {
    'cat-hosting': <Server className="w-6 h-6 text-teal-600" />,
    'cat-software': <Layers className="w-6 h-6 text-indigo-600" />,
    'cat-electronics': <Cpu className="w-6 h-6 text-amber-600" />,
    'cat-fashion': <ShoppingBag className="w-6 h-6 text-rose-600" />,
    'cat-education': <GraduationCap className="w-6 h-6 text-blue-600" />,
    'cat-home': <HomeIcon className="w-6 h-6 text-emerald-600" />,
  };

  // If a category slug is specified, render the Category Detail View
  if (slug) {
    const currentCat = categories.find((c) => c.slug === slug);
    if (!currentCat) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Category Not Found</h1>
          <button
            onClick={() => onNavigate('/categories')}
            className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold"
          >
            All Categories
          </button>
        </div>
      );
    }

    const catMerchants = merchants.filter((m) => m.categories.includes(currentCat.id));
    const catCoupons = coupons.filter((c) => {
      const m = merchants.find((item) => item.id === c.merchantId);
      return m && m.categories.includes(currentCat.id);
    });

    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => onNavigate('/')} className="hover:text-slate-900 transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button onClick={() => onNavigate('/categories')} className="hover:text-slate-900 transition-colors">
            Categories
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800">{currentCat.name}</span>
        </nav>

        {/* Hero */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 flex items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-100 flex items-center justify-center shrink-0">
            {iconMap[currentCat.id] || <Tag className="w-8 h-8 text-teal-600" />}
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {currentCat.name} Coupons &amp; Deals
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 max-w-2xl mt-1 leading-relaxed">
              {currentCat.description}
            </p>
          </div>
        </div>

        {/* Merchants in this category */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900">
            Featured {currentCat.name} Stores ({catMerchants.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {catMerchants.map((m) => (
              <MerchantCard key={m.id} merchant={m} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* Coupons in this category */}
        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-bold text-slate-900">
            Verified Coupons in {currentCat.name} ({catCoupons.length})
          </h2>
          <div className="space-y-4">
            {catCoupons.map((coupon) => (
              <CouponCard
                key={coupon.id}
                coupon={coupon}
                onGetCode={onGetCode}
                onReport={onReportCoupon}
                onNavigateToMerchant={(s) => onNavigate(`/stores/${s}`)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Directory View
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Browse by Category
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Explore authentic savings opportunities organized across safe, non-restricted merchandise categories.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div
            key={cat.id}
            onClick={() => onNavigate(`/categories/${cat.slug}`)}
            className="bg-white rounded-3xl border border-slate-200/90 hover:border-teal-500 hover:shadow-md transition-all p-6 cursor-pointer flex flex-col justify-between group"
          >
            <div className="space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                {iconMap[cat.id] || <Tag className="w-6 h-6 text-teal-600" />}
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {cat.description}
                </p>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold text-slate-700">{cat.activeCouponCount} Active Offers</span>
              <span className="text-teal-700 font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                <span>Explore</span>
                <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
