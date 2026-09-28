import React, { useState, useEffect } from 'react';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { SearchBar } from './components/common/SearchBar';
import { CouponCodeModal } from './components/modals/CouponCodeModal';
import { ReportCouponModal } from './components/modals/ReportCouponModal';
import { SubmitCouponModal } from './components/modals/SubmitCouponModal';

import { HomePage } from './components/pages/HomePage';
import { StoresPage } from './components/pages/StoresPage';
import { StoreDetailPage } from './components/pages/StoreDetailPage';
import { CouponsPage } from './components/pages/CouponsPage';
import { DealsPage } from './components/pages/DealsPage';
import { CategoriesPage } from './components/pages/CategoriesPage';
import { SearchPage } from './components/pages/SearchPage';
import { BlogPage } from './components/pages/BlogPage';
import { LegalPage } from './components/pages/LegalPage';
import { RedirectPage } from './components/pages/RedirectPage';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminMerchants } from './components/admin/AdminMerchants';
import { AdminCoupons } from './components/admin/AdminCoupons';
import { AdminDeals } from './components/admin/AdminDeals';
import { AdminVerification } from './components/admin/AdminVerification';
import { AdminImport } from './components/admin/AdminImport';
import { AdminReports } from './components/admin/AdminReports';
import { AdminAnalytics } from './components/admin/AdminAnalytics';
import { AdminSettings } from './components/admin/AdminSettings';
import { AdminLogs } from './components/admin/AdminLogs';

