import React, { useState } from 'react';
import {
  ShieldCheck,
  Tag,
  Flame,
  ExternalLink,
  Clock,
  HelpCircle,
  Lightbulb,
  FileText,
  Mail,
  Phone,
  ChevronRight,
  PlusCircle,
} from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon, Deal } from '../../types';
import { CouponCard } from '../cards/CouponCard';
import { DealCard } from '../cards/DealCard';

interface StoreDetailPageProps {
  slug: string;
  onNavigate: (path: string) => void;
  onGetCode: (coupon: Coupon) => void;
  onGetDeal: (deal: Deal) => void;
  onReportCoupon: (coupon: Coupon) => void;
  onOpenSubmitModal: (merchantName: string) => void;
}

export const StoreDetailPage: React.FC<StoreDetailPageProps> = ({
  slug,
  onNavigate,
  onGetCode,
  onGetDeal,
  onReportCoupon,
  onOpenSubmitModal,
}) => {
  const merchant = db.getMerchantBySlug(slug);
  const allCoupons = db.getCouponsByMerchant(merchant?.id || '');
  const allDeals = db.getDealsByMerchant(merchant?.id || '');
  const allMerchants = db.getMerchants();
  const allCategories = db.getCategories();

  const [activeTab, setActiveTab] = useState<'all' | 'coupons' | 'deals' | 'verified' | 'popular'>('all');

  if (!merchant) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-800">Store Not Found</h1>
        <p className="text-sm text-slate-500">
          The requested merchant could not be located in our directory.
        </p>
        <button
          onClick={() => onNavigate('/stores')}
          className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold"
        >
          Return to Store Directory
        </button>
      </div>
    );
  }

  // Filter coupons & deals according to activeTab
  const filteredCoupons = allCoupons.filter((c) => {
    if (activeTab === 'deals') return false;
    if (activeTab === 'verified') return c.verificationStatus === 'TESTED';
    if (activeTab === 'popular') return c.clickCount > 200;
    return true;
  });

  const filteredDeals = allDeals.filter(() => {
    if (activeTab === 'coupons') return false;
    if (activeTab === 'verified') return true;
    return true;
  });

  const relatedStores = allMerchants
    .filter((m) => m.id !== merchant.id && m.categories.some((c) => merchant.categories.includes(c)))
    .slice(0, 4);

  const primaryCategory = allCategories.find((c) => merchant.categories.includes(c.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
        <button onClick={() => onNavigate('/')} className="hover:text-slate-900 transition-colors">
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <button onClick={() => onNavigate('/stores')} className="hover:text-slate-900 transition-colors">
          Stores
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        {primaryCategory && (
          <>
            <button
              onClick={() => onNavigate(`/categories/${primaryCategory.slug}`)}
              className="hover:text-slate-900 transition-colors"
            >
              {primaryCategory.name}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          </>
        )}
        <span className="font-semibold text-slate-800">{merchant.name}</span>
      </nav>

      {/* Merchant Header Hero */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Logo */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl border border-slate-100 bg-white p-2.5 flex items-center justify-center shadow-xs overflow-hidden shrink-0">
              <img
                src={merchant.logo}
                alt={`${merchant.name} logo`}
                className="w-full h-full object-contain"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Info */}
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {merchant.name} Promo Codes &amp; Coupons
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-800 text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Verified Merchant
                </span>
              </div>

              <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                {merchant.description}
              </p>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 pt-1">
                <span className="flex items-center gap-1 font-semibold text-teal-700">
                  <Tag className="w-3.5 h-3.5" />
                  {merchant.couponCount} Active Codes
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1 font-semibold text-amber-700">
                  <Flame className="w-3.5 h-3.5" />
                  {merchant.dealCount} Deals
                </span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  Updated {new Date(merchant.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Best Discount Card & Outbound Link */}
          <div className="shrink-0 w-full md:w-auto flex flex-row md:flex-col items-center md:items-end justify-between gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
            <div className="text-left md:text-right">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Best Available Discount
              </span>
              <span className="text-2xl sm:text-3xl font-black text-teal-700 tracking-tight leading-tight">
                {merchant.bestDiscount}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={merchant.affiliateUrl || `https://${merchant.domain}`}
                target="_blank"
                rel="sponsored nofollow noopener"
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <span>Visit {merchant.domain}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => onOpenSubmitModal(merchant.name)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200/80 text-slate-700 rounded-xl text-xs font-semibold"
                title="Submit a code for this store"
              >
                <PlusCircle className="w-4 h-4 text-teal-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Offers & Tabs (2 cols on lg) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Navigation Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl overflow-x-auto text-xs font-semibold">
            {[
              { id: 'all', label: `All Offers (${allCoupons.length + allDeals.length})` },
              { id: 'coupons', label: `Coupons (${allCoupons.length})` },
              { id: 'deals', label: `Deals (${allDeals.length})` },
              { id: 'verified', label: 'Verified / Tested' },
              { id: 'popular', label: 'Popular' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-white text-slate-900 shadow-xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Active Coupons List */}
          {filteredCoupons.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Active Coupon Codes ({filteredCoupons.length})</span>
                <span className="text-teal-700 font-semibold normal-case">
                  Click &ldquo;Get Code&rdquo; to test &amp; reveal
                </span>
              </div>
              {filteredCoupons.map((coupon) => (
                <CouponCard
                  key={coupon.id}
                  coupon={coupon}
                  onGetCode={onGetCode}
                  onReport={onReportCoupon}
                />
              ))}
            </div>
          )}

          {/* Active Deals List */}
          {filteredDeals.length > 0 && (
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                <span>Direct Price Reductions &amp; Deals ({filteredDeals.length})</span>
                <span className="text-amber-700 font-semibold normal-case">
                  No promo code required
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} onGetDeal={onGetDeal} />
                ))}
              </div>
            </div>
          )}

          {filteredCoupons.length === 0 && filteredDeals.length === 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
              <p className="text-sm font-semibold text-slate-700">
                No offers found in this category.
              </p>
              <button
                onClick={() => setActiveTab('all')}
                className="text-xs font-bold text-teal-700 hover:underline"
              >
                View all available offers
              </button>
            </div>
          )}

          {/* How to Use a Coupon at This Store */}
          {merchant.howToUseSteps && merchant.howToUseSteps.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <FileText className="w-5 h-5 text-teal-600" />
                <h2>How to Redeem a Promo Code at {merchant.name}</h2>
              </div>
              <ol className="space-y-3 text-xs sm:text-sm text-slate-600">
                {merchant.howToUseSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-teal-50 border border-teal-200 text-teal-800 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Savings Tips Section */}
          {merchant.savingsTips && merchant.savingsTips.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Lightbulb className="w-5 h-5 text-amber-500" />
                <h2>Expert Savings Tips for {merchant.name} Shoppers</h2>
              </div>
              <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                {merchant.savingsTips.map((tip, idx) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-teal-600 font-bold">•</span>
                    <span className="leading-relaxed">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: Sidebar with Merchant Details, Terms, FAQ, and Related Stores */}
        <div className="space-y-6">
          {/* Store Overview Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
              Merchant Information
            </h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Website:</span>
                <a
                  href={`https://${merchant.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-teal-700 hover:underline"
                >
                  {merchant.domain}
                </a>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-50">
                <span className="text-slate-400">Headquarters:</span>
                <span className="font-medium text-slate-700">{merchant.country}</span>
              </div>
              {merchant.customerServiceEmail && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email:
                  </span>
                  <a href={`mailto:${merchant.customerServiceEmail}`} className="font-medium text-slate-700 hover:underline">
                    {merchant.customerServiceEmail}
                  </a>
                </div>
              )}
              {merchant.customerServicePhone && (
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone:
                  </span>
                  <span className="font-medium text-slate-700">{merchant.customerServicePhone}</span>
                </div>
              )}
              <div className="flex justify-between py-1">
                <span className="text-slate-400">Supported Regions:</span>
                <span className="font-medium text-slate-700 text-right">{merchant.countries.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Terms & Conditions Notice */}
          {merchant.termsAndConditions && (
            <div className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-2">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Store Terms &amp; Restrictions
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {merchant.termsAndConditions}
              </p>
            </div>
          )}

          {/* Related Stores */}
          {relatedStores.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 space-y-3">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Alternative Stores &amp; Brands
              </h3>
              <div className="space-y-2.5">
                {relatedStores.map((rel) => (
                  <div
                    key={rel.id}
                    onClick={() => onNavigate(`/stores/${rel.slug}`)}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={rel.logo}
                        alt={rel.name}
                        className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <div className="text-xs font-bold text-slate-900 hover:text-teal-700">
                          {rel.name}
                        </div>
                        <div className="text-[11px] text-slate-400">{rel.couponCount} Codes</div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-teal-700">{rel.bestDiscount}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Affiliate Notice */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
            <strong className="text-slate-700">Affiliate Disclosure:</strong> When you purchase through {merchant.name} links and coupons on Biorals, we may earn an affiliate commission at zero additional cost to you.
          </div>
        </div>
      </div>
    </div>
  );
};
