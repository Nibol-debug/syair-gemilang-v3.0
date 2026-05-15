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
  Layers,
  HeartHandshake,
  Clock,
  DollarSign,
  Award,
  ArrowRightLeft,
  History,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn, getUserFromToken } from '../lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua', 'Bendahara', 'Staf Sarpras'] },
  { icon: Users, label: 'Manajemen Siswa', path: '/students', roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'] },
  { icon: BadgeCheck, label: 'Kepegawaian (HRM)', path: '/hrm', roles: ['Administrator Utama', 'Kepala Sekolah'], hasSubmenu: true },
  { icon: GraduationCap, label: 'Akademik', path: '/academic', roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'] },
  { icon: HeartHandshake, label: 'Penilaian Perilaku', path: '/academic/behavior', roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua'] },
  { icon: QuizIcon, label: 'Modul Ujian (CBT)', path: '/cbt', roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa'] },
  { icon: BarChart3, label: 'Penilaian', path: '/grading', roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua'] },
  { icon: ClipboardList, label: 'PPDB Online', path: '/ppdb-admin', roles: ['Administrator Utama', 'Kepala Sekolah'] },
  { icon: Wallet, label: 'Keuangan', path: '/finance', roles: ['Administrator Utama', 'Kepala Sekolah', 'Bendahara', 'Orang Tua', 'Siswa'] },
  { icon: Package, label: 'Inventaris', path: '/assets', roles: ['Administrator Utama', 'Kepala Sekolah', 'Staf Sarpras'], hasSubmenu: true },
];

const masterDataItems = [
  { icon: BookOpen, label: 'Data Jurusan', path: '/majors', roles: ['Administrator Utama', 'Kepala Sekolah'] },
  { icon: Calendar, label: 'Data Angkatan', path: '/batches', roles: ['Administrator Utama', 'Kepala Sekolah'] },
  { icon: Layers, label: 'Data Kelas', path: '/classes', roles: ['Administrator Utama', 'Kepala Sekolah'] },
  { icon: ShieldCheck, label: 'Manajemen Pengguna', path: '/users', roles: ['Administrator Utama'] },
  { icon: Settings, label: 'Pengaturan Nilai', path: '/grading/settings', roles: ['Administrator Utama', 'Kepala Sekolah'] },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);
  const [hrmExpanded, setHrmExpanded] = React.useState(false);
  const [assetsExpanded, setAssetsExpanded] = React.useState(false);

  React.useEffect(() => {
    setUser(getUserFromToken());
    setHrmExpanded(pathname?.startsWith('/hrm') || false);
    setAssetsExpanded(pathname?.startsWith('/assets/loans') || false);
  }, [pathname]);

  const filteredNavItems = navItems.filter(item => !user || item.roles.includes(user.role));
  const filteredMasterDataItems = masterDataItems.filter(item => !user || item.roles.includes(user.role));
  
  const isHrmActive = pathname === '/hrm' || pathname?.startsWith('/hrm/');
  const isAssetsActive = pathname === '/assets' || pathname?.startsWith('/assets/');

  const hrmSubItems = [
    { label: 'Manajemen Pegawai', path: '/hrm', icon: Users },
    { label: 'Presensi Pegawai', path: '/hrm/attendance', icon: Clock },
    { label: 'Cuti & Izin Saya', path: '/hrm/my-leaves', icon: Calendar },
    { label: 'Approval Cuti', path: '/hrm/leaves-approval', icon: ShieldCheck },
    { label: 'Slip Gaji Saya', path: '/hrm/my-payroll', icon: DollarSign },
    { label: 'Manajemen Payroll', path: '/hrm/payrolls', icon: DollarSign },
    { label: 'PKG Saya', path: '/hrm/my-appraisal', icon: Award },
    { label: 'Evaluasi Kinerja', path: '/hrm/appraisals', icon: Award },
    { label: 'Riwayat Pegawai', path: '/hrm/history', icon: History },
  ];

  const assetsSubItems = [
    { label: 'Daftar Inventaris', path: '/assets', icon: Package },
    { label: 'Peminjaman Aset', path: '/assets/loans', icon: ArrowRightLeft },
  ];
  
  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-50 transition-transform duration-300 md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 mb-8 text-center md:text-left">
          <h1 className="text-2xl font-black text-primary tracking-tighter leading-none">SYIAR<br/><span className="text-secondary">GEMILANG</span></h1>
          <p className="text-[10px] text-on-surface-variant font-bold mt-2 uppercase tracking-[0.2em] opacity-60">Educational ERP v3.0</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          <div className="px-4 mb-2 text-[10px] font-black text-outline uppercase tracking-widest opacity-40">Main Modules</div>
          {filteredNavItems.map((item) => {
            const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
            
            if (item.hasSubmenu && item.path === '/hrm') {
              return (
                <div key={item.path}>
                  <button
                    onClick={() => setHrmExpanded(!hrmExpanded)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 w-full",
                      isHrmActive 
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isHrmActive ? "text-on-primary" : "text-outline")} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {hrmExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {hrmExpanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-outline-variant/30 pl-4">
                      {hrmSubItems.map((subItem) => {
                        const isSubActive = pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                              isSubActive 
                                ? "bg-primary/20 text-primary" 
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                            )}
                          >
                            <subItem.icon className={cn("w-3.5 h-3.5", isSubActive ? "text-primary" : "text-outline")} />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            if (item.hasSubmenu && item.path === '/assets') {
              return (
                <div key={item.path}>
                  <button
                    onClick={() => setAssetsExpanded(!assetsExpanded)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 w-full",
                      isAssetsActive 
                        ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]" 
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isAssetsActive ? "text-on-primary" : "text-outline")} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {assetsExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                  </button>
                  {assetsExpanded && (
                    <div className="ml-6 mt-1 space-y-1 border-l-2 border-outline-variant/30 pl-4">
                      {assetsSubItems.map((subItem) => {
                        const isSubActive = pathname === subItem.path;
                        return (
                          <Link
                            key={subItem.path}
                            href={subItem.path}
                            onClick={onClose}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all duration-200",
                              isSubActive 
                                ? "bg-primary/20 text-primary" 
                                : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                            )}
                          >
                            <subItem.icon className={cn("w-3.5 h-3.5", isSubActive ? "text-primary" : "text-outline")} />
                            <span>{subItem.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.path}
                href={item.path}
                onClick={onClose}
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

          {filteredMasterDataItems.length > 0 && (
            <>
              <div className="px-4 mt-8 mb-2 text-[10px] font-black text-outline uppercase tracking-widest opacity-40">Master Data & Access</div>
              {filteredMasterDataItems.map((item) => {
                const isActive = pathname === item.path || pathname?.startsWith(item.path + '/');
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
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
            </>
          )}
          
          {(user?.role === 'Administrator Utama' || user?.role === 'Kepala Sekolah') && (
            <div className="px-3 pt-8">
              <button className="w-full bg-surface-container-high text-on-surface flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-outline-variant/30 transition-all active:scale-[0.98] border border-outline-variant/50">
                <BarChart3 className="w-4 h-4" />
                <span>Buat Laporan</span>
              </button>
            </div>
          )}
        </nav>

        <div className="px-3 mt-auto pt-4 border-t border-outline-variant">
          <ul className="space-y-1">
            <li>
              <Link 
                href="/settings" 
                onClick={onClose}
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors"
              >
                <Settings className="w-5 h-5" />
                <span>Pengaturan</span>
              </Link>
            </li>
            <li>
              <Link 
                href="/login" 
                className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors" 
                onClick={() => {
                  localStorage.removeItem('token');
                  sessionStorage.removeItem('token');
                  if (onClose) onClose();
                }}
              >
                <LogOut className="w-5 h-5" />
                <span>Keluar</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>
    </>
  );
}
