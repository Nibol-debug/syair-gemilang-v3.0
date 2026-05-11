'use client';

import React, { useState } from 'react';
import { Search, Bell, HelpCircle, LayoutGrid, X } from 'lucide-react';

export default function Navbar() {
  const [search, setSearch] = useState('');

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Global search for:', search);
    // Future integration point for global search
  };

  return (
    <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between px-8 sticky top-0 z-30 ml-[240px]">
      <div className="flex items-center gap-8 flex-1">
        <form onSubmit={handleGlobalSearch} className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
          <input 
            type="text" 
            placeholder="Cari data siswa, guru..." 
            className="w-full bg-surface-container px-10 py-2 rounded-full text-sm border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all pr-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              type="button"
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>
        
        <nav className="flex items-center gap-6 hidden md:flex">
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
          <div className="w-10 h-10 rounded-full border border-outline-variant shadow-sm cursor-pointer bg-primary-container flex items-center justify-center text-on-primary-container font-bold">
            A
          </div>
        </div>
      </div>
    </header>
  );
}
