import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Users, 
  BadgeCheck, 
  GraduationCap, 
  ScrollText as QuizIcon, 
  BarChart3, 
  Settings, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { cn } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Users, label: 'Student Management', path: '/students' },
  { icon: BadgeCheck, label: 'HRM', path: '/hrm' },
  { icon: GraduationCap, label: 'Academic', path: '/academic' },
  { icon: QuizIcon, label: 'CBT Module', path: '/cbt' },
  { icon: BarChart3, label: 'Grading', path: '/grading' },
];

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-40">
      <div className="px-6 mb-10">
        <h1 className="text-2xl font-bold text-primary tracking-tight">Syiar Gemilang</h1>
        <p className="text-xs text-on-surface-variant font-medium mt-1 uppercase tracking-wider">Educational ERP</p>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-secondary-container text-on-secondary-container shadow-sm" 
                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
            )}
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </NavLink>
        ))}
        
        <div className="px-3 pt-6">
          <button className="w-full bg-primary text-on-primary flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity active:scale-[0.98]">
            <BarChart3 className="w-4 h-4" />
            <span>Quick Report</span>
          </button>
        </div>
      </nav>

      <div className="px-3 mt-auto pt-4 border-t border-outline-variant">
        <ul className="space-y-1">
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="#" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  );
}
