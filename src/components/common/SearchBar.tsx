import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ShoppingBag, Tag, Flame, Clock, TrendingUp, ArrowRight, ShieldCheck } from 'lucide-react';
import { db } from '../../lib/db';
import { Merchant, Coupon, Deal, Category, BlogPost } from '../../types';

interface SearchBarProps {
  onNavigate: (path: string) => void;
  onClose?: () => void;
  isModal?: boolean;
}

const RECENT_SEARCHES_KEY = 'biorals_recent_searches_v1';

export const SearchBar: React.FC<SearchBarProps> = ({ onNavigate, onClose, isModal = false }) => {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const merchants = db.getMerchants();
  const coupons = db.getCoupons();
  const deals = db.getDeals();
  const categories = db.getCategories();
  const blogPosts = db.getBlogPosts();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) setRecentSearches(JSON.parse(stored));
    } catch {
      // ignore
    }
    if (isModal && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isModal]);

  const saveRecentSearch = (term: string) => {
    if (!term.trim()) return;
    const clean = term.trim();
    const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
    setRecentSearches(updated);
    try {
      localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem(RECENT_SEARCHES_KEY);
  };

  const trimmed = query.trim().toLowerCase();

  // Instant Suggestions Matching
  const matchedMerchants = trimmed
    ? merchants
        .filter((m) => m.name.toLowerCase().includes(trimmed) || m.domain.toLowerCase().includes(trimmed))
        .slice(0, 4)
    : [];

  const matchedCoupons = trimmed
    ? coupons
        .filter(
          (c) =>
            c.title.toLowerCase().includes(trimmed) ||
            c.code.toLowerCase().includes(trimmed) ||
            (c.merchantName && c.merchantName.toLowerCase().includes(trimmed))
        )
        .slice(0, 4)
    : [];

  const matchedDeals = trimmed
    ? deals
        .filter(
          (d) =>
            d.title.toLowerCase().includes(trimmed) ||
            (d.merchantName && d.merchantName.toLowerCase().includes(trimmed))
        )
        .slice(0, 3)
    : [];

  const matchedCategories = trimmed
    ? categories
        .filter((c) => c.name.toLowerCase().includes(trimmed) || c.description.toLowerCase().includes(trimmed))
        .slice(0, 2)
    : [];

  const matchedArticles = trimmed
    ? blogPosts
        .filter((p) => p.title.toLowerCase().includes(trimmed) || p.excerpt.toLowerCase().includes(trimmed))
        .slice(0, 2)
    : [];

  const hasResults =
    matchedMerchants.length > 0 ||
    matchedCoupons.length > 0 ||
    matchedDeals.length > 0 ||
    matchedCategories.length > 0 ||
    matchedArticles.length > 0;

  const handleSelectSearch = (term: string) => {
    saveRecentSearch(term);
    if (onClose) onClose();
    onNavigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && query.trim()) {
      handleSelectSearch(query);
    } else if (e.key === 'Escape' && onClose) {
      onClose();
    }
  };

  const popularSearches = ['Hostinger', 'Nike', 'DigitalOcean', 'Notion', 'Coursera', 'Sonos'];

  return (
    <div className={`w-full ${isModal ? '' : 'relative'}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-5 h-5 text-slate-400 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Search stores, brands, coupons, or promo codes..."
          className="w-full pl-12 pr-10 py-3.5 bg-white border border-slate-300 rounded-2xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent text-sm md:text-base shadow-sm"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 p-1.5 text-slate-400 hover:text-slate-600 rounded-full"
            aria-label="Clear search input"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dropdown container */}
      <div className="mt-2 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto divide-y divide-slate-100">
        {/* If no query, show recent and popular */}
        {!trimmed && (
          <div className="p-4 space-y-4">
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Recent Searches
                  </span>
                  <button
                    onClick={clearRecentSearches}
                    className="text-teal-600 hover:text-teal-700 capitalize font-medium text-[11px]"
                  >
                    Clear All
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {recentSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleSelectSearch(term)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span>{term}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                <TrendingUp className="w-3.5 h-3.5" /> Popular Searches
              </div>
              <div className="flex flex-wrap gap-1.5">
                {popularSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectSearch(term)}
                    className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-50 hover:bg-teal-50 hover:text-teal-800 border border-slate-200/70 rounded-lg transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* When user typed something */}
        {trimmed && (
          <div>
            {/* View all button */}
            <div className="p-3 bg-slate-50 border-b border-slate-100">
              <button
                onClick={() => handleSelectSearch(trimmed)}
                className="w-full flex items-center justify-between text-xs font-semibold text-teal-700 hover:text-teal-800"
              >
                <span>Search all results for &ldquo;{trimmed}&rdquo;</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Merchants */}
            {matchedMerchants.length > 0 && (
              <div className="p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <ShoppingBag className="w-3.5 h-3.5" /> Stores ({matchedMerchants.length})
                </div>
                <div className="space-y-1">
                  {matchedMerchants.map((merchant) => (
                    <button
                      key={merchant.id}
                      onClick={() => {
                        saveRecentSearch(merchant.name);
                        if (onClose) onClose();
                        onNavigate(`/stores/${merchant.slug}`);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={merchant.logo}
                          alt={merchant.name}
                          className="w-8 h-8 rounded-lg object-cover border border-slate-200 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <div className="text-sm font-semibold text-slate-900 group-hover:text-teal-700">
                            {merchant.name}
                          </div>
                          <div className="text-xs text-slate-500">{merchant.domain}</div>
                        </div>
                      </div>
                      <div className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                        {merchant.bestDiscount}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Coupons */}
            {matchedCoupons.length > 0 && (
              <div className="p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Tag className="w-3.5 h-3.5" /> Promo Codes ({matchedCoupons.length})
                </div>
                <div className="space-y-1.5">
                  {matchedCoupons.map((coupon) => (
                    <button
                      key={coupon.id}
                      onClick={() => {
                        saveRecentSearch(coupon.title);
                        if (onClose) onClose();
                        onNavigate(`/stores/${coupon.merchantSlug || 'hostinger'}`);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                    >
                      <div className="flex items-center gap-2.5 truncate mr-2">
                        <span className="text-xs font-mono font-bold bg-slate-100 border border-slate-200 px-2 py-1 rounded text-slate-800 shrink-0">
                          {coupon.code}
                        </span>
                        <div className="truncate">
                          <div className="text-xs font-medium text-slate-800 group-hover:text-teal-700 truncate">
                            {coupon.title}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-1">
                            <span>{coupon.merchantName}</span>
                            {coupon.verificationStatus === 'TESTED' && (
                              <span className="text-emerald-700 font-medium inline-flex items-center gap-0.5">
                                <ShieldCheck className="w-3 h-3 text-emerald-600" /> Tested
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-emerald-700 shrink-0">{coupon.discountValue}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Deals */}
            {matchedDeals.length > 0 && (
              <div className="p-3">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5" /> Deals ({matchedDeals.length})
                </div>
                <div className="space-y-1">
                  {matchedDeals.map((deal) => (
                    <button
                      key={deal.id}
                      onClick={() => {
                        saveRecentSearch(deal.title);
                        if (onClose) onClose();
                        onNavigate(`/deals/${deal.slug}`);
                      }}
                      className="w-full flex items-center justify-between p-2 rounded-xl hover:bg-slate-100 transition-colors text-left group"
                    >
                      <span className="text-xs font-medium text-slate-800 truncate mr-2 group-hover:text-teal-700">
                        {deal.title}
                      </span>
                      <div className="text-xs shrink-0 font-semibold">
                        <span className="text-emerald-700">${deal.salePrice.toFixed(2)}</span>
                        <span className="text-slate-400 line-through ml-1.5 text-[11px]">
                          ${deal.originalPrice.toFixed(2)}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {!hasResults && (
              <div className="p-6 text-center text-slate-500 text-sm">
                No exact match found for &ldquo;{trimmed}&rdquo;.
                <div className="mt-2">
                  <button
                    onClick={() => handleSelectSearch(trimmed)}
                    className="text-teal-700 font-semibold hover:underline"
                  >
                    View global search results &rarr;
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
