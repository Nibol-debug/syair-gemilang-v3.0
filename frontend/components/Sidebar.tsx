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
  ChevronRight,
  FileText,
  Book,
  CheckSquare,
  Target,
  FileSpreadsheet,
  School,
  UserCheck
} from 'lucide-react';
import { cn, getUserFromToken } from '../lib/utils';

const mainModules = [
  {
    icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard',
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua', 'Bendahara', 'Staf Sarpras'],
  },
  {
    icon: Users, label: 'Manajemen Siswa', path: '/students',
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'],
  },
  {
    icon: BadgeCheck, label: 'Kepegawaian (HRM)', path: '/hrm', hasSubmenu: true,
    roles: ['Administrator Utama', 'Kepala Sekolah'],
    subItems: [
      { label: 'Manajemen Pegawai', path: '/hrm', icon: Users },
      { label: 'Presensi Pegawai', path: '/hrm/attendance', icon: Clock },
      { label: 'Cuti & Izin Saya', path: '/hrm/my-leaves', icon: Calendar },
      { label: 'Approval Cuti', path: '/hrm/leaves-approval', icon: ShieldCheck },
      { label: 'Slip Gaji Saya', path: '/hrm/my-payroll', icon: DollarSign },
      { label: 'Manajemen Payroll', path: '/hrm/payrolls', icon: DollarSign },
      { label: 'PKG Saya', path: '/hrm/my-appraisal', icon: Award },
      { label: 'Evaluasi Kinerja', path: '/hrm/appraisals', icon: Award },
      { label: 'Riwayat Pegawai', path: '/hrm/history', icon: History },
    ],
  },
  {
    icon: GraduationCap, label: 'Akademik', path: '/academic', hasSubmenu: true,
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas'],
    subItems: [
      { label: 'Dashboard Akademik', path: '/academic', icon: LayoutDashboard },
      { label: 'Mata Pelajaran', path: '/academic?tab=subjects', icon: Book },
      { label: 'Jadwal Pelajaran', path: '/academic?tab=schedule', icon: Calendar },
      { label: 'Presensi Siswa', path: '/academic?tab=attendance', icon: UserCheck },
      { label: 'Rombel', path: '/academic?tab=rombel', icon: Layers },
      { label: 'Jurnal Mengajar', path: '/academic?tab=teaching-log', icon: FileText },
      { label: 'Kalender Akademik', path: '/academic?tab=calendar', icon: Clock },
      { label: 'Penilaian Perilaku', path: '/academic/behavior', icon: HeartHandshake },
    ],
  },
  {
    icon: QuizIcon, label: 'Modul Ujian (CBT)', path: '/cbt', hasSubmenu: true,
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa'],
    subItems: [
      { label: 'Kelola Ujian', path: '/cbt', icon: FileSpreadsheet },
      { label: 'Bank Soal', path: '/cbt/question-banks', icon: BookOpen },
    ],
  },
  {
    icon: BarChart3, label: 'Penilaian', path: '/grading', hasSubmenu: true,
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran', 'Wali Kelas', 'Siswa', 'Orang Tua'],
    subItems: [
      { label: 'Input Nilai', path: '/grading', icon: CheckSquare },
      { label: 'Analisis Nilai', path: '/grading/analysis', icon: Target },
      { label: 'Remedial', path: '/grading/remedial', icon: Award },
      { label: 'E-Rapor', path: '/grading/report-cards', icon: FileText },
      { label: 'Pengaturan Nilai', path: '/grading/settings', icon: Settings },
    ],
  },
  {
    icon: ClipboardList, label: 'PPDB Online', path: '/ppdb-admin',
    roles: ['Administrator Utama', 'Kepala Sekolah'],
  },
  {
    icon: Wallet, label: 'Keuangan', path: '/finance', hasSubmenu: false,
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Bendahara', 'Orang Tua', 'Siswa'],
  },
  {
    icon: Package, label: 'Inventaris', path: '/assets', hasSubmenu: true,
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Staf Sarpras'],
    subItems: [
      { label: 'Daftar Inventaris', path: '/assets', icon: Package },
      { label: 'Peminjaman Aset', path: '/assets/loans', icon: ArrowRightLeft },
    ],
  },
  {
    icon: BarChart3, label: 'Laporan', path: '/reports', hasSubmenu: true,
    roles: ['Administrator Utama', 'Kepala Sekolah', 'Guru Mata Pelajaran'],
    subItems: [
      { label: 'Ringkasan', path: '/reports', icon: LayoutDashboard },
      { label: 'Presensi', path: '/reports/attendance', icon: Clock },
      { label: 'Keuangan', path: '/reports/finance', icon: Wallet },
      { label: 'Akademik', path: '/reports/academic', icon: GraduationCap },
    ],
  },
];

