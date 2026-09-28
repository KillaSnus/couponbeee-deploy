import React from 'react';
import { ExternalLink, Truck, Clock, Sparkles } from 'lucide-react';
import { Deal } from '../../types';

interface DealCardProps {
  deal: Deal;
  onGetDeal: (deal: Deal) => void;
  onNavigateToMerchant?: (slug: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({ deal, onGetDeal, onNavigateToMerchant }) => {
  return (
    <div className="group bg-white rounded-2xl border border-slate-200/90 hover:border-slate-300 transition-all duration-200 overflow-hidden shadow-sm hover:shadow-md flex flex-col h-full">
      {/* Product Image Slot with Fallback Container */}
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        <img
          src={deal.image}
          alt={deal.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
          onError={(e) => {
            // Styled CSS fallback container
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        {/* Discount Badge */}
        <div className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-sm text-white text-xs font-extrabold px-2.5 py-1 rounded-lg tracking-tight">
          {deal.discountPercentage}% OFF
        </div>

        {deal.featured && (
          <div className="absolute top-3 right-3 bg-teal-500 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3 h-3" />
            <span>Featured Deal</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          {/* Merchant Label */}
          {deal.merchantName && (
            <div className="flex items-center justify-between text-xs">
              <button
                onClick={() => onNavigateToMerchant && deal.merchantSlug && onNavigateToMerchant(deal.merchantSlug)}
                className="font-bold text-slate-700 hover:text-teal-700 uppercase tracking-wider text-[11px]"
              >
                {deal.merchantName}
              </button>
              <span className="text-slate-400 text-[11px] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                Updated {new Date(deal.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}

          {/* Deal Title */}
          <h3
            onClick={() => onGetDeal(deal)}
            className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors line-clamp-2 cursor-pointer leading-snug"
          >
            {deal.title}
          </h3>

          {/* Price Block */}
          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              ${deal.salePrice.toFixed(2)}
            </span>
            <span className="text-sm font-medium text-slate-400 line-through">
              ${deal.originalPrice.toFixed(2)}
            </span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Save ${(deal.originalPrice - deal.salePrice).toFixed(2)}
            </span>
          </div>

          {/* Shipping Info */}
          {deal.shippingInfo && (
            <div className="text-xs text-slate-500 flex items-center gap-1.5 pt-1">
              <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">{deal.shippingInfo}</span>
            </div>
          )}

          {/* Editorial Notes */}
          {deal.editorialNotes && (
            <p className="text-xs text-slate-500 line-clamp-2 pt-1 border-t border-slate-100">
              <strong className="text-slate-700">Editor&apos;s Note: </strong>
              {deal.editorialNotes}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="pt-4 mt-4 border-t border-slate-100">
          <button
            onClick={() => onGetDeal(deal)}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-900 hover:bg-teal-700 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-sm"
          >
            <span>Get Deal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
