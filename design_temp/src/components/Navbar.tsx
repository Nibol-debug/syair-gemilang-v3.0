import React from 'react';
import { Search, Bell, HelpCircle, LayoutGrid } from 'lucide-react';

export function Navbar() {
  return (
    <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8 sticky top-0 z-30 ml-[240px]">
      <div className="flex items-center gap-8 flex-1">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input 
            type="text" 
            placeholder="Cari data siswa, guru..." 
            className="w-full bg-surface-container px-10 py-2 rounded-full text-sm border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Dashboard</a>
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Analytics</a>
          <a href="#" className="text-sm font-semibold text-on-surface-variant hover:text-primary transition-colors">Reports</a>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 border-r border-outline-variant pr-4 mr-2">
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors relative">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full border-2 border-white"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden lg:block">
            <p className="text-sm font-semibold text-on-surface leading-tight">Admin Profile</p>
            <p className="text-xs text-outline">Administrator</p>
          </div>
          <img 
            src="https://lh3.googleusercontent.com/a/ACg8ocL_F_4Xq_vPzXp-9ZfC8kX0-9J_c_V_v_V_v_V_v_V=s96-c" 
            alt="User" 
            className="w-10 h-10 rounded-full border border-outline-variant object-cover shadow-sm cursor-pointer"
          />
        </div>
      </div>
    </header>
  );
}