const masterDataItems = [
  { icon: BookOpen, label: 'Data Jurusan', path: '/majors', roles: ['Administrator Utama', 'Kepala Sekolah'] },
  { icon: Calendar, label: 'Data Angkatan', path: '/batches', roles: ['Administrator Utama', 'Kepala Sekolah'] },
  { icon: Layers, label: 'Data Kelas', path: '/classes', roles: ['Administrator Utama', 'Kepala Sekolah'] },
  { icon: ShieldCheck, label: 'Manajemen Pengguna', path: '/users', roles: ['Administrator Utama'] },
];

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const pathname = usePathname();
  const [user, setUser] = React.useState<any>(null);
  const [expandedMenus, setExpandedMenus] = React.useState<Record<string, boolean>>({});

  React.useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  React.useEffect(() => {
    const expanded: Record<string, boolean> = {};
    mainModules.forEach(m => {
      if (m.hasSubmenu && (pathname === m.path || pathname?.startsWith(m.path + '/'))) {
        expanded[m.path] = true;
      }
    });
    setExpandedMenus(prev => ({ ...prev, ...expanded }));
  }, [pathname]);

  const toggleMenu = (path: string) => {
    setExpandedMenus(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const filteredMain = mainModules.filter(item => !user || item.roles.includes(user.role));
  const filteredMaster = masterDataItems.filter(item => !user || item.roles.includes(user.role));

  const isActive = (path: string) => pathname === path || pathname?.startsWith(path + '/');

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm" onClick={onClose} />
      )}

      <aside className={cn(
        "fixed left-0 top-0 h-full w-[240px] bg-surface-container-lowest border-r border-outline-variant flex flex-col py-6 z-50 transition-transform duration-300 md:translate-x-0 overflow-hidden",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="px-6 mb-8 text-center md:text-left flex-shrink-0">
          <h1 className="text-2xl font-black text-primary tracking-tighter leading-none">SYIAR<br/><span className="text-secondary">GEMILANG</span></h1>
          <p className="text-[10px] text-on-surface-variant font-bold mt-2 uppercase tracking-[0.2em] opacity-60">Educational ERP v3.0</p>
        </div>

        <nav className="flex-1 px-3 space-y-1 overflow-y-auto no-scrollbar">
          <div className="px-4 mb-2 text-[10px] font-black text-outline uppercase tracking-widest opacity-40">Main Modules</div>
          {filteredMain.map((item) => {
            const isItemActive = isActive(item.path);

            if (!item.hasSubmenu) {
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                    isItemActive
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isItemActive ? "text-on-primary" : "text-outline")} />
                  <span>{item.label}</span>
                </Link>
              );
            }

            return (
              <div key={item.path}>
                <button
                  onClick={() => toggleMenu(item.path)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 w-full",
                    isItemActive
                      ? "bg-primary text-on-primary shadow-lg shadow-primary/20 scale-[1.02]"
                      : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", isItemActive ? "text-on-primary" : "text-outline")} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {expandedMenus[item.path] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </button>
                {expandedMenus[item.path] && item.subItems && (
                  <div className="ml-6 mt-1 space-y-1 border-l-2 border-outline-variant/30 pl-4">
                    {item.subItems.map((subItem) => {
                      const isSubActive = pathname === subItem.path || pathname?.startsWith(subItem.path + '/');
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
          })}

          {filteredMaster.length > 0 && (
            <>
              <div className="px-4 mt-8 mb-2 text-[10px] font-black text-outline uppercase tracking-widest opacity-40">Master Data & Access</div>
              {filteredMaster.map((item) => {
                const isItemActive = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200",
                      isItemActive
                        ? "bg-secondary-container text-on-secondary-container shadow-sm"
                        : "text-on-surface-variant hover:bg-surface-container hover:text-on-surface"
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isItemActive ? "text-on-secondary-container" : "text-outline")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </>
          )}
        </nav>

        <div className="px-3 mt-auto pt-4 border-t border-outline-variant flex-shrink-0">
          <ul className="space-y-1">
            <li>
              <Link href="/settings" onClick={onClose} className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors">
                <Settings className="w-5 h-5" />
                <span>Pengaturan</span>
              </Link>
            </li>
            <li>
              <Link href="/login" className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-on-surface-variant hover:bg-surface-container transition-colors" onClick={() => { localStorage.removeItem('token'); sessionStorage.removeItem('token'); if (onClose) onClose(); }}>
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