import { Coupon, Deal } from './types';
import { db } from './lib/db';
import { updatePageSEO } from './lib/seo';
import { X } from 'lucide-react';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname || '/';
    }
    return '/';
  });

  const [activeCodeCoupon, setActiveCodeCoupon] = useState<Coupon | null>(null);
  const [reportingCoupon, setReportingCoupon] = useState<Coupon | null>(null);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [submitDefaultMerchant, setSubmitDefaultMerchant] = useState('');
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  // Subscribe to db state updates
  useEffect(() => {
    const unsubscribe = db.subscribe(() => {
      // Force re-render on database state modifications
      setCurrentPath((p) => p);
    });
    return unsubscribe;
  }, []);

  // Handle browser popstate
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Keyboard shortcut for Cmd+K search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentPath(path);
    if (typeof window !== 'undefined' && window.history) {
      window.history.pushState({}, '', path);
    }
  };

  // Handle Get Code click
  const handleGetCode = (coupon: Coupon) => {
    // 1. Record click in database
    db.recordClick(
      'coupon',
      coupon.id,
      coupon.title,
      coupon.merchantId,
      coupon.merchantName || 'Merchant',
      coupon.affiliateUrl || coupon.landingUrl
    );

    // 2. Open destination store in new tab
    const targetUrl = coupon.affiliateUrl || coupon.landingUrl;
    if (targetUrl) {
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
    }

    // 3. Open accessible code reveal modal in current tab
    setActiveCodeCoupon(coupon);
  };

  // Handle Get Deal click
  const handleGetDeal = (deal: Deal) => {
    db.recordClick(
      'deal',
      deal.id,
      deal.title,
      deal.merchantId,
      deal.merchantName || 'Merchant',
      deal.dealUrl
    );
    window.open(deal.dealUrl, '_blank', 'noopener,noreferrer');
  };

  // Dynamic SEO meta tags per route
  useEffect(() => {
    if (currentPath.startsWith('/admin')) {
      updatePageSEO({
        title: 'Editorial CMS Admin',
        description: 'Biorals editorial control console for coupon testing and merchant management.',
      });
      return;
    }

    if (currentPath === '/') {
      updatePageSEO({
        title: 'Verified Coupons, Promo Codes & Genuine Deals',
        description: 'Discover tested discount codes, authentic promotional coupons, and verified merchant deals curated with genuine test logs and transparency.',
      });
    } else if (currentPath === '/stores') {
      updatePageSEO({
        title: 'Stores & Merchants Directory',
        description: 'Complete directory of 1,000+ verified partner merchants with tested discount codes.',
      });
    } else if (currentPath.startsWith('/stores/')) {
      const slug = currentPath.replace('/stores/', '');
      const m = db.getMerchantBySlug(slug);
      if (m) {
        updatePageSEO({
          title: m.seoTitle || `${m.name} Promo Codes & Verified Coupons`,
          description: m.seoDescription || `Save with tested ${m.name} discount coupons.`,
          canonicalUrl: m.canonicalUrl,
        });
      }
    } else if (currentPath === '/coupons') {
      updatePageSEO({
        title: 'Verified Active Coupons & Promo Codes',
        description: 'Tested discount codes with factual checkout verification logs.',
      });
    } else if (currentPath === '/deals') {
      updatePageSEO({
        title: "Today's Verified Deals & Price Drops",
        description: 'Authentic price reductions and clearance markdowns checked against current merchant prices.',
      });
    } else if (currentPath === '/categories') {
      updatePageSEO({
        title: 'Browse Stores by Category',
        description: 'Shop coupons and deals across tech, software, hosting, fashion, and home.',
      });
    } else if (currentPath === '/blog') {
      updatePageSEO({
        title: 'Savings Guides & Price Research',
        description: 'Independent editorial advice on shopping strategies, student discounts, and renewal pricing.',
      });
    }
  }, [currentPath]);

  // Route Router Logic
  const renderRoute = () => {
    // Admin routes
    if (currentPath.startsWith('/admin')) {
      let adminComponent = <AdminDashboard onNavigate={navigate} />;

      if (currentPath === '/admin/stores') adminComponent = <AdminMerchants />;
      else if (currentPath === '/admin/coupons') adminComponent = <AdminCoupons />;
      else if (currentPath === '/admin/deals') adminComponent = <AdminDeals />;
      else if (currentPath === '/admin/verification') adminComponent = <AdminVerification />;
      else if (currentPath === '/admin/import') adminComponent = <AdminImport />;
      else if (currentPath === '/admin/reports') adminComponent = <AdminReports />;
      else if (currentPath === '/admin/analytics') adminComponent = <AdminAnalytics />;
      else if (currentPath === '/admin/settings' || currentPath === '/admin/affiliate-links') adminComponent = <AdminSettings />;
      else if (currentPath === '/admin/logs') adminComponent = <AdminLogs />;

      return (
        <AdminLayout currentPath={currentPath} onNavigate={navigate}>
          {adminComponent}
        </AdminLayout>
      );
    }

    // Public Routes
    if (currentPath === '/') {
      return (
        <HomePage
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onGetDeal={handleGetDeal}
          onReportCoupon={(c) => setReportingCoupon(c)}
        />
      );
    }

    if (currentPath === '/stores') {
      return <StoresPage onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/stores/')) {
      const slug = currentPath.replace('/stores/', '');
      return (
        <StoreDetailPage
          slug={slug}
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onGetDeal={handleGetDeal}
          onReportCoupon={(c) => setReportingCoupon(c)}
          onOpenSubmitModal={(mName) => {
            setSubmitDefaultMerchant(mName);
            setSubmitModalOpen(true);
          }}
        />
      );
    }

    if (currentPath === '/coupons') {
      return (
        <CouponsPage
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onReportCoupon={(c) => setReportingCoupon(c)}
        />
      );
    }

    if (currentPath.startsWith('/coupons/')) {
      // In coupons/[slug], redirect or show dedicated store page
      const couponSlug = currentPath.replace('/coupons/', '');
      const targetCoupon = db.getCoupons().find((c) => c.slug === couponSlug);
      if (targetCoupon && targetCoupon.merchantSlug) {
        return (
          <StoreDetailPage
            slug={targetCoupon.merchantSlug}
            onNavigate={navigate}
            onGetCode={handleGetCode}
            onGetDeal={handleGetDeal}
            onReportCoupon={(c) => setReportingCoupon(c)}
            onOpenSubmitModal={(mName) => {
              setSubmitDefaultMerchant(mName);
              setSubmitModalOpen(true);
            }}
          />
        );
      }
      return <CouponsPage onNavigate={navigate} onGetCode={handleGetCode} onReportCoupon={(c) => setReportingCoupon(c)} />;
    }

    if (currentPath === '/deals') {
      return <DealsPage onNavigate={navigate} onGetDeal={handleGetDeal} />;
    }

    if (currentPath.startsWith('/deals/')) {
      return <DealsPage onNavigate={navigate} onGetDeal={handleGetDeal} />;
    }

    if (currentPath === '/categories') {
      return (
        <CategoriesPage
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onReportCoupon={(c) => setReportingCoupon(c)}
        />
      );
    }

    if (currentPath.startsWith('/categories/')) {
      const catSlug = currentPath.replace('/categories/', '');
      return (
        <CategoriesPage
          slug={catSlug}
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onReportCoupon={(c) => setReportingCoupon(c)}
        />
      );
    }

    if (currentPath.startsWith('/search')) {
      const searchParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
      const initialQuery = searchParams ? searchParams.get('q') || '' : '';
      return (
        <SearchPage
          initialQuery={initialQuery}
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onGetDeal={handleGetDeal}
          onReportCoupon={(c) => setReportingCoupon(c)}
        />
      );
    }

    if (currentPath === '/blog') {
      return (
        <BlogPage
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onReportCoupon={(c) => setReportingCoupon(c)}
        />
      );
    }

    if (currentPath.startsWith('/blog/')) {
      const postSlug = currentPath.replace('/blog/', '');
      return (
        <BlogPage
          slug={postSlug}
          onNavigate={navigate}
          onGetCode={handleGetCode}
          onReportCoupon={(c) => setReportingCoupon(c)}
        />
      );
    }

    if (
      currentPath === '/about' ||
      currentPath === '/contact' ||
      currentPath === '/affiliate-disclosure' ||
      currentPath === '/privacy' ||
      currentPath === '/terms' ||
      currentPath === '/cookie-policy' ||
      currentPath === '/submit-coupon' ||
      currentPath === '/report-coupon'
    ) {
      const pageType = currentPath.replace('/', '') as any;
      return <LegalPage pageType={pageType} onNavigate={navigate} />;
    }

    if (currentPath.startsWith('/go/')) {
      const id = currentPath.replace('/go/', '');
      return <RedirectPage id={id} onNavigate={navigate} />;
    }

    // Default Fallback: Home
    return (
      <HomePage
        onNavigate={navigate}
        onGetCode={handleGetCode}
        onGetDeal={handleGetDeal}
        onReportCoupon={(c) => setReportingCoupon(c)}
      />
    );
  };

  const isAdminRoute = currentPath.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Show Public Header only if not on Admin */}
      {!isAdminRoute && (
        <Header
          currentPath={currentPath}
          onNavigate={navigate}
          onOpenSearch={() => setSearchModalOpen(true)}
        />
      )}

      {/* Main Content View */}
      <main className="flex-1">{renderRoute()}</main>

      {/* Show Public Footer and Mobile Bottom Navigation if not on Admin */}
      {!isAdminRoute && (
        <>
          <Footer onNavigate={navigate} />
          <MobileBottomNav currentPath={currentPath} onNavigate={navigate} />
        </>
      )}

      {/* Code Reveal Modal */}
      <CouponCodeModal
        coupon={activeCodeCoupon}
        onClose={() => setActiveCodeCoupon(null)}
        onReport={(c) => {
          setActiveCodeCoupon(null);
          setReportingCoupon(c);
        }}
      />

      {/* Report Coupon Modal */}
      <ReportCouponModal
        coupon={reportingCoupon}
        onClose={() => setReportingCoupon(null)}
      />

      {/* Community Submit Coupon Modal */}
      <SubmitCouponModal
        isOpen={submitModalOpen}
        defaultMerchantName={submitDefaultMerchant}
        onClose={() => {
          setSubmitModalOpen(false);
          setSubmitDefaultMerchant('');
        }}
      />

      {/* Global Quick Search Overlay Modal */}
      {searchModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl relative border border-slate-200">
            <button
              onClick={() => setSearchModalOpen(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Quick Search (Esc to close)
            </div>
            <SearchBar
              isModal={true}
              onNavigate={(path) => {
                setSearchModalOpen(false);
                navigate(path);
              }}
              onClose={() => setSearchModalOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
