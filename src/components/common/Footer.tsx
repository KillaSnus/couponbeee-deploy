import React, { useState } from 'react';
import { ShieldCheck, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && email.includes('@')) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-sm">
      {/* Newsletter Bar */}
      <div className="border-b border-slate-800/80 bg-slate-900/60 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-md">
            <h3 className="text-white text-lg font-bold">Never miss a verified markdown</h3>
            <p className="text-slate-400 text-sm mt-1">
              Join our weekly savings intelligence brief. Tested promo codes with real checkout logs delivered to your inbox.
            </p>
          </div>
          <div className="w-full md:w-auto">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-400 font-medium py-2 px-4 bg-emerald-950/40 border border-emerald-800/60 rounded-xl">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span>Subscribed! Check your inbox for verified deals.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-850 bg-slate-800/80 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-teal-500 text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-teal-600 hover:bg-teal-500 text-white font-semibold rounded-xl text-sm transition-colors whitespace-nowrap flex items-center justify-center gap-1.5"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Editorial Column */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">BIORALS</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm mb-4">
              Biorals is an independent savings intelligence platform providing tested coupons, authentic discount codes, and verified merchant deals. We verify offers through manual checkout tests and direct merchant partnerships.
            </p>
            <div className="flex flex-wrap gap-2 text-xs text-slate-500">
              <span>Verified Test Logs</span>
              <span>·</span>
              <span>No Fabricated Codes</span>
              <span>·</span>
              <span>Full Source Traceability</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/stores')} className="hover:text-white transition-colors">
                  All Stores (A–Z)
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/coupons')} className="hover:text-white transition-colors">
                  Active Coupons
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/deals')} className="hover:text-white transition-colors">
                  Today's Deals
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/categories')} className="hover:text-white transition-colors">
                  Popular Categories
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/blog')} className="hover:text-white transition-colors">
                  Savings Guides & Blog
                </button>
              </li>
            </ul>
          </div>

          {/* Community & Verification */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Community</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/submit-coupon')} className="hover:text-white transition-colors">
                  Submit a Coupon
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/report-coupon')} className="hover:text-white transition-colors">
                  Report Expired Code
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/about')} className="hover:text-white transition-colors">
                  Our Verification Method
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/admin')} className="text-teal-400 hover:text-teal-300 transition-colors">
                  Admin Verification Desk
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & Compliance */}
          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-3">Legal & Trust</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('/affiliate-disclosure')} className="hover:text-white transition-colors">
                  Affiliate Disclosure
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/terms')} className="hover:text-white transition-colors">
                  Terms of Service
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/cookie-policy')} className="hover:text-white transition-colors">
                  Cookie Policy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/contact')} className="hover:text-white transition-colors">
                  Contact Editorial Team
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Affiliate Disclosure Notice */}
        <div className="mt-10 pt-6 border-t border-slate-850 border-slate-800 text-xs text-slate-500 leading-relaxed">
          <p>
            <strong className="text-slate-400">Affiliate Disclosure:</strong> Biorals is supported by our readers. When you click on links and coupon codes on this site to make a purchase, we may earn an affiliate commission at no extra cost to you. We do not accept payment to artificially manipulate coupon verification statuses or inflate discounts. All testing logs represent factual records created by our editorial analysts.
          </p>
          <div className="mt-4 flex flex-col sm:flex-row items-center justify-between text-slate-500 gap-2">
            <div>
              &copy; {new Date().getFullYear()} Biorals. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span>SSL 256-Bit Encrypted</span>
              <span>·</span>
              <span>WCAG AA Accessible</span>
              <span>·</span>
              <span>Independent Editorial Standards</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
