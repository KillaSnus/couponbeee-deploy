import React from 'react';
import { BookOpen, Clock, User, ChevronRight, Tag, ShieldCheck } from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon } from '../../types';
import { CouponCard } from '../cards/CouponCard';

interface BlogPageProps {
  slug?: string;
  onNavigate: (path: string) => void;
  onGetCode: (coupon: Coupon) => void;
  onReportCoupon: (coupon: Coupon) => void;
}

export const BlogPage: React.FC<BlogPageProps> = ({
  slug,
  onNavigate,
  onGetCode,
  onReportCoupon,
}) => {
  const blogPosts = db.getBlogPosts();
  const merchants = db.getMerchants();
  const coupons = db.getCoupons();

  if (slug) {
    const post = blogPosts.find((p) => p.slug === slug);
    if (!post) {
      return (
        <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Article Not Found</h1>
          <button
            onClick={() => onNavigate('/blog')}
            className="px-5 py-2.5 bg-teal-600 text-white rounded-xl text-sm font-semibold"
          >
            Return to Savings Guides
          </button>
        </div>
      );
    }

    const relatedMerchantsList = merchants.filter((m) => post.relatedMerchants.includes(m.id));
    const relatedCouponsList = coupons.filter((c) => post.relatedMerchants.includes(c.merchantId)).slice(0, 3);

    return (
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-500">
          <button onClick={() => onNavigate('/')} className="hover:text-slate-900 transition-colors">
            Home
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <button onClick={() => onNavigate('/blog')} className="hover:text-slate-900 transition-colors">
            Savings Guides
          </button>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-semibold text-slate-800 truncate max-w-xs">{post.title}</span>
        </nav>

        {/* Article Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-bold text-teal-700">{post.category}</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {post.readingTime}
            </span>
            <span>·</span>
            <span>Published {new Date(post.publishDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
            <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center text-sm">
              {post.authorName.charAt(0)}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900">{post.authorName}</div>
              <div className="text-[11px] text-slate-500">{post.authorRole}</div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="aspect-[16/9] rounded-3xl overflow-hidden bg-slate-100 border border-slate-200">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Article Body */}
        <div className="prose prose-slate max-w-none text-sm sm:text-base leading-relaxed space-y-5 text-slate-700">
          {post.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={idx} className="text-lg font-bold text-slate-900 pt-3">
                  {paragraph.replace('### ', '')}
                </h3>
              );
            }
            if (paragraph.startsWith('* ')) {
              return (
                <ul key={idx} className="list-disc pl-5 space-y-1">
                  <li>{paragraph.replace('* ', '')}</li>
                </ul>
              );
            }
            return <p key={idx}>{paragraph}</p>;
          })}
        </div>

        {/* Related Stores Mentioned in Guide */}
        {relatedMerchantsList.length > 0 && (
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-200/90 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Stores Analyzed in This Guide
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedMerchantsList.map((m) => (
                <button
                  key={m.id}
                  onClick={() => onNavigate(`/stores/${m.slug}`)}
                  className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 hover:border-teal-500 transition-colors text-left"
                >
                  <div className="flex items-center gap-2.5">
                    <img src={m.logo} alt={m.name} className="w-8 h-8 rounded-lg object-contain" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-slate-400">{m.couponCount} Active Codes</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-teal-700">{m.bestDiscount}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Related Coupons */}
        {relatedCouponsList.length > 0 && (
          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-bold text-slate-900">
              Verified Coupons for Mentioned Stores
            </h3>
            <div className="space-y-4">
              {relatedCouponsList.map((coupon) => (
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
        )}
      </article>
    );
  }

  // Blog Directory
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200/80 text-teal-800 text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5 text-teal-600" />
          <span>Independent Shopping Research</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Savings Guides, Coupon Traps &amp; Price Analysis
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Factual articles written by our research team examining checkout psychology, contract renewals, student programs, and honest markdown strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {blogPosts.map((post) => (
          <div
            key={post.id}
            onClick={() => onNavigate(`/blog/${post.slug}`)}
            className="bg-white rounded-3xl border border-slate-200/90 hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col cursor-pointer group"
          >
            <div className="aspect-[16/9] overflow-hidden bg-slate-100">
              <img
                src={post.featuredImage}
                alt={post.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 text-xs text-slate-500 mb-1.5">
                  <span className="font-bold text-teal-700">{post.category}</span>
                  <span>·</span>
                  <span>{post.readingTime}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-teal-700 transition-colors leading-snug">
                  {post.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 mt-2 leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  {post.authorName}
                </span>
                <span className="text-teal-700 font-bold group-hover:underline">
                  Read Article &rarr;
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
