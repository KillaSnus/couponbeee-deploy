import { Merchant, Coupon, Deal } from '../types';

export interface ValidationIssue {
  row: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
  value?: string;
}

export interface ImportValidationResult<T> {
  totalRows: number;
  validRows: T[];
  invalidRows: { row: number; data: Record<string, string>; issues: ValidationIssue[] }[];
  duplicateCount: number;
  warningCount: number;
  errorCount: number;
}

// Simple robust CSV parser handling quoted values with commas
export function parseCSV(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);
  const records: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;
    const record: Record<string, string> = {};
    headers.forEach((header, idx) => {
      record[header.trim()] = values[idx] ? values[idx].trim() : '';
    });
    records.push(record);
  }

  return records;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"' || char === "'") {
      if (inQuotes && line[i + 1] === char) {
        current += char;
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

export function validateMerchantImport(
  rows: Record<string, string>[],
  existingMerchants: Merchant[]
): ImportValidationResult<Merchant> {
  const validRows: Merchant[] = [];
  const invalidRows: { row: number; data: Record<string, string>; issues: ValidationIssue[] }[] = [];
  const seenSlugs = new Set<string>();
  let duplicateCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  rows.forEach((data, index) => {
    const rowNum = index + 2; // +1 for 0-index, +1 for header
    const issues: ValidationIssue[] = [];

    const name = data['name'] || data['Name'] || '';
    const domain = data['domain'] || data['Domain'] || '';
    let slug = data['slug'] || data['Slug'] || '';

    if (!name) {
      issues.push({ row: rowNum, field: 'name', message: 'Merchant name is required', severity: 'error' });
    }

    if (!domain) {
      issues.push({ row: rowNum, field: 'domain', message: 'Domain is required (e.g. hostinger.com)', severity: 'error' });
    } else if (!domain.includes('.')) {
      issues.push({ row: rowNum, field: 'domain', message: 'Invalid domain format', severity: 'warning', value: domain });
      warningCount++;
    }

    if (!slug && name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    }

    if (seenSlugs.has(slug)) {
      issues.push({ row: rowNum, field: 'slug', message: `Duplicate slug in file: ${slug}`, severity: 'warning' });
      duplicateCount++;
      warningCount++;
    } else {
      seenSlugs.add(slug);
    }

    const existingMatch = existingMerchants.find((m) => m.slug === slug || m.domain === domain);
    if (existingMatch) {
      issues.push({
        row: rowNum,
        field: 'slug',
        message: `Matches existing store (${existingMatch.name}) - will update rather than insert`,
        severity: 'warning',
      });
      warningCount++;
    }

    const errors = issues.filter((i) => i.severity === 'error');
    errorCount += errors.length;

    if (errors.length > 0) {
      invalidRows.push({ row: rowNum, data, issues });
    } else {
      const merchant: Merchant = {
        id: data['id'] || (existingMatch ? existingMatch.id : `m-${slug}`),
        name,
        slug,
        domain,
        logo: data['logo'] || `https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=128&h=128&fit=crop&auto=format`,
        description: data['description'] || `${name} offers verified online savings and promotional discounts.`,
        shortDescription: data['shortDescription'] || `${name} offers tested discounts.`,
        country: data['country'] || 'United States',
        countries: data['countries'] ? data['countries'].split(';').map((s) => s.trim()) : ['Global'],
        categories: data['categories'] ? data['categories'].split(';').map((s) => s.trim()) : ['cat-software'],
        active: data['active'] !== 'false',
        featured: data['featured'] === 'true',
        couponCount: 0,
        dealCount: 0,
        bestDiscount: data['bestDiscount'] || 'Special Offer',
        lastUpdated: new Date().toISOString(),
        seoTitle: `${name} Promo Codes & Coupons – Verified ${new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}`,
        seoDescription: `Save with authentic ${name} coupons, discount codes, and verified promo offers tested by Biorals.`,
        canonicalUrl: `https://biorals.com/stores/${slug}`,
        affiliateUrl: data['affiliateUrl'] || `https://${domain}?ref=biorals`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      validRows.push(merchant);
    }
  });

  return {
    totalRows: rows.length,
    validRows,
    invalidRows,
    duplicateCount,
    warningCount,
    errorCount,
  };
}

export function validateCouponImport(
  rows: Record<string, string>[],
  merchants: Merchant[],
  existingCoupons: Coupon[]
): ImportValidationResult<Coupon> {
  const validRows: Coupon[] = [];
  const invalidRows: { row: number; data: Record<string, string>; issues: ValidationIssue[] }[] = [];
  const seenCodes = new Set<string>();
  let duplicateCount = 0;
  let warningCount = 0;
  let errorCount = 0;

  rows.forEach((data, index) => {
    const rowNum = index + 2;
    const issues: ValidationIssue[] = [];

    const merchantRef = data['merchantId'] || data['merchantSlug'] || data['Merchant'] || '';
    const code = data['code'] || data['Code'] || '';
    const title = data['title'] || data['Title'] || '';
    const discountValue = data['discountValue'] || data['Discount'] || '';
    const expiryDate = data['expiryDate'] || data['Expiry'] || '';

    // Merchant Existence Check
    const matchedMerchant = merchants.find(
      (m) =>
        m.id.toLowerCase() === merchantRef.toLowerCase() ||
        m.slug.toLowerCase() === merchantRef.toLowerCase() ||
        m.name.toLowerCase() === merchantRef.toLowerCase()
    );

    if (!matchedMerchant) {
      issues.push({
        row: rowNum,
        field: 'merchantId',
        message: `Merchant "${merchantRef}" was not found in database. Create merchant first.`,
        severity: 'error',
      });
    }

    if (!title) {
      issues.push({ row: rowNum, field: 'title', message: 'Coupon title is required', severity: 'error' });
    }

    if (!code) {
      issues.push({ row: rowNum, field: 'code', message: 'Promo code is required', severity: 'error' });
    }

    if (!discountValue) {
      issues.push({ row: rowNum, field: 'discountValue', message: 'Discount value (e.g. 20% or $15) is required', severity: 'error' });
    }

    // Expiration check
    if (expiryDate) {
      const expTime = new Date(expiryDate).getTime();
      if (isNaN(expTime)) {
        issues.push({ row: rowNum, field: 'expiryDate', message: 'Invalid expiry date format. Use YYYY-MM-DD.', severity: 'warning' });
        warningCount++;
      } else if (expTime < Date.now()) {
        issues.push({ row: rowNum, field: 'expiryDate', message: 'Coupon is already expired. Will be imported with status "expired".', severity: 'warning' });
        warningCount++;
      }
    }

    // Duplicate check
    const codeKey = `${matchedMerchant?.id || merchantRef}:${code.toUpperCase()}`;
    if (seenCodes.has(codeKey)) {
      issues.push({ row: rowNum, field: 'code', message: `Duplicate code "${code}" for this merchant in file`, severity: 'warning' });
      duplicateCount++;
      warningCount++;
    } else {
      seenCodes.add(codeKey);
    }

    const errors = issues.filter((i) => i.severity === 'error');
    errorCount += errors.length;

    if (errors.length > 0) {
      invalidRows.push({ row: rowNum, data, issues });
    } else {
      const slug = (title + '-' + code).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const isExpired = expiryDate ? new Date(expiryDate).getTime() < Date.now() : false;

      const coupon: Coupon = {
        id: data['id'] || `c-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        merchantId: matchedMerchant!.id,
        merchantName: matchedMerchant!.name,
        merchantLogo: matchedMerchant!.logo,
        merchantSlug: matchedMerchant!.slug,
        title,
        slug,
        code: code.trim().toUpperCase(),
        description: data['description'] || `Use code ${code} at ${matchedMerchant!.name} to receive ${discountValue}.`,
        discountType: (data['discountType'] as any) || 'percentage',
        discountValue,
        affiliateUrl: data['affiliateUrl'] || matchedMerchant!.affiliateUrl,
        landingUrl: data['landingUrl'] || `https://${matchedMerchant!.domain}`,
        startDate: data['startDate'] || new Date().toISOString(),
        expiryDate: expiryDate || '2026-12-31T23:59:59Z',
        status: isExpired ? 'expired' : 'active',
        verificationStatus: (data['verificationStatus'] as any) || 'TESTED',
        verificationMethod: 'manual_checkout_test',
        lastVerifiedAt: data['lastVerifiedAt'] || new Date().toISOString(),
        terms: data['terms'] || 'Terms and exclusions may apply. See merchant checkout for details.',
        sourceType: (data['sourceType'] as any) || 'authorized_merchant_feed',
        sourceUrl: data['sourceUrl'] || `https://${matchedMerchant!.domain}`,
        clickCount: 0,
        editorialPriority: Number(data['editorialPriority']) || 80,
        isExclusive: data['isExclusive'] === 'true',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      validRows.push(coupon);
    }
  });

  return {
    totalRows: rows.length,
    validRows,
    invalidRows,
    duplicateCount,
    warningCount,
    errorCount,
  };
}

export function validateDealImport(
  rows: Record<string, string>[],
  merchants: Merchant[]
): ImportValidationResult<Deal> {
  const validRows: Deal[] = [];
  const invalidRows: { row: number; data: Record<string, string>; issues: ValidationIssue[] }[] = [];
  let warningCount = 0;
  let errorCount = 0;

  rows.forEach((data, index) => {
    const rowNum = index + 2;
    const issues: ValidationIssue[] = [];

    const merchantRef = data['merchantId'] || data['merchantSlug'] || data['Merchant'] || '';
    const title = data['title'] || data['Title'] || '';
    const originalPrice = parseFloat(data['originalPrice'] || '0');
    const salePrice = parseFloat(data['salePrice'] || '0');

    const matchedMerchant = merchants.find(
      (m) =>
        m.id.toLowerCase() === merchantRef.toLowerCase() ||
        m.slug.toLowerCase() === merchantRef.toLowerCase() ||
        m.name.toLowerCase() === merchantRef.toLowerCase()
    );

    if (!matchedMerchant) {
      issues.push({ row: rowNum, field: 'merchantId', message: `Merchant "${merchantRef}" not found`, severity: 'error' });
    }

    if (!title) {
      issues.push({ row: rowNum, field: 'title', message: 'Deal title is required', severity: 'error' });
    }

    if (isNaN(originalPrice) || originalPrice <= 0) {
      issues.push({ row: rowNum, field: 'originalPrice', message: 'Original price must be a positive number', severity: 'error' });
    }

    if (isNaN(salePrice) || salePrice <= 0) {
      issues.push({ row: rowNum, field: 'salePrice', message: 'Sale price must be a positive number', severity: 'error' });
    } else if (salePrice >= originalPrice) {
      issues.push({ row: rowNum, field: 'salePrice', message: 'Sale price should be less than original price', severity: 'warning' });
      warningCount++;
    }

    const errors = issues.filter((i) => i.severity === 'error');
    errorCount += errors.length;

    if (errors.length > 0) {
      invalidRows.push({ row: rowNum, data, issues });
    } else {
      const discountPct = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

      const deal: Deal = {
        id: data['id'] || `d-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
        merchantId: matchedMerchant!.id,
        merchantName: matchedMerchant!.name,
        merchantLogo: matchedMerchant!.logo,
        merchantSlug: matchedMerchant!.slug,
        title,
        slug,
        originalPrice,
        salePrice,
        discountPercentage: discountPct,
        image: data['image'] || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&auto=format',
        dealUrl: data['dealUrl'] || matchedMerchant!.affiliateUrl,
        expiryDate: data['expiryDate'] || '2026-12-31T23:59:59Z',
        lastUpdated: new Date().toISOString(),
        shippingInfo: data['shippingInfo'] || 'Standard merchant shipping applies.',
        editorialNotes: data['editorialNotes'] || 'Genuine promotion checked against live merchant pricing.',
        category: data['category'] || 'cat-software',
        active: true,
        featured: data['featured'] === 'true',
        clickCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      validRows.push(deal);
    }
  });

  return {
    totalRows: rows.length,
    validRows,
    invalidRows,
    duplicateCount: 0,
    warningCount,
    errorCount,
  };
}

// Generate Sample CSV strings for download
export const SAMPLE_MERCHANTS_CSV = `name,domain,slug,bestDiscount,category,country,affiliateUrl,shortDescription
Hostinger,hostinger.com,hostinger,75% OFF,cat-hosting,United States,https://www.hostinger.com?r=biorals_ref,Fast cloud web hosting and managed WordPress solutions.
DigitalOcean,digitalocean.com,digitalocean,$200 Credit,cat-software,United States,https://www.digitalocean.com?ref=biorals,Developer-friendly cloud compute and Kubernetes hosting.
Canva,canva.com,canva,30-Day Free Pro,cat-software,Australia,https://www.canva.com?ref=biorals,Intuitive graphic design and visual suite for creators.
Notion,notion.so,notion,20% OFF,cat-software,United States,https://www.notion.so?ref=biorals,All-in-one workspace for notes and team docs.`;

export const SAMPLE_COUPONS_CSV = `merchantSlug,code,title,discountValue,discountType,expiryDate,terms,sourceType
hostinger,SAVE10,Extra 10% Off All Shared & Cloud Hosting,10%,percentage,2026-12-31,Valid on 12-48 month plans.,authorized_merchant_feed
digitalocean,BIORALS200,$200 Free Cloud Infrastructure Credit,$200,fixed,2026-12-31,Valid 60 days from signup.,authorized_merchant_feed
notion,ANNUALPLUS,20% Off Notion Plus Annual Billing,20%,percentage,2026-12-31,Billed annually.,official_merchant_website`;

export const SAMPLE_DEALS_CSV = `merchantSlug,title,originalPrice,salePrice,shippingInfo,editorialNotes
hostinger,Premium Web Hosting 48-Month Deal,11.99,2.99,Instant provisioning,Includes free domain and SSL.
sonos,Sonos Beam Gen 2 Atmos Soundbar,499.00,399.00,Free 2-day shipping,Factory special offer.`;
