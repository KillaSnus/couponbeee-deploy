import React from 'react';
import { Tag, Flame, ShieldCheck } from 'lucide-react';
import { Merchant } from '../../types';

interface MerchantCardProps {
  merchant: Merchant;
  onNavigate: (path: string) => void;
}

export const MerchantCard: React.FC<MerchantCardProps> = ({ merchant, onNavigate }) => {
  return (
    <div
      onClick={() => onNavigate(`/stores/${merchant.slug}`)}
      className="group bg-white rounded-2xl border border-slate-200/90 hover:border-teal-500/50 hover:shadow-md transition-all duration-200 p-5 cursor-pointer flex flex-col justify-between"
    >
      <div>
        {/* Top Header: Logo + Best Discount */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="w-14 h-14 rounded-xl border border-slate-100 bg-white p-1.5 flex items-center justify-center overflow-hidden shadow-xs shrink-0">
            <img
              src={merchant.logo}
              alt={merchant.name}
              className="w-full h-full object-contain rounded-lg group-hover:scale-105 transition-transform"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="text-right">
            <span className="inline-block px-2.5 py-1 bg-teal-50 border border-teal-100/80 rounded-lg text-xs font-extrabold text-teal-800">
              {merchant.bestDiscount}
            </span>
          </div>
        </div>

        {/* Merchant Name */}
        <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
          {merchant.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
          {merchant.shortDescription}
        </p>
      </div>

      {/* Counts and Indicators */}
      <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 font-medium">
            <Tag className="w-3.5 h-3.5 text-teal-600" />
            <span>{merchant.couponCount} Codes</span>
          </span>
          {merchant.dealCount > 0 && (
            <span className="flex items-center gap-1 font-medium text-amber-700">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>{merchant.dealCount} Deals</span>
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified</span>
        </div>
      </div>
    </div>
  );
};
