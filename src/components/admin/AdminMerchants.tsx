import React, { useState } from 'react';
import { PlusCircle, Search, Edit2, Trash2, ExternalLink, Star } from 'lucide-react';
import { db } from '../../lib/db';
import { Merchant } from '../../types';

export const AdminMerchants: React.FC = () => {
  const merchants = db.getMerchants();
  const categories = db.getCategories();

  const [search, setSearch] = useState('');
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = merchants.filter(
    (m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.domain.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateNew = () => {
    const empty: Merchant = {
      id: `m-${Date.now()}`,
      name: '',
      slug: '',
      domain: '',
      logo: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=128&h=128&fit=crop&auto=format',
      description: '',
      shortDescription: '',
      country: 'United States',
      countries: ['United States', 'Global'],
      categories: ['cat-software'],
      active: true,
      featured: false,
      couponCount: 0,
      dealCount: 0,
      bestDiscount: '10% OFF',
      lastUpdated: new Date().toISOString(),
      seoTitle: '',
      seoDescription: '',
      canonicalUrl: '',
      affiliateUrl: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingMerchant(empty);
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMerchant) return;

    const slug = editingMerchant.slug || editingMerchant.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const updated: Merchant = {
      ...editingMerchant,
      slug,
      canonicalUrl: `https://biorals.com/stores/${slug}`,
      seoTitle: editingMerchant.seoTitle || `${editingMerchant.name} Promo Codes & Verified Coupons`,
      seoDescription: editingMerchant.seoDescription || `Save with tested ${editingMerchant.name} promo codes.`,
      lastUpdated: new Date().toISOString(),
    };

    db.saveMerchant(updated);
    setEditingMerchant(null);
    setIsNew(false);
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}? All associated coupons will lose their store link.`)) {
      db.deleteMerchant(id);
    }
  };

  const handleToggleFeatured = (merchant: Merchant) => {
    db.saveMerchant({ ...merchant, featured: !merchant.featured });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Store &amp; Merchant Manager
          </h1>
          <p className="text-xs text-slate-500">
            Configure partner retailers, domains, category assignments, and affiliate tracking URLs.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Merchant</span>
        </button>
      </div>

      {/* Search & Stats */}
      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter stores by name or domain..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Stores: <strong className="text-slate-900">{merchants.length}</strong>
        </div>
      </div>

      {/* Edit/Create Form Drawer/Modal */}
      {editingMerchant && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {isNew ? 'Create New Store' : `Edit Store: ${editingMerchant.name}`}
            </h2>
            <button
              onClick={() => {
                setEditingMerchant(null);
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
                <label className="block font-semibold text-slate-700 mb-1">Store Name *</label>
                <input
                  type="text"
                  required
                  value={editingMerchant.name}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, name: e.target.value })}
                  placeholder="e.g. Hostinger"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Domain *</label>
                <input
                  type="text"
                  required
                  value={editingMerchant.domain}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, domain: e.target.value })}
                  placeholder="e.g. hostinger.com"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Slug (URL)</label>
                <input
                  type="text"
                  value={editingMerchant.slug}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, slug: e.target.value })}
                  placeholder="e.g. hostinger"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Best Discount Badge *</label>
                <input
                  type="text"
                  required
                  value={editingMerchant.bestDiscount}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, bestDiscount: e.target.value })}
                  placeholder="e.g. 75% OFF"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Primary Category</label>
                <select
                  value={editingMerchant.categories[0] || 'cat-software'}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, categories: [e.target.value] })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Headquarters Country</label>
                <input
                  type="text"
                  value={editingMerchant.country}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, country: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Logo URL (or CDN link)</label>
              <input
                type="text"
                value={editingMerchant.logo}
                onChange={(e) => setEditingMerchant({ ...editingMerchant, logo: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Affiliate / Outbound Tracking URL</label>
              <input
                type="text"
                value={editingMerchant.affiliateUrl}
                onChange={(e) => setEditingMerchant({ ...editingMerchant, affiliateUrl: e.target.value })}
                placeholder="https://merchant.com?ref=biorals"
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Store Description *</label>
              <textarea
                required
                rows={3}
                value={editingMerchant.description}
                onChange={(e) => setEditingMerchant({ ...editingMerchant, description: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingMerchant.featured}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, featured: e.target.checked })}
                  className="text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-700">Feature on Homepage</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingMerchant.active}
                  onChange={(e) => setEditingMerchant({ ...editingMerchant, active: e.target.checked })}
                  className="text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-700">Active / Published</span>
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingMerchant(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-xs"
              >
                Save Merchant
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Merchants Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Store</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Offers</th>
              <th className="py-3 px-4">Best Discount</th>
              <th className="py-3 px-4">Featured</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((merchant) => (
              <tr key={merchant.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={merchant.logo}
                      alt={merchant.name}
                      className="w-8 h-8 rounded-lg object-contain border border-slate-200"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{merchant.name}</div>
                      <div className="text-[11px] text-slate-400">{merchant.domain}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium text-slate-700">
                    {categories.find((c) => merchant.categories.includes(c.id))?.name || 'General'}
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-700">
                  {merchant.couponCount} codes · {merchant.dealCount} deals
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                    {merchant.bestDiscount}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleToggleFeatured(merchant)}
                    className={`p-1 rounded-lg ${
                      merchant.featured ? 'text-amber-500 bg-amber-50' : 'text-slate-300 hover:text-slate-500'
                    }`}
                  >
                    <Star className="w-4 h-4 fill-current" />
                  </button>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <a
                      href={`/stores/${merchant.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
                      title="View live page"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <button
                      onClick={() => {
                        setEditingMerchant(merchant);
                        setIsNew(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-slate-100"
                      title="Edit store"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(merchant.id, merchant.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
                      title="Delete store"
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
    </div>
  );
};
