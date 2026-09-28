export type DiscountType = 'percentage' | 'fixed' | 'free_shipping' | 'bogo' | 'gift' | 'custom';

export type CouponStatus = 'active' | 'expired' | 'paused' | 'draft';

export type VerificationStatus = 'TESTED' | 'UNVERIFIED' | 'REPORTED' | 'EXPIRED';

export type VerificationMethod = 'manual_checkout_test' | 'api_validation' | 'affiliate_feed' | 'community_vote' | 'editorial_review';

export type SourceType =
  | 'official_merchant_website'
  | 'official_merchant_newsletter'
  | 'affiliate_network_feed'
  | 'authorized_merchant_feed'
  | 'direct_merchant_submission'
  | 'user_submission'
  | 'editorial_research'
  | 'manual_admin_entry';

export interface Merchant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  logo: string;
  description: string;
  shortDescription: string;
  country: string;
  countries: string[];
  categories: string[]; // category IDs or slugs
  active: boolean;
  featured: boolean;
  couponCount: number;
  dealCount: number;
  bestDiscount: string; // e.g. "75% OFF"
  lastUpdated: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl: string;
  affiliateUrl: string;
  termsAndConditions?: string;
  savingsTips?: string[];
  howToUseSteps?: string[];
  customerServiceEmail?: string;
  customerServicePhone?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  id: string;
  merchantId: string;
  merchantName?: string;
  merchantLogo?: string;
  merchantSlug?: string;
  title: string;
  slug: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: string; // e.g. "20%" or "$15"
  affiliateUrl: string;
  landingUrl: string;
  startDate: string;
  expiryDate: string;
  status: CouponStatus;
  verificationStatus: VerificationStatus;
  verificationMethod?: VerificationMethod;
  lastVerifiedAt?: string;
  terms: string;
  sourceType: SourceType;
  sourceUrl?: string;
  clickCount: number;
  helpfulCount?: number;
  unhelpfulCount?: number;
  editorialPriority: number; // 1-100 (higher = shown first)
  isExclusive?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Deal {
  id: string;
  merchantId: string;
  merchantName?: string;
  merchantLogo?: string;
  merchantSlug?: string;
  title: string;
  slug: string;
  originalPrice: number;
  salePrice: number;
  discountPercentage: number;
  image: string;
  dealUrl: string;
  expiryDate: string;
  lastUpdated: string;
  shippingInfo: string;
  editorialNotes: string;
  category: string;
  active: boolean;
  featured: boolean;
  clickCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  merchantCount: number;
  activeCouponCount: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface VerificationLog {
  id: string;
  couponId: string;
  couponTitle?: string;
  merchantName?: string;
  adminId: string;
  adminName: string;
  timestamp: string;
  result: 'successful' | 'failed' | 'expired' | 'requires_review';
  method: VerificationMethod;
  notes: string;
  screenshot?: string;
  destinationURL: string;
  discountTested?: string;
}

export interface CouponReport {
  id: string;
  couponId: string;
  couponTitle: string;
  merchantName: string;
  reason: 'code_expired' | 'code_invalid' | 'misleading_discount' | 'other';
  userNotes?: string;
  userEmail?: string;
  timestamp: string;
  status: 'pending' | 'resolved' | 'dismissed';
  resolutionNotes?: string;
}

export interface ClickEvent {
  id: string;
  type: 'coupon' | 'deal' | 'merchant';
  targetId: string;
  targetTitle: string;
  merchantId: string;
  merchantName: string;
  outboundUrl: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
}

export interface AffiliateNetwork {
  id: string;
  networkName: string;
  identifier: string; // e.g. "impact", "cj", "rakuten", "shareasale", "direct"
  baseUrl: string;
  trackingParam: string;
  status: 'active' | 'inactive';
  merchantCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  authorName: string;
  authorRole: string;
  category: string;
  publishDate: string;
  updatedDate: string;
  featuredImage: string;
  metaTitle: string;
  metaDescription: string;
  readingTime: string;
  relatedMerchants: string[]; // merchant IDs
  relatedCategories: string[];
  status: 'published' | 'draft' | 'scheduled';
}

export interface UserSubmission {
  id: string;
  merchantName: string;
  merchantUrl: string;
  couponCode: string;
  discountValue: string;
  description: string;
  expiryDate?: string;
  sourceUrl?: string;
  submitterEmail?: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface SystemStats {
  totalMerchants: number;
  activeCoupons: number;
  activeDeals: number;
  expiredCoupons: number;
  totalClicks: number;
  pendingReports: number;
  recentlyVerifiedCount: number;
}
