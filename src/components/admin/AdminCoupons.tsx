import React, { useState } from 'react';
import { PlusCircle, Search, Edit2, Trash2, ShieldCheck, Check, Clock, AlertTriangle } from 'lucide-react';
import { db } from '../../lib/db';
import { Coupon, DiscountType, SourceType } from '../../types';
import { VerifyModal } from '../modals/VerifyModal';

export const AdminCoupons: React.FC = () => {
  const coupons = db.getCoupons();
  const merchants = db.getMerchants();

  const [search, setSearch] = useState('');
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isNew, setIsNew] = useState(false);
  const [verifyTarget, setVerifyTarget] = useState<Coupon | null>(null);

  const filtered = coupons.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.code.toLowerCase().includes(search.toLowerCase()) ||
      (c.merchantName && c.merchantName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateNew = () => {
    const defaultMerchant = merchants[0];
    const empty: Coupon = {
      id: `c-${Date.now()}`,
      merchantId: defaultMerchant ? defaultMerchant.id : '',
      merchantName: defaultMerchant ? defaultMerchant.name : '',
      merchantLogo: defaultMerchant ? defaultMerchant.logo : '',
      merchantSlug: defaultMerchant ? defaultMerchant.slug : '',
      title: '',
      slug: '',
      code: '',
      description: '',
      discountType: 'percentage',
      discountValue: '20%',
      affiliateUrl: defaultMerchant?.affiliateUrl || '',
      landingUrl: `https://${defaultMerchant?.domain || 'merchant.com'}`,
      startDate: new Date().toISOString(),
      expiryDate: '2026-12-31T23:59:59Z',
      status: 'active',
      verificationStatus: 'TESTED',
      verificationMethod: 'manual_checkout_test',
      lastVerifiedAt: new Date().toISOString(),
      terms: 'Standard restrictions apply. Valid on eligible checkout items.',
      sourceType: 'authorized_merchant_feed',
      clickCount: 0,
      editorialPriority: 80,
      isExclusive: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingCoupon(empty);
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCoupon) return;

    const slug = (editingCoupon.title + '-' + editingCoupon.code).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    db.saveCoupon({
      ...editingCoupon,
      slug,
      code: editingCoupon.code.trim().toUpperCase(),
    });
    setEditingCoupon(null);
    setIsNew(false);
  };

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Delete coupon code ${code}?`)) {
      db.deleteCoupon(id);
    }
  };

  const handleToggleStatus = (coupon: Coupon) => {
    const newStatus = coupon.status === 'active' ? 'expired' : 'active';
    db.saveCoupon({ ...coupon, status: newStatus });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Coupons &amp; Promo Codes Manager
          </h1>
          <p className="text-xs text-slate-500">
            Publish promo codes, trigger manual verification tests, adjust priority, or pause promotions.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Coupon</span>
        </button>
      </div>

      {/* Search & Counter */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by code, title, or merchant..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Coupons: <strong className="text-slate-900">{coupons.length}</strong>
        </div>
      </div>

      {/* Edit/Create Form */}
      {editingCoupon && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {isNew ? 'Create New Promo Code' : `Edit Coupon: ${editingCoupon.code}`}
            </h2>
            <button
              onClick={() => {
                setEditingCoupon(null);
                setIsNew(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Store / Merchant *</label>
                <select
                  required
                  value={editingCoupon.merchantId}
                  onChange={(e) => {
                    const m = merchants.find((item) => item.id === e.target.value);
                    setEditingCoupon({
                      ...editingCoupon,
                      merchantId: e.target.value,
                      merchantName: m?.name || '',
                      merchantLogo: m?.logo || '',
                      merchantSlug: m?.slug || '',
                      affiliateUrl: m?.affiliateUrl || editingCoupon.affiliateUrl,
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-medium"
                >
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.code}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SAVE20"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono uppercase font-bold"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discount Value *</label>
                <input
                  type="text"
                  required
                  value={editingCoupon.discountValue}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountValue: e.target.value })}
                  placeholder="e.g. 20% OFF or $15 OFF"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Coupon Headline Title *</label>
              <input
                type="text"
                required
                value={editingCoupon.title}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, title: e.target.value })}
                placeholder="e.g. Extra 20% Off All Shared & Cloud Hosting Plans"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Detailed Description *</label>
              <textarea
                required
                rows={2}
                value={editingCoupon.description}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Discount Type</label>
                <select
                  value={editingCoupon.discountType}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, discountType: e.target.value as DiscountType })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                >
                  <option value="percentage">Percentage Discount</option>
                  <option value="fixed">Fixed Dollar Amount</option>
                  <option value="free_shipping">Free Shipping</option>
                  <option value="bogo">Buy One Get One (BOGO)</option>
                  <option value="custom">Other Custom Offer</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source Type</label>
                <select
                  value={editingCoupon.sourceType}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, sourceType: e.target.value as SourceType })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                >
                  <option value="authorized_merchant_feed">Authorized Merchant Feed</option>
                  <option value="official_merchant_newsletter">Official Merchant Newsletter</option>
                  <option value="official_merchant_website">Official Merchant Website</option>
                  <option value="editorial_research">Editorial Research</option>
                  <option value="direct_merchant_submission">Direct Merchant Submission</option>
                  <option value="user_submission">User Submission</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Expiry Date</label>
                <input
                  type="date"
                  value={editingCoupon.expiryDate.split('T')[0]}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, expiryDate: `${e.target.value}T23:59:59Z` })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Terms &amp; Restrictions</label>
              <input
                type="text"
                value={editingCoupon.terms}
                onChange={(e) => setEditingCoupon({ ...editingCoupon, terms: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCoupon.isExclusive}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, isExclusive: e.target.checked })}
                  className="text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-700">Exclusive Negotiated Code</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingCoupon.status === 'active'}
                  onChange={(e) =>
                    setEditingCoupon({
                      ...editingCoupon,
                      status: e.target.checked ? 'active' : 'expired',
                    })
                  }
                  className="text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-700">Active / Published</span>
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingCoupon(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-xs"
              >
                Save Coupon
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Code / Store</th>
              <th className="py-3 px-4">Headline</th>
              <th className="py-3 px-4">Discount</th>
              <th className="py-3 px-4">Verification</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-xs">
                      {coupon.code}
                    </span>
                    <span className="font-semibold text-slate-700">{coupon.merchantName}</span>
                  </div>
                </td>
                <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-800">
                  {coupon.title}
                </td>
                <td className="py-3 px-4 font-bold text-teal-700">
                  {coupon.discountValue}
                </td>
                <td className="py-3 px-4">
                  {coupon.verificationStatus === 'TESTED' ? (
                    <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Tested
                    </span>
                  ) : coupon.verificationStatus === 'REPORTED' ? (
                    <span className="inline-flex items-center gap-1 text-rose-800 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">
                      <AlertTriangle className="w-3 h-3 text-rose-600" /> Reported
                    </span>
                  ) : (
                    <span className="text-slate-400 text-[11px]">Unverified</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleStatus(coupon)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      coupon.status === 'active'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {coupon.status.toUpperCase()}
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => setVerifyTarget(coupon)}
                      className="px-2 py-1 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-colors"
                      title="Run manual checkout verification"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
                      <span>Test</span>
                    </button>
                    <button
                      onClick={() => {
                        setEditingCoupon(coupon);
                        setIsNew(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(coupon.id, coupon.code)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verification Modal Trigger */}
      {verifyTarget && (
        <VerifyModal
          coupon={verifyTarget}
          onClose={() => setVerifyTarget(null)}
          onVerified={() => {
            setVerifyTarget(null);
          }}
        />
      )}
    </div>
  );
};
