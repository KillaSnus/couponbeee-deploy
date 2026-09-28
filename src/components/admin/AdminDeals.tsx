import React, { useState } from 'react';
import { PlusCircle, Search, Edit2, Trash2, Flame, Star } from 'lucide-react';
import { db } from '../../lib/db';
import { Deal } from '../../types';

export const AdminDeals: React.FC = () => {
  const deals = db.getDeals();
  const merchants = db.getMerchants();
  const categories = db.getCategories();

  const [search, setSearch] = useState('');
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = deals.filter(
    (d) =>
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      (d.merchantName && d.merchantName.toLowerCase().includes(search.toLowerCase()))
  );

  const handleCreateNew = () => {
    const defaultMerchant = merchants[0];
    const empty: Deal = {
      id: `d-${Date.now()}`,
      merchantId: defaultMerchant ? defaultMerchant.id : '',
      merchantName: defaultMerchant ? defaultMerchant.name : '',
      merchantLogo: defaultMerchant ? defaultMerchant.logo : '',
      merchantSlug: defaultMerchant ? defaultMerchant.slug : '',
      title: '',
      slug: '',
      originalPrice: 100,
      salePrice: 75,
      discountPercentage: 25,
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=300&fit=crop&auto=format',
      dealUrl: defaultMerchant?.affiliateUrl || '',
      expiryDate: '2026-12-31T23:59:59Z',
      lastUpdated: new Date().toISOString(),
      shippingInfo: 'Standard merchant shipping terms apply.',
      editorialNotes: 'Verified current manufacturer markdown price.',
      category: 'cat-software',
      active: true,
      featured: false,
      clickCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEditingDeal(empty);
    setIsNew(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeal) return;

    const discountPct = Math.round(
      ((editingDeal.originalPrice - editingDeal.salePrice) / editingDeal.originalPrice) * 100
    );

    const slug = editingDeal.title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    db.saveDeal({
      ...editingDeal,
      slug,
      discountPercentage: Math.max(0, discountPct),
    });
    setEditingDeal(null);
    setIsNew(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Delete deal "${title}"?`)) {
      db.deleteDeal(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Deals &amp; Sales Manager</h1>
          <p className="text-xs text-slate-500">
            Publish price markdowns, clearance items, and direct retailer promotions.
          </p>
        </div>

        <button
          onClick={handleCreateNew}
          className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Deal</span>
        </button>
      </div>

      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search deals..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-teal-500"
          />
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total Deals: <strong className="text-slate-900">{deals.length}</strong>
        </div>
      </div>

      {editingDeal && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900">
              {isNew ? 'Create New Deal' : `Edit Deal: ${editingDeal.title}`}
            </h2>
            <button
              onClick={() => {
                setEditingDeal(null);
                setIsNew(false);
              }}
              className="text-xs text-slate-400 hover:text-slate-600 font-semibold"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Store / Retailer *</label>
                <select
                  value={editingDeal.merchantId}
                  onChange={(e) => {
                    const m = merchants.find((item) => item.id === e.target.value);
                    setEditingDeal({
                      ...editingDeal,
                      merchantId: e.target.value,
                      merchantName: m?.name || '',
                      merchantLogo: m?.logo || '',
                      merchantSlug: m?.slug || '',
                      dealUrl: m?.affiliateUrl || editingDeal.dealUrl,
                    });
                  }}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {merchants.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={editingDeal.category}
                  onChange={(e) => setEditingDeal({ ...editingDeal, category: e.target.value })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Deal Title *</label>
              <input
                type="text"
                required
                value={editingDeal.title}
                onChange={(e) => setEditingDeal({ ...editingDeal, title: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Original Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingDeal.originalPrice}
                  onChange={(e) => setEditingDeal({ ...editingDeal, originalPrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Sale Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={editingDeal.salePrice}
                  onChange={(e) => setEditingDeal({ ...editingDeal, salePrice: parseFloat(e.target.value) || 0 })}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-teal-800"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Image URL</label>
              <input
                type="text"
                value={editingDeal.image}
                onChange={(e) => setEditingDeal({ ...editingDeal, image: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px]"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Shipping Notes</label>
              <input
                type="text"
                value={editingDeal.shippingInfo}
                onChange={(e) => setEditingDeal({ ...editingDeal, shippingInfo: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Editorial Research Notes</label>
              <textarea
                rows={2}
                value={editingDeal.editorialNotes}
                onChange={(e) => setEditingDeal({ ...editingDeal, editorialNotes: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>

            <div className="flex items-center gap-4 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingDeal.featured}
                  onChange={(e) => setEditingDeal({ ...editingDeal, featured: e.target.checked })}
                  className="text-teal-600 rounded"
                />
                <span className="font-semibold text-slate-700">Feature on Deals Homepage</span>
              </label>
            </div>

            <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setEditingDeal(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-xs"
              >
                Save Deal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Deals Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
          <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <tr>
              <th className="py-3 px-4">Deal / Retailer</th>
              <th className="py-3 px-4">Original</th>
              <th className="py-3 px-4">Sale Price</th>
              <th className="py-3 px-4">Discount %</th>
              <th className="py-3 px-4">Clicks</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((deal) => (
              <tr key={deal.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4">
                  <div className="font-bold text-slate-900">{deal.title}</div>
                  <div className="text-[11px] text-slate-400">{deal.merchantName}</div>
                </td>
                <td className="py-3 px-4 line-through text-slate-400">
                  ${deal.originalPrice.toFixed(2)}
                </td>
                <td className="py-3 px-4 font-black text-slate-900">
                  ${deal.salePrice.toFixed(2)}
                </td>
                <td className="py-3 px-4">
                  <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {deal.discountPercentage}% OFF
                  </span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-700">
                  {deal.clickCount}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setEditingDeal(deal);
                        setIsNew(false);
                      }}
                      className="p-1.5 text-slate-400 hover:text-teal-700 rounded-lg hover:bg-slate-100"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(deal.id, deal.title)}
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
    </div>
  );
};
