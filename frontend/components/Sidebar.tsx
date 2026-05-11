'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Users, 
  BadgeCheck, 
  GraduationCap, 
  ScrollText as QuizIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  ClipboardList,
  Wallet,
  Package,
  BookOpen,
  Calendar,
  Layers
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Student Management', path: '/students' },
  { icon: BadgeCheck, label: 'Kepegawaian (HRM)', path: '/hrm' },
  { icon: GraduationCap, label: 'Academic', path: '/academic' },
  { icon: QuizIcon, label: 'CBT Module', path: '/cbt' },
  { icon: BarChart3, label: 'Grading', path: '/grading' },
  { icon: ClipboardList, label: 'PPDB Online', path: '/ppdb' },
  { icon: Wallet, label: 'Keuangan', path: '/finance' },
  { icon: Package, label: 'Inventaris', path: '/assets' },
];

const masterDataItems = [
  { icon: BookOpen, label: 'Data Jurusan', path: '/majors' },
  { icon: Calendar, label: 'Data Angkatan', path: '/batches' },
  { icon: Layers, label: 'Data Kelas', path: '/classes' },
  { icon: ShieldCheck, label: 'Manajemen Pengguna', path: '/users' },
];

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-40 hidden md:flex">
      <div className="px-6 mb-8 text-center md:text-left">
        <h1 className="text-2xl font-black text-primary tracking-tighter leading-none">SYIAR<br/><span className="text-secondary">GEMILANG</span></h1>
        <p className="text-[10px] text-on-surface-variant font-bold mt-2 uppercase tracking-[0.2em] opacity-60">Educational ERP v3.0</p>
      </div>

      <nav className="flex-1 px-3 space-y-1 overflow-y-auto custom-scrollbar">
        <div className="px-4 mb-2 text-[10px] font-black text-outline uppercase tracking-widest opacity-40">Main Modules</div>
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-on-primary" : "text-outline")} />
              <span>{item.label}</span>
            </Link>
          );
        })}

        <div className="px-4 mt-8 mb-2 text-[10px] font-black text-outline uppercase tracking-widest opacity-40">Master Data & Access</div>
        {masterDataItems.map((item) => {
          const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                isActive 
                  ? "bg-secondary-container text-on-secondary-container shadow-sm" 
                  : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
              )}
            >
              <item.icon className={cn("w-4 h-4", isActive ? "text-on-secondary-container" : "text-outline")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
        
        <div className="px-3 pt-8">
          <button className="w-full bg-surface-container-high text-on-surface flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-outline-variant/30 transition-all active:scale-[0.98] border border-outline-variant/50">
            <BarChart3 className="w-4 h-4" />
            <span>Generate Report</span>
          </button>
        </div>
      </nav>

      <div className="px-3 mt-auto pt-4 border-t border-outline-variant">
        <ul className="space-y-1">
          <li>
            <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
          </li>
          <li>
            <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors" onClick={() => localStorage.removeItem('token')}>
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}
