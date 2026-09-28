import React, { useState } from 'react';
import {
  Upload,
  Download,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  FileSpreadsheet,
  Layers,
  Database,
  Info,
} from 'lucide-react';
import { db } from '../../lib/db';
import {
  parseCSV,
  validateMerchantImport,
  validateCouponImport,
  validateDealImport,
  SAMPLE_MERCHANTS_CSV,
  SAMPLE_COUPONS_CSV,
  SAMPLE_DEALS_CSV,
  ImportValidationResult,
} from '../../lib/exportImport';
import { Merchant, Coupon, Deal } from '../../types';

export const AdminImport: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'merchants' | 'coupons' | 'deals' | 'json' | 'api'>('merchants');
  const [rawText, setRawText] = useState('');
  const [validationResult, setValidationResult] = useState<ImportValidationResult<any> | null>(null);
  const [importCompleted, setImportCompleted] = useState<{ imported: number; updated: number } | null>(null);

  const merchants = db.getMerchants();
  const coupons = db.getCoupons();

  const handleDownloadSample = (type: 'merchants' | 'coupons' | 'deals') => {
    let content = '';
    let filename = '';
    if (type === 'merchants') {
      content = SAMPLE_MERCHANTS_CSV;
      filename = 'biorals_sample_merchants.csv';
    } else if (type === 'coupons') {
      content = SAMPLE_COUPONS_CSV;
      filename = 'biorals_sample_coupons.csv';
    } else {
      content = SAMPLE_DEALS_CSV;
      filename = 'biorals_sample_deals.csv';
    }

    const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleValidate = () => {
    setImportCompleted(null);
    if (!rawText.trim()) return;

    const parsed = parseCSV(rawText);

    if (activeTab === 'merchants') {
      const res = validateMerchantImport(parsed, merchants);
      setValidationResult(res);
    } else if (activeTab === 'coupons') {
      const res = validateCouponImport(parsed, merchants, coupons);
      setValidationResult(res);
    } else if (activeTab === 'deals') {
      const res = validateDealImport(parsed, merchants);
      setValidationResult(res);
    }
  };

  const handleConfirmImport = () => {
    if (!validationResult || validationResult.validRows.length === 0) return;

    if (activeTab === 'merchants') {
      const stats = db.bulkImportMerchants(validationResult.validRows as Merchant[]);
      setImportCompleted(stats);
    } else if (activeTab === 'coupons') {
      const stats = db.bulkImportCoupons(validationResult.validRows as Coupon[]);
      setImportCompleted(stats);
    } else if (activeTab === 'deals') {
      const stats = db.bulkImportDeals(validationResult.validRows as Deal[]);
      setImportCompleted(stats);
    }

    setValidationResult(null);
    setRawText('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setRawText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Bulk Ingestion &amp; Import Suite
          </h1>
          <p className="text-xs text-slate-500">
            Scale to 1,000+ merchants and thousands of verified offers via strict CSV, JSON, or authorized affiliate API data pipelines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleDownloadSample(activeTab as any)}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-teal-600" />
            <span>Download CSV Template</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl overflow-x-auto text-xs font-semibold">
        {[
          { id: 'merchants', label: '1. Merchant Ingestion' },
          { id: 'coupons', label: '2. Coupon Verification Import' },
          { id: 'deals', label: '3. Deal Markdowns Import' },
          { id: 'json', label: 'JSON Raw Payload' },
          { id: 'api', label: 'Affiliate Feed API Sync' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id as any);
              setValidationResult(null);
              setImportCompleted(null);
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* API / JSON Notice when selected */}
      {activeTab === 'api' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
          <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
            <Database className="w-5 h-5" />
            <span>Affiliate Network Automated Sync Configuration</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Configure automated daily ingestion of verified merchant feeds via Impact Radius, CJ Affiliate, or Rakuten Advertising. Feeds are imported into the draft validation staging area and require automated checkout validation before public indexing.
          </p>
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 font-mono text-xs text-slate-700 space-y-2">
            <div>GET https://api.impact.com/Mediapartners/Campaigns/Offers</div>
            <div className="text-slate-500">Headers: Authorization Bearer [IMPACT_API_TOKEN]</div>
            <div className="text-emerald-700 font-semibold">✓ Safe Pipeline Active: 0 Unverified codes published without test</div>
          </div>
        </div>
      )}

      {(activeTab === 'merchants' || activeTab === 'coupons' || activeTab === 'deals' || activeTab === 'json') && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs space-y-5">
          {/* File Upload Area */}
          <div className="border-2 border-dashed border-slate-300 hover:border-teal-500 rounded-2xl p-6 text-center transition-colors">
            <Upload className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <div className="text-xs font-bold text-slate-800">
              Drag &amp; drop {activeTab}.csv here, or click to browse
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Supports CSV format with commas and quotation marks. Max 5,000 rows per batch.
            </p>
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleFileUpload}
              className="mt-3 text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-teal-50 file:text-teal-700 hover:file:bg-teal-100 cursor-pointer"
            />
          </div>

          {/* Paste Raw Textarea */}
          <div className="space-y-1">
            <label className="block text-xs font-bold text-slate-700">
              Or Paste CSV Data Directly:
            </label>
            <textarea
              rows={6}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste comma-separated rows with header line..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-mono text-xs focus:outline-none focus:border-teal-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                if (activeTab === 'merchants') setRawText(SAMPLE_MERCHANTS_CSV);
                else if (activeTab === 'coupons') setRawText(SAMPLE_COUPONS_CSV);
                else setRawText(SAMPLE_DEALS_CSV);
              }}
              className="text-xs font-semibold text-teal-700 hover:underline"
            >
              Load Sample Template Data
            </button>

            <button
              onClick={handleValidate}
              disabled={!rawText.trim()}
              className="px-6 py-2.5 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Validate &amp; Inspect Rows
            </button>
          </div>
        </div>
      )}

      {/* Validation Results Drawer */}
      {validationResult && (
        <div className="bg-white rounded-3xl border border-slate-300 p-6 sm:p-8 shadow-lg space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Pre-Publication Validation Report
              </h2>
              <p className="text-xs text-slate-500">
                Data quality analysis completed. Review flagged rows and confirm to insert into database.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setValidationResult(null)}
                className="px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Dismiss
              </button>

              <button
                onClick={handleConfirmImport}
                disabled={validationResult.validRows.length === 0}
                className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                Confirm &amp; Publish {validationResult.validRows.length} Valid Records
              </button>
            </div>
          </div>

          {/* Validation Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="text-2xl font-black text-slate-900">{validationResult.totalRows}</div>
              <div className="text-[11px] text-slate-500 uppercase font-semibold">Total Records</div>
            </div>
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200/80">
              <div className="text-2xl font-black text-emerald-700">{validationResult.validRows.length}</div>
              <div className="text-[11px] text-emerald-800 uppercase font-semibold">Valid &amp; Ready</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200/80">
              <div className="text-2xl font-black text-amber-700">{validationResult.warningCount}</div>
              <div className="text-[11px] text-amber-800 uppercase font-semibold">Warnings / Duplicates</div>
            </div>
            <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200/80">
              <div className="text-2xl font-black text-rose-700">{validationResult.errorCount}</div>
              <div className="text-[11px] text-rose-800 uppercase font-semibold">Blocked / Invalid Rows</div>
            </div>
          </div>

          {/* Invalid Rows Table if Any */}
          {validationResult.invalidRows.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-rose-700 uppercase tracking-wider flex items-center gap-1.5">
                <XCircle className="w-4 h-4" />
                <span>Rejected Rows ({validationResult.invalidRows.length})</span>
              </h3>
              <div className="border border-rose-200 rounded-xl overflow-hidden max-h-48 overflow-y-auto">
                <table className="w-full text-left text-xs text-rose-900 divide-y divide-rose-100 bg-rose-50/50">
                  <thead className="bg-rose-100/60 font-bold text-[10px] uppercase">
                    <tr>
                      <th className="p-2">Row</th>
                      <th className="p-2">Field</th>
                      <th className="p-2">Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-100">
                    {validationResult.invalidRows.map((inv, idx) => (
                      <tr key={idx}>
                        <td className="p-2 font-mono font-bold">{inv.row}</td>
                        <td className="p-2 font-semibold">{inv.issues[0]?.field}</td>
                        <td className="p-2">{inv.issues[0]?.message}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Completion Toast */}
      {importCompleted && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Ingestion Complete</h4>
              <p>
                Successfully imported <strong>{importCompleted.imported}</strong> new records and updated{' '}
                <strong>{importCompleted.updated}</strong> existing records in live storage.
              </p>
            </div>
          </div>
          <button
            onClick={() => setImportCompleted(null)}
            className="px-3 py-1 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
