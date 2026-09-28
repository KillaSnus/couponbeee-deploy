import React from 'react';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  Sparkles,
  Server,
  Layers,
  Cpu,
  ShoppingBag,
  GraduationCap,
  Home as HomeIcon,
  CheckCircle2,
  ChevronRight,
  HelpCircle,
  Clock,
} from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon, Deal } from '../../types';
import { CouponCard } from '../cards/CouponCard';
import { DealCard } from '../cards/DealCard';
import { MerchantCard } from '../cards/MerchantCard';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onGetCode: (coupon: Coupon) => void;
  onGetDeal: (deal: Deal) => void;
  onReportCoupon: (coupon: Coupon) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onGetCode,
  onGetDeal,
  onReportCoupon,
}) => {
  const merchants = db.getMerchants();
  const coupons = db.getCoupons();
  const deals = db.getDeals();
  const categories = db.getCategories();
  const blogPosts = db.getBlogPosts();

  const verifiedCoupons = coupons
    .filter((c) => c.verificationStatus === 'TESTED' && c.status === 'active')
    .slice(0, 4);

  const featuredDeals = deals.filter((d) => d.active).slice(0, 3);
  const trendingStores = merchants.filter((m) => m.featured).slice(0, 6);

  const categoryIconMap: Record<string, React.ReactNode> = {
    'cat-hosting': <Server className="w-5 h-5 text-teal-600" />,
    'cat-software': <Layers className="w-5 h-5 text-indigo-600" />,
    'cat-electronics': <Cpu className="w-5 h-5 text-amber-600" />,
    'cat-fashion': <ShoppingBag className="w-5 h-5 text-rose-600" />,
    'cat-education': <GraduationCap className="w-5 h-5 text-blue-600" />,
    'cat-home': <HomeIcon className="w-5 h-5 text-emerald-600" />,
  };

  const faqs = [
    {
      q: 'How does Biorals verify coupons and discount codes?',
      a: 'Unlike algorithmic scrapers, our editorial team manually tests promo codes in live checkout shopping carts. We verify whether discounts actually deduct before checkout, check minimum cart spends, and publish the exact date and test notes.',
    },
    {
      q: 'Why does Biorals show "Tested on [date]" instead of "100% working"?',
      a: 'Merchants frequently alter coupon availability, pause campaigns, or limit redemption caps without advance notice. We provide factual test timestamps rather than false certainty, giving you genuine insight into offer freshness.',
    },
    {
      q: 'Does Biorals earn money when I use coupons?',
      a: 'Yes. Biorals participates in authorized affiliate programs. When you click our outbound links or redeem promo codes, we may earn an affiliate commission at zero additional cost to you. This funds our manual testing desk.',
    },
    {
      q: 'What should I do if a code fails at checkout?',
      a: 'Click the "Report" button on any coupon card. Our test team receives immediate notification to re-evaluate the code in the cart and update its status to Expired or Needs Review.',
    },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        {/* Subtle Geometric Background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#14b8a6_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative max-w-4xl mx-auto text-center space-y-6">
          {/* Trust Banner */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-950/80 border border-teal-500/30 text-teal-300 text-xs font-semibold shadow-inner">
            <ShieldCheck className="w-4 h-4 text-teal-400" />
            <span>Editorial Truth Standard · Manual Checkout Testing</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white max-w-3xl mx-auto leading-[1.1] text-balance">
            Find Coupons &amp; Deals That Help You Save
          </h1>

          {/* Subtitle */}
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Stop wasting time with expired codes and fabricated percentages. Biorals logs real checkout tests for 1,000+ top software, hosting, tech, and retail brands.
          </p>

          {/* Prominent Search Bar Trigger */}
          <div className="pt-2 max-w-2xl mx-auto">
            <div
              onClick={() => onNavigate('/search')}
              className="w-full flex items-center justify-between p-2 pl-4 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl cursor-pointer hover:bg-white transition-all border border-white/20 group text-slate-800"
            >
              <div className="flex items-center gap-3 text-slate-400 group-hover:text-slate-600 transition-colors truncate">
                <Search className="w-5 h-5 text-teal-600 shrink-0" />
                <span className="text-sm sm:text-base text-slate-500 truncate">
                  Search stores, brands, products or coupon codes...
                </span>
              </div>
              <button
                type="button"
                className="px-5 py-2.5 bg-teal-600 group-hover:bg-teal-700 text-white font-bold rounded-xl text-xs sm:text-sm transition-colors shrink-0 shadow-sm"
              >
                Search
              </button>
            </div>

            {/* Quick Suggestions below search */}
            <div className="flex items-center justify-center gap-2 pt-3 text-xs text-slate-400 flex-wrap">
              <span className="text-slate-500">Popular:</span>
              {['Hostinger', 'Nike', 'DigitalOcean', 'Notion', 'Coursera'].map((term) => (
                <button
                  key={term}
                  onClick={() => onNavigate(`/search?q=${encodeURIComponent(term)}`)}
                  className="hover:text-white transition-colors underline-offset-2 hover:underline"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() => onNavigate('/deals')}
              className="px-6 py-3 bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm rounded-xl transition-all shadow-md flex items-center gap-2"
            >
              <span>Find Deals</span>
              <ArrowRight className="w-4 h-4 text-teal-600" />
            </button>
            <button
              onClick={() => onNavigate('/stores')}
              className="px-6 py-3 bg-slate-800/80 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm rounded-xl transition-all"
            >
              Browse Stores
            </button>
          </div>
        </div>
      </section>

      {/* Trust Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-6 grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Tested in Live Carts</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                We test codes directly in shopping carts and document the resulting discount before publication.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 md:pl-6 pt-4 md:pt-0">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 shrink-0">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Transparent Test Timestamps</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                See exact dates when our analysts verified functionality instead of ambiguous &ldquo;100% working&rdquo; claims.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 md:pl-6 pt-4 md:pt-0">
            <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-700 shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Source Traceability</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Direct merchant partnerships, authorized affiliate feeds, and verified subscriber newsletters.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Stores */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Trending Stores
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Popular merchants with verified active discounts this week
            </p>
          </div>
          <button
            onClick={() => onNavigate('/stores')}
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Stores</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {trendingStores.map((merchant) => (
            <MerchantCard key={merchant.id} merchant={merchant} onNavigate={onNavigate} />
          ))}
        </div>
      </section>

      {/* Popular Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Explore Popular Categories
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Browse discounts across curated non-restricted merchant sectors
            </p>
          </div>
          <button
            onClick={() => onNavigate('/categories')}
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>All Categories</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate(`/categories/${cat.slug}`)}
              className="bg-white p-4 rounded-2xl border border-slate-200/80 hover:border-teal-500 hover:shadow-md transition-all cursor-pointer text-center flex flex-col items-center justify-center space-y-2 group"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform">
                {categoryIconMap[cat.id] || <ShoppingBag className="w-5 h-5 text-teal-600" />}
              </div>
              <h3 className="text-xs font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-tight">
                {cat.name}
              </h3>
              <span className="text-[11px] text-slate-400">{cat.activeCouponCount} Offers</span>
            </div>
          ))}
        </div>
      </section>

      {/* Verified / Tested Coupons */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1 border border-emerald-100">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>FRESHLY TESTED IN CHECKOUT</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Verified Coupons
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Tested on live checkout carts with verified reduction amounts
            </p>
          </div>
          <button
            onClick={() => onNavigate('/coupons')}
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>View All Codes</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          {verifiedCoupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onGetCode={onGetCode}
              onReport={onReportCoupon}
              onNavigateToMerchant={(slug) => onNavigate(`/stores/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* Today's Deals */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 text-[11px] font-bold px-2.5 py-0.5 rounded-full mb-1 border border-amber-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>PRICE DROPS</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Today&apos;s Featured Deals
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Legitimate price markdowns checked against current merchant prices
            </p>
          </div>
          <button
            onClick={() => onNavigate('/deals')}
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>All Deals</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featuredDeals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              onGetDeal={onGetDeal}
              onNavigateToMerchant={(slug) => onNavigate(`/stores/${slug}`)}
            />
          ))}
        </div>
      </section>

      {/* Savings Guides & Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Savings Guides &amp; Editorial Research
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              In-depth analysis of renewal pricing, student discounts, and shopping strategies
            </p>
          </div>
          <button
            onClick={() => onNavigate('/blog')}
            className="text-xs sm:text-sm font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1"
          >
            <span>All Guides</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onNavigate(`/blog/${post.slug}`)}
              className="bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col sm:flex-row cursor-pointer group"
            >
              <div className="sm:w-2/5 aspect-[4/3] sm:aspect-auto overflow-hidden bg-slate-100">
                <img
                  src={post.featuredImage}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="p-5 sm:w-3/5 flex flex-col justify-between space-y-2">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-1">
                    <span className="font-semibold text-teal-700">{post.category}</span>
                    <span>·</span>
                    <span>{post.readingTime}</span>
                  </div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                    {post.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
                    {post.excerpt}
                  </p>
                </div>
                <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-100">
                  <span>By {post.authorName}</span>
                  <span className="text-teal-700 font-bold group-hover:underline">Read Guide &rarr;</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Frequently Asked Questions (FAQ) with Schema.org readiness */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-2 rounded-xl bg-teal-50 text-teal-700 mb-2">
            <HelpCircle className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            How we maintain data accuracy, verify codes, and sustain operations
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs">
              <h3 className="text-sm font-bold text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
