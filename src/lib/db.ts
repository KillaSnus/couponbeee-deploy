import {
  Merchant,
  Coupon,
  Deal,
  Category,
  VerificationLog,
  CouponReport,
  AffiliateNetwork,
  BlogPost,
  ClickEvent,
  SystemStats,
  UserSubmission,
} from '../types';
import {
  INITIAL_CATEGORIES,
  INITIAL_MERCHANTS,
  INITIAL_COUPONS,
  INITIAL_DEALS,
  INITIAL_VERIFICATION_LOGS,
  INITIAL_AFFILIATE_NETWORKS,
  INITIAL_BLOG_POSTS,
  INITIAL_REPORTS,
  INITIAL_CLICKS,
} from '../data/mockData';

const STORAGE_KEYS = {
  MERCHANTS: 'biorals_merchants_v1',
  COUPONS: 'biorals_coupons_v1',
  DEALS: 'biorals_deals_v1',
  CATEGORIES: 'biorals_categories_v1',
  VERIFICATION_LOGS: 'biorals_verifications_v1',
  REPORTS: 'biorals_reports_v1',
  CLICKS: 'biorals_clicks_v1',
  NETWORKS: 'biorals_networks_v1',
  BLOG: 'biorals_blog_v1',
  SUBMISSIONS: 'biorals_submissions_v1',
};

class DataStore {
  private merchants: Merchant[] = [];
  private coupons: Coupon[] = [];
  private deals: Deal[] = [];
  private categories: Category[] = [];
  private verificationLogs: VerificationLog[] = [];
  private reports: CouponReport[] = [];
  private clicks: ClickEvent[] = [];
  private networks: AffiliateNetwork[] = [];
  private blogPosts: BlogPost[] = [];
  private submissions: UserSubmission[] = [];
  private listeners: Set<() => void> = new Set();

  constructor() {
    this.init();
  }

  private init() {
    try {
      const storedMerchants = localStorage.getItem(STORAGE_KEYS.MERCHANTS);
      this.merchants = storedMerchants ? JSON.parse(storedMerchants) : INITIAL_MERCHANTS;

      const storedCoupons = localStorage.getItem(STORAGE_KEYS.COUPONS);
      this.coupons = storedCoupons ? JSON.parse(storedCoupons) : INITIAL_COUPONS;

      const storedDeals = localStorage.getItem(STORAGE_KEYS.DEALS);
      this.deals = storedDeals ? JSON.parse(storedDeals) : INITIAL_DEALS;

      const storedCategories = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
      this.categories = storedCategories ? JSON.parse(storedCategories) : INITIAL_CATEGORIES;

      const storedLogs = localStorage.getItem(STORAGE_KEYS.VERIFICATION_LOGS);
      this.verificationLogs = storedLogs ? JSON.parse(storedLogs) : INITIAL_VERIFICATION_LOGS;

      const storedReports = localStorage.getItem(STORAGE_KEYS.REPORTS);
      this.reports = storedReports ? JSON.parse(storedReports) : INITIAL_REPORTS;

      const storedClicks = localStorage.getItem(STORAGE_KEYS.CLICKS);
      this.clicks = storedClicks ? JSON.parse(storedClicks) : INITIAL_CLICKS;

      const storedNetworks = localStorage.getItem(STORAGE_KEYS.NETWORKS);
      this.networks = storedNetworks ? JSON.parse(storedNetworks) : INITIAL_AFFILIATE_NETWORKS;

      const storedBlog = localStorage.getItem(STORAGE_KEYS.BLOG);
      this.blogPosts = storedBlog ? JSON.parse(storedBlog) : INITIAL_BLOG_POSTS;

      const storedSubs = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      this.submissions = storedSubs ? JSON.parse(storedSubs) : [];
    } catch {
      // Fallback in case of storage quota or SSR
      this.merchants = [...INITIAL_MERCHANTS];
      this.coupons = [...INITIAL_COUPONS];
      this.deals = [...INITIAL_DEALS];
      this.categories = [...INITIAL_CATEGORIES];
      this.verificationLogs = [...INITIAL_VERIFICATION_LOGS];
      this.reports = [...INITIAL_REPORTS];
      this.clicks = [...INITIAL_CLICKS];
      this.networks = [...INITIAL_AFFILIATE_NETWORKS];
      this.blogPosts = [...INITIAL_BLOG_POSTS];
      this.submissions = [];
    }
  }

