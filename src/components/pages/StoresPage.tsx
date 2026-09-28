import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Tag, Flame } from 'lucide-react';
import { db } from '../../lib/db';
import { MerchantCard } from '../cards/MerchantCard';

interface StoresPageProps {
  onNavigate: (path: string) => void;
}

export const StoresPage: React.FC<StoresPageProps> = ({ onNavigate }) => {
  const merchants = db.getMerchants();
  const categories = db.getCategories();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<string>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [onlyWithCoupons, setOnlyWithCoupons] = useState(false);
  const [onlyWithDeals, setOnlyWithDeals] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 12;

  const alphabet = ['ALL', '#', ...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')];

  const countries = useMemo(() => {
    const set = new Set<string>();
    merchants.forEach((m) => {
      m.countries.forEach((c) => set.add(c));
    });
    return ['ALL', ...Array.from(set)];
  }, [merchants]);

  const filteredMerchants = useMemo(() => {
    return merchants.filter((m) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = m.name.toLowerCase().includes(q);
        const matchDomain = m.domain.toLowerCase().includes(q);
        if (!matchName && !matchDomain) return false;
      }

      // Letter
      if (selectedLetter !== 'ALL') {
        const firstChar = m.name.charAt(0).toUpperCase();
        if (selectedLetter === '#') {
          if (!/[0-9]/.test(firstChar)) return false;
        } else if (firstChar !== selectedLetter) {
          return false;
        }
      }

      // Category
      if (selectedCategory !== 'ALL') {
        if (!m.categories.includes(selectedCategory)) return false;
      }

      // Country
      if (selectedCountry !== 'ALL') {
        if (!m.countries.includes(selectedCountry) && m.country !== selectedCountry) return false;
      }

      // Only with coupons
      if (onlyWithCoupons && m.couponCount <= 0) return false;

      // Only with deals
      if (onlyWithDeals && m.dealCount <= 0) return false;

      return true;
    });
  }, [
    merchants,
    searchQuery,
    selectedLetter,
    selectedCategory,
    selectedCountry,
    onlyWithCoupons,
    onlyWithDeals,
  ]);

  const totalPages = Math.ceil(filteredMerchants.length / ITEMS_PER_PAGE) || 1;
  const paginated = filteredMerchants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Store &amp; Merchant Directory
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Browse our complete catalog of verified merchant partners. Filter by category, country, or alphabetical initial to find verified discount codes.
        </p>
      </div>

      {/* Alphabetical Quick Bar */}
      <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-none text-xs border-b border-slate-200">
        {alphabet.map((char) => (
          <button
            key={char}
            onClick={() => {
              setSelectedLetter(char);
              setCurrentPage(1);
            }}
            className={`min-w-[32px] h-8 px-2 rounded-lg font-semibold transition-colors shrink-0 flex items-center justify-center ${
              selectedLetter === char
                ? 'bg-teal-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {char}
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search store name..."
              className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 text-slate-700 font-medium"
            >
              <option value="ALL">All Categories</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Country Dropdown */}
          <div>
            <select
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500 text-slate-700 font-medium"
            >
              <option value="ALL">All Regions / Countries</option>
              {countries.filter((c) => c !== 'ALL').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyWithCoupons}
                onChange={(e) => {
                  setOnlyWithCoupons(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <Tag className="w-3.5 h-3.5 text-teal-600" />
              <span>With Coupons</span>
            </label>

            <label className="flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyWithDeals}
                onChange={(e) => {
                  setOnlyWithDeals(e.target.checked);
                  setCurrentPage(1);
                }}
                className="rounded border-slate-300 text-teal-600 focus:ring-teal-500"
              />
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>With Deals</span>
            </label>
          </div>
        </div>

        {/* Results Count & Reset */}
        <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
          <span>
            Showing <strong className="text-slate-800">{filteredMerchants.length}</strong> matching stores
          </span>

          {(selectedLetter !== 'ALL' ||
            selectedCategory !== 'ALL' ||
            selectedCountry !== 'ALL' ||
            searchQuery ||
            onlyWithCoupons ||
            onlyWithDeals) && (
            <button
              onClick={() => {
                setSelectedLetter('ALL');
                setSelectedCategory('ALL');
                setSelectedCountry('ALL');
                setSearchQuery('');
                setOnlyWithCoupons(false);
                setOnlyWithDeals(false);
                setCurrentPage(1);
              }}
              className="text-teal-700 font-semibold hover:underline"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Merchant Cards Grid */}
      {paginated.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {paginated.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} onNavigate={onNavigate} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <SlidersHorizontal className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No stores match your selected criteria</h3>
          <p className="text-xs text-slate-500">
            Try resetting your filters or adjusting your search term.
          </p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-600 px-2 font-medium">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};
