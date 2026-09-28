import React from 'react';
import { Home, ShoppingBag, Tag, Flame, ShieldAlert } from 'lucide-react';

interface MobileBottomNavProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPath, onNavigate }) => {
  const tabs = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Stores', path: '/stores', icon: ShoppingBag },
    { label: 'Coupons', path: '/coupons', icon: Tag },
    { label: 'Deals', path: '/deals', icon: Flame },
    { label: 'Admin', path: '/admin', icon: ShieldAlert },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg px-2 h-14"
      style={{ maxHeight: '15vh' }}
    >
      <div className="grid grid-cols-5 h-full items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive =
            tab.path === '/'
              ? currentPath === '/'
              : currentPath === tab.path || currentPath.startsWith(tab.path);

          return (
            <button
              key={tab.path}
              onClick={() => onNavigate(tab.path)}
              className={`flex flex-col items-center justify-center min-h-[44px] min-w-[44px] w-full py-1 transition-colors ${
                isActive ? 'text-teal-700 font-semibold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] tracking-tight mt-0.5 leading-none">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