  private save() {
    try {
      localStorage.setItem(STORAGE_KEYS.MERCHANTS, JSON.stringify(this.merchants));
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(this.coupons));
      localStorage.setItem(STORAGE_KEYS.DEALS, JSON.stringify(this.deals));
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(this.categories));
      localStorage.setItem(STORAGE_KEYS.VERIFICATION_LOGS, JSON.stringify(this.verificationLogs));
      localStorage.setItem(STORAGE_KEYS.REPORTS, JSON.stringify(this.reports));
      localStorage.setItem(STORAGE_KEYS.CLICKS, JSON.stringify(this.clicks));
      localStorage.setItem(STORAGE_KEYS.NETWORKS, JSON.stringify(this.networks));
      localStorage.setItem(STORAGE_KEYS.BLOG, JSON.stringify(this.blogPosts));
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(this.submissions));
    } catch (e) {
      console.warn('Storage error:', e);
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  // --- MERCHANTS ---
  public getMerchants(): Merchant[] {
    return [...this.merchants];
  }

  public getMerchantBySlug(slug: string): Merchant | undefined {
    return this.merchants.find((m) => m.slug === slug);
  }

  public getMerchantById(id: string): Merchant | undefined {
    return this.merchants.find((m) => m.id === id);
  }

  public saveMerchant(merchant: Merchant): void {
    const index = this.merchants.findIndex((m) => m.id === merchant.id);
    if (index >= 0) {
      this.merchants[index] = { ...merchant, updatedAt: new Date().toISOString() };
    } else {
      this.merchants.unshift({
        ...merchant,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }
    this.save();
  }

  public deleteMerchant(id: string): void {
    this.merchants = this.merchants.filter((m) => m.id !== id);
    this.save();
  }

  // --- COUPONS ---
  public getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  public getCouponById(id: string): Coupon | undefined {
    return this.coupons.find((c) => c.id === id);
  }

  public getCouponsByMerchant(merchantId: string): Coupon[] {
    return this.coupons
      .filter((c) => c.merchantId === merchantId)
      .sort((a, b) => b.editorialPriority - a.editorialPriority);
  }

  public saveCoupon(coupon: Coupon): void {
    // Enrich with merchant details
    const merchant = this.getMerchantById(coupon.merchantId);
    const enriched = {
      ...coupon,
      merchantName: merchant?.name || coupon.merchantName,
      merchantLogo: merchant?.logo || coupon.merchantLogo,
      merchantSlug: merchant?.slug || coupon.merchantSlug,
      updatedAt: new Date().toISOString(),
    };

    const index = this.coupons.findIndex((c) => c.id === coupon.id);
    if (index >= 0) {
      this.coupons[index] = enriched;
    } else {
      this.coupons.unshift({
        ...enriched,
        createdAt: new Date().toISOString(),
      });
    }
    this.updateMerchantCounts();
    this.save();
  }

  public deleteCoupon(id: string): void {
    this.coupons = this.coupons.filter((c) => c.id !== id);
    this.updateMerchantCounts();
    this.save();
  }

  public voteCoupon(couponId: string, helpful: boolean): void {
    const coupon = this.coupons.find((c) => c.id === couponId);
    if (coupon) {
      if (helpful) {
        coupon.helpfulCount = (coupon.helpfulCount || 0) + 1;
      } else {
        coupon.unhelpfulCount = (coupon.unhelpfulCount || 0) + 1;
      }
      this.save();
    }
  }

  // --- VERIFICATION ---
  public verifyCoupon(
    couponId: string,
    result: 'successful' | 'failed' | 'expired' | 'requires_review',
    notes: string,
    adminName: string = 'Editorial Admin',
    discountTested?: string
  ): void {
    const coupon = this.coupons.find((c) => c.id === couponId);
    if (!coupon) return;

    const now = new Date().toISOString();

    if (result === 'successful') {
      coupon.verificationStatus = 'TESTED';
      coupon.status = 'active';
      coupon.lastVerifiedAt = now;
      coupon.verificationMethod = 'manual_checkout_test';
    } else if (result === 'failed') {
      coupon.verificationStatus = 'REPORTED';
    } else if (result === 'expired') {
      coupon.verificationStatus = 'EXPIRED';
      coupon.status = 'expired';
    } else if (result === 'requires_review') {
      coupon.verificationStatus = 'UNVERIFIED';
    }

    const log: VerificationLog = {
      id: `vl-${Date.now()}`,
      couponId: coupon.id,
      couponTitle: coupon.title,
      merchantName: coupon.merchantName || 'Merchant',
      adminId: 'admin-current',
      adminName,
      timestamp: now,
      result,
      method: coupon.verificationMethod || 'manual_checkout_test',
      notes,
      destinationURL: coupon.landingUrl || coupon.affiliateUrl,
      discountTested: discountTested || coupon.discountValue,
    };

    this.verificationLogs.unshift(log);
    this.save();
  }

  public getVerificationLogs(): VerificationLog[] {
    return [...this.verificationLogs];
  }

  // --- DEALS ---
  public getDeals(): Deal[] {
    return [...this.deals];
  }

  public getDealById(id: string): Deal | undefined {
    return this.deals.find((d) => d.id === id);
  }

  public getDealsByMerchant(merchantId: string): Deal[] {
    return this.deals.filter((d) => d.merchantId === merchantId);
  }

  public saveDeal(deal: Deal): void {
    const merchant = this.getMerchantById(deal.merchantId);
    const enriched = {
      ...deal,
      merchantName: merchant?.name || deal.merchantName,
      merchantLogo: merchant?.logo || deal.merchantLogo,
      merchantSlug: merchant?.slug || deal.merchantSlug,
      updatedAt: new Date().toISOString(),
    };

    const index = this.deals.findIndex((d) => d.id === deal.id);
    if (index >= 0) {
      this.deals[index] = enriched;
    } else {
      this.deals.unshift({
        ...enriched,
        createdAt: new Date().toISOString(),
      });
    }
    this.updateMerchantCounts();
    this.save();
  }

  public deleteDeal(id: string): void {
    this.deals = this.deals.filter((d) => d.id !== id);
    this.updateMerchantCounts();
    this.save();
  }

  // --- CATEGORIES ---
  public getCategories(): Category[] {
    return [...this.categories];
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  // --- CLICK TRACKING ---
  public recordClick(
    type: 'coupon' | 'deal' | 'merchant',
    targetId: string,
    targetTitle: string,
    merchantId: string,
    merchantName: string,
    outboundUrl: string
  ): ClickEvent {
    const event: ClickEvent = {
      id: `clk-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      targetId,
      targetTitle,
      merchantId,
      merchantName,
      outboundUrl,
      timestamp: new Date().toISOString(),
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      referrer: typeof document !== 'undefined' ? document.referrer : '',
    };

    this.clicks.unshift(event);

    // Increment click counts
    if (type === 'coupon') {
      const coupon = this.coupons.find((c) => c.id === targetId);
      if (coupon) coupon.clickCount = (coupon.clickCount || 0) + 1;
    } else if (type === 'deal') {
      const deal = this.deals.find((d) => d.id === targetId);
      if (deal) deal.clickCount = (deal.clickCount || 0) + 1;
    }

    this.save();
    return event;
  }

  public getClicks(): ClickEvent[] {
    return [...this.clicks];
  }

  // --- REPORTS ---
  public submitReport(report: Omit<CouponReport, 'id' | 'timestamp' | 'status'>): void {
    const newReport: CouponReport = {
      ...report,
      id: `rep-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    this.reports.unshift(newReport);
    this.save();
  }

  public getReports(): CouponReport[] {
    return [...this.reports];
  }

  public resolveReport(reportId: string, status: 'resolved' | 'dismissed', notes?: string): void {
    const rep = this.reports.find((r) => r.id === reportId);
    if (rep) {
      rep.status = status;
      rep.resolutionNotes = notes;
      this.save();
    }
  }

  // --- SUBMISSIONS ---
  public submitUserCoupon(sub: Omit<UserSubmission, 'id' | 'timestamp' | 'status'>): void {
    const item: UserSubmission = {
      ...sub,
      id: `sub-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'pending',
    };
    this.submissions.unshift(item);
    this.save();
  }

  public getSubmissions(): UserSubmission[] {
    return [...this.submissions];
  }

  // --- AFFILIATE NETWORKS ---
  public getNetworks(): AffiliateNetwork[] {
    return [...this.networks];
  }

  public saveNetwork(network: AffiliateNetwork): void {
    const idx = this.networks.findIndex((n) => n.id === network.id);
    if (idx >= 0) {
      this.networks[idx] = network;
    } else {
      this.networks.push(network);
    }
    this.save();
  }

  // --- BLOG ---
  public getBlogPosts(): BlogPost[] {
    return [...this.blogPosts];
  }

  public getBlogPostBySlug(slug: string): BlogPost | undefined {
    return this.blogPosts.find((p) => p.slug === slug);
  }

  public saveBlogPost(post: BlogPost): void {
    const idx = this.blogPosts.findIndex((b) => b.id === post.id);
    if (idx >= 0) {
      this.blogPosts[idx] = { ...post, updatedDate: new Date().toISOString() };
    } else {
      this.blogPosts.unshift(post);
    }
    this.save();
  }

  // --- BULK IMPORTS ---
  public bulkImportMerchants(merchants: Merchant[]): { imported: number; updated: number } {
    let imported = 0;
    let updated = 0;

    merchants.forEach((m) => {
      const existingIdx = this.merchants.findIndex((curr) => curr.slug === m.slug || curr.id === m.id);
      if (existingIdx >= 0) {
        this.merchants[existingIdx] = {
          ...this.merchants[existingIdx],
          ...m,
          updatedAt: new Date().toISOString(),
        };
        updated++;
      } else {
        this.merchants.push({
          ...m,
          id: m.id || `m-${m.slug}-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        imported++;
      }
    });

    this.save();
    return { imported, updated };
  }

  public bulkImportCoupons(coupons: Coupon[]): { imported: number; updated: number } {
    let imported = 0;
    let updated = 0;

    coupons.forEach((c) => {
      const merchant = this.merchants.find((m) => m.id === c.merchantId || m.slug === c.merchantSlug);
      const enriched: Coupon = {
        ...c,
        merchantId: merchant ? merchant.id : c.merchantId,
        merchantName: merchant ? merchant.name : (c.merchantName || 'Merchant'),
        merchantSlug: merchant ? merchant.slug : c.merchantSlug,
        merchantLogo: merchant ? merchant.logo : c.merchantLogo,
      };

      const existingIdx = this.coupons.findIndex((curr) => curr.id === c.id || (curr.code === c.code && curr.merchantId === enriched.merchantId));
      if (existingIdx >= 0) {
        this.coupons[existingIdx] = {
          ...this.coupons[existingIdx],
          ...enriched,
          updatedAt: new Date().toISOString(),
        };
        updated++;
      } else {
        this.coupons.push({
          ...enriched,
          id: enriched.id || `c-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        imported++;
      }
    });

    this.updateMerchantCounts();
    this.save();
    return { imported, updated };
  }

  public bulkImportDeals(deals: Deal[]): { imported: number; updated: number } {
    let imported = 0;
    let updated = 0;

    deals.forEach((d) => {
      const merchant = this.merchants.find((m) => m.id === d.merchantId || m.slug === d.merchantSlug);
      const enriched: Deal = {
        ...d,
        merchantId: merchant ? merchant.id : d.merchantId,
        merchantName: merchant ? merchant.name : (d.merchantName || 'Merchant'),
        merchantSlug: merchant ? merchant.slug : d.merchantSlug,
        merchantLogo: merchant ? merchant.logo : d.merchantLogo,
      };

      const existingIdx = this.deals.findIndex((curr) => curr.id === d.id);
      if (existingIdx >= 0) {
        this.deals[existingIdx] = {
          ...this.deals[existingIdx],
          ...enriched,
          updatedAt: new Date().toISOString(),
        };
        updated++;
      } else {
        this.deals.push({
          ...enriched,
          id: enriched.id || `d-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        imported++;
      }
    });

    this.updateMerchantCounts();
    this.save();
    return { imported, updated };
  }

  private updateMerchantCounts() {
    this.merchants.forEach((m) => {
      const activeCoupons = this.coupons.filter((c) => c.merchantId === m.id && c.status === 'active');
      const activeDeals = this.deals.filter((d) => d.merchantId === m.id && d.active);
      m.couponCount = activeCoupons.length;
      m.dealCount = activeDeals.length;
    });
  }

  // --- STATS ---
  public getStats(): SystemStats {
    const totalMerchants = this.merchants.length;
    const activeCoupons = this.coupons.filter((c) => c.status === 'active').length;
    const expiredCoupons = this.coupons.filter((c) => c.status === 'expired' || c.verificationStatus === 'EXPIRED').length;
    const activeDeals = this.deals.filter((d) => d.active).length;
    const totalClicks = this.clicks.length;
    const pendingReports = this.reports.filter((r) => r.status === 'pending').length;
    const recentlyVerifiedCount = this.coupons.filter((c) => c.verificationStatus === 'TESTED').length;

    return {
      totalMerchants,
      activeCoupons,
      activeDeals,
      expiredCoupons,
      totalClicks,
      pendingReports,
      recentlyVerifiedCount,
    };
  }

  public resetToDefaults(): void {
    localStorage.clear();
    this.init();
    this.notify();
  }
}

export const db = new DataStore();
