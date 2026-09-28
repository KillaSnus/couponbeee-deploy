import React, { useState } from 'react';
import { Sliders, Save, Plus, Check } from 'lucide-react';
import { db } from '../../lib/db';
import { AffiliateNetwork } from '../../types';

export const AdminSettings: React.FC = () => {
  const networks = db.getNetworks();
  const [platformName, setPlatformName] = useState('Biorals');
  const [supportEmail, setSupportEmail] = useState('editorial@biorals.com');
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          System Settings &amp; Affiliate Networks
        </h1>
        <p className="text-xs text-slate-500">
          Configure global platform parameters, attribution tracking parameters, and partner networks.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-xs">
        <form onSubmit={handleSaveSettings} className="space-y-4 max-w-xl text-xs">
          <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            General Configuration
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Platform Brand Name</label>
              <input
                type="text"
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Editorial Desk Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold flex items-center gap-1.5 transition-colors"
          >
            {saved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save General Settings</span>
              </>
            )}
          </button>
        </form>

        {/* Affiliate Networks Table */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">
              Active Affiliate Networks ({networks.length})
            </h3>
          </div>

          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs text-slate-600 divide-y divide-slate-100">
              <thead className="bg-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">Network Name</th>
                  <th className="py-2.5 px-4">Identifier</th>
                  <th className="py-2.5 px-4">Tracking Parameter</th>
                  <th className="py-2.5 px-4">Stores Connected</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {networks.map((net) => (
                  <tr key={net.id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-bold text-slate-900">{net.networkName}</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-slate-500">{net.identifier}</td>
                    <td className="py-3 px-4 font-mono text-teal-700">{net.trackingParam}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{net.merchantCount} stores</td>
                    <td className="py-3 px-4">
                      <span className="bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        ACTIVE
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
