import React, { useState } from 'react';
import {
  Search,
  ShieldCheck,
  Tag,
  ShoppingBag,
  Grid,
  BookOpen,
  PlusCircle,
  Menu,
  X,
  Settings,
} from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenSearch?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, onNavigate, onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Stores', path: '/stores' },
    { label: 'Coupons', path: '/coupons' },
    { label: 'Deals', path: '/deals' },
    { label: 'Categories', path: '/categories' },
    { label: 'Blog', path: '/blog' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      {/* Top Notification / Trust Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400"></span>
            <span className="font-medium text-white">Biorals Truth Standard:</span>
            <span className="hidden sm:inline">Every coupon includes genuine checkout test logs. No fake 100% claims.</span>
            <span className="sm:hidden">Real checkout test logs.</span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <button
              onClick={() => onNavigate('/affiliate-disclosure')}
              className="hover:text-white transition-colors underline-offset-2 hover:underline"
            >
              Affiliate Disclosure
            </button>
            <button
              onClick={() => onNavigate('/admin')}
              className="text-teal-400 hover:text-teal-300 font-medium flex items-center gap-1"
              title="Editorial Admin Console"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin CMS</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar (Top Bar Contract: 3 Zones) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Zone 1: Brand Wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 group text-left focus:outline-none"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center text-white shadow-sm shadow-teal-500/20 group-hover:scale-105 transition-transform">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                  BIORALS
                </span>
                <span className="text-[10px] uppercase tracking-widest font-semibold text-teal-700">
                  Verified Coupons
                </span>
              </div>
            </button>
          </div>

          {/* Quick Search Bar (Desktop center) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <button
              onClick={onOpenSearch || (() => onNavigate('/search'))}
              className="w-full flex items-center justify-between px-3.5 py-2 bg-slate-100 hover:bg-slate-200/80 rounded-xl text-slate-500 text-sm border border-slate-200/70 transition-colors group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5 truncate">
                <Search className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition-colors shrink-0" />
                <span className="truncate">Search 1,000+ stores, codes or deals...</span>
              </div>
              <kbd className="hidden xl:inline-block px-1.5 py-0.5 text-[11px] font-mono text-slate-400 bg-white border border-slate-200 rounded">
                ⌘K
              </kbd>
            </button>
          </div>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            {navLinks.map((item) => {
              const active = currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path));
              return (
                <button
                  key={item.path}
                  onClick={() => onNavigate(item.path)}
                  className={`transition-colors whitespace-nowrap py-1 ${
                    active ? 'text-teal-700 font-semibold border-b-2 border-teal-600' : 'hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onOpenSearch || (() => onNavigate('/search'))}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('/submit-coupon')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors border border-slate-200/70"
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              <span>Submit Code</span>
            </button>

            <button
              onClick={() => onNavigate('/deals')}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-sm"
            >
              Today's Deals
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                onNavigate('/stores');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-800 font-medium text-sm"
            >
              <ShoppingBag className="w-4 h-4 text-teal-600" />
              <span>Stores</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/coupons');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-800 font-medium text-sm"
            >
              <Tag className="w-4 h-4 text-teal-600" />
              <span>Coupons</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/deals');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-800 font-medium text-sm"
            >
              <ShoppingBag className="w-4 h-4 text-teal-600" />
              <span>Deals</span>
            </button>
            <button
              onClick={() => {
                onNavigate('/categories');
                setMobileMenuOpen(false);
              }}
              className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 text-slate-800 font-medium text-sm"
            >
              <Grid className="w-4 h-4 text-teal-600" />
              <span>Categories</span>
            </button>
          </div>

          <div className="border-t border-slate-100 pt-2 space-y-1">
            <button
              onClick={() => {
                onNavigate('/blog');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2 text-sm text-slate-700 hover:text-slate-900"
            >
              <span className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-slate-400" /> Savings Guides & Blog
              </span>
            </button>
            <button
              onClick={() => {
                onNavigate('/submit-coupon');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2 text-sm text-slate-700 hover:text-slate-900"
            >
              <span className="flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-teal-600" /> Submit a Verified Coupon
              </span>
            </button>
            <button
              onClick={() => {
                onNavigate('/admin');
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between py-2 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              <span className="flex items-center gap-2">
                <Settings className="w-4 h-4 text-teal-600" /> Admin CMS Console
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
