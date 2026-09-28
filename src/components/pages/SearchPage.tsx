import React, { useState, useMemo } from 'react';
import { Search, ShoppingBag, Tag, Flame, BookOpen, ShieldCheck, X } from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon, Deal } from '../../types';
import { CouponCard } from '../cards/CouponCard';
import { DealCard } from '../cards/DealCard';
import { MerchantCard } from '../cards/MerchantCard';

interface SearchPageProps {
  initialQuery?: string;
  onNavigate: (path: string) => void;
  onGetCode: (coupon: Coupon) => void;
  onGetDeal: (deal: Deal) => void;
  onReportCoupon: (coupon: Coupon) => void;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  initialQuery = '',
  onNavigate,
  onGetCode,
  onGetDeal,
  onReportCoupon,
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<'all' | 'merchants' | 'coupons' | 'deals' | 'blog'>('all');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const merchants = db.getMerchants();
  const coupons = db.getCoupons();
  const deals = db.getDeals();
  const blogPosts = db.getBlogPosts();

  const trimmed = query.trim().toLowerCase();

  // Multi-entity search with ethical editorial ranking
  const searchResults = useMemo(() => {
    if (!trimmed) {
      return {
        matchedMerchants: merchants.slice(0, 4),
        matchedCoupons: coupons.slice(0, 6),
        matchedDeals: deals.slice(0, 3),
        matchedBlog: blogPosts.slice(0, 2),
      };
    }

    const matchedMerchants = merchants
      .filter((m) => m.name.toLowerCase().includes(trimmed) || m.domain.toLowerCase().includes(trimmed))
      .sort((a, b) => b.couponCount - a.couponCount);

    const matchedCoupons = coupons
      .filter((c) => {
        if (verifiedOnly && c.verificationStatus !== 'TESTED') return false;
        return (
          c.title.toLowerCase().includes(trimmed) ||
          c.code.toLowerCase().includes(trimmed) ||
          c.description.toLowerCase().includes(trimmed) ||
          (c.merchantName && c.merchantName.toLowerCase().includes(trimmed))
        );
      })
      .sort((a, b) => {
        // Ranking: Verified test status > Editorial Priority > Click Activity
        const aScore = (a.verificationStatus === 'TESTED' ? 100 : 0) + a.editorialPriority + a.clickCount * 0.1;
        const bScore = (b.verificationStatus === 'TESTED' ? 100 : 0) + b.editorialPriority + b.clickCount * 0.1;
        return bScore - aScore;
      });

    const matchedDeals = deals
      .filter((d) => {
        return (
          d.title.toLowerCase().includes(trimmed) ||
          (d.merchantName && d.merchantName.toLowerCase().includes(trimmed)) ||
          d.editorialNotes.toLowerCase().includes(trimmed)
        );
      })
      .sort((a, b) => b.discountPercentage - a.discountPercentage);

    const matchedBlog = blogPosts.filter(
      (p) => p.title.toLowerCase().includes(trimmed) || p.excerpt.toLowerCase().includes(trimmed)
    );

    return {
      matchedMerchants,
      matchedCoupons,
      matchedDeals,
      matchedBlog,
    };
  }, [trimmed, merchants, coupons, deals, blogPosts, verifiedOnly]);

  const totalResults =
    searchResults.matchedMerchants.length +
    searchResults.matchedCoupons.length +
    searchResults.matchedDeals.length +
    searchResults.matchedBlog.length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Search Header */}
      <div className="space-y-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Global Savings Search
        </h1>

        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stores, brands, products or coupon codes..."
            className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base shadow-xs"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl overflow-x-auto text-xs font-semibold">
          {[
            { id: 'all', label: `All (${totalResults})` },
            { id: 'merchants', label: `Stores (${searchResults.matchedMerchants.length})`, icon: ShoppingBag },
            { id: 'coupons', label: `Coupons (${searchResults.matchedCoupons.length})`, icon: Tag },
            { id: 'deals', label: `Deals (${searchResults.matchedDeals.length})`, icon: Flame },
            { id: 'blog', label: `Guides (${searchResults.matchedBlog.length})`, icon: BookOpen },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-white text-slate-900 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
          />
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Verified Checkout Codes Only</span>
        </label>
      </div>

      {/* Results Content */}
      <div className="space-y-10">
        {/* Stores Section */}
        {(activeFilter === 'all' || activeFilter === 'merchants') && searchResults.matchedMerchants.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-teal-600" />
              <span>Matching Stores ({searchResults.matchedMerchants.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {searchResults.matchedMerchants.map((merchant) => (
                <MerchantCard key={merchant.id} merchant={merchant} onNavigate={onNavigate} />
              ))}
            </div>
          </div>
        )}

        {/* Coupons Section */}
        {(activeFilter === 'all' || activeFilter === 'coupons') && searchResults.matchedCoupons.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-teal-600" />
              <span>Matching Coupon Codes ({searchResults.matchedCoupons.length})</span>
            </h2>
            <div className="space-y-4">
              {searchResults.matchedCoupons.map((coupon) => (
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
        )}

        {/* Deals Section */}
        {(activeFilter === 'all' || activeFilter === 'deals') && searchResults.matchedDeals.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Matching Deals ({searchResults.matchedDeals.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.matchedDeals.map((deal) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  onGetDeal={onGetDeal}
                  onNavigateToMerchant={(slug) => onNavigate(`/stores/${slug}`)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Guides Section */}
        {(activeFilter === 'all' || activeFilter === 'blog') && searchResults.matchedBlog.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>Relevant Savings Guides ({searchResults.matchedBlog.length})</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {searchResults.matchedBlog.map((post) => (
                <div
                  key={post.id}
                  onClick={() => onNavigate(`/blog/${post.slug}`)}
                  className="bg-white p-5 rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all cursor-pointer space-y-2 group shadow-xs"
                >
                  <span className="text-[11px] font-semibold text-teal-700">{post.category}</span>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {totalResults === 0 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <Search className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-lg font-bold text-slate-900">No results found for &ldquo;{query}&rdquo;</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Check for typing errors, browse our store directory, or submit a coupon code you recently used.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
