'use client';

import React from 'react';
import { 
  Users, 
  BadgeCheck, 
  ClipboardList,
  ScrollText, 
  GraduationCap, 
  Wallet,
  Package,
  ShieldCheck,
  CheckSquare,
  PlusCircle,
  Upload,
  CreditCard,
  Plus,
  TrendingUp, 
  ArrowRight,
  MoreVertical,
  Loader2,
  BookOpen,
  Layers,
  Calendar
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';

const CHART_DATA_DEFAULT = [
  { name: 'TKJ', value: 510, color: '#1e40af' },
  { name: 'DBS', value: 360, color: '#173bab' },
  { name: 'DG', value: 430, color: '#3755c3' },
];

const STATS_DEFAULT = [
  { label: 'Total Siswa Aktif', value: '1,300', icon: Users, trend: '+2.4%', color: 'primary' },
  { label: 'Total Guru & Staf', value: '84', icon: BadgeCheck, trend: null, color: 'primary' },
  { label: 'Pendaftar PPDB', value: '156', icon: ClipboardList, trend: '+12%', color: 'primary' },
  { label: 'Ujian CBT Berlangsung', value: '3', icon: ScrollText, trend: 'Aktif', color: 'error' },
  { label: 'Kehadiran Siswa', value: '96%', icon: GraduationCap, trend: 'Hari Ini', color: 'secondary' },
  { label: 'Tagihan SPP Lunas', value: '82%', icon: Wallet, trend: '+5% bln ini', color: 'primary' },
  { label: 'Total Aset Inventaris', value: '1,240', icon: Package, trend: null, color: 'primary' },
  { label: 'Pengguna Sistem', value: '12', icon: ShieldCheck, trend: 'Online', color: 'primary' },
];

const activities = [
  { user: 'Budi Santoso', action: 'mengunggah soal ujian "Matematika Dasar"', time: '10 menit yang lalu' },
  { user: 'Admin Pusat', action: 'mengubah status 45 siswa menjadi Aktif', time: '1 jam yang lalu' },
  { user: 'Sistem', action: 'menyelesaikan sinkronisasi absensi biometrik', time: 'Hari ini, 07:00' },
];

export default function DashboardPage() {
  const router = useRouter();
  const [majorData, setMajorData] = React.useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchDashboardData = async () => {
    try {
      const res = await apiRequest('/stats/dashboard');
      setMajorData(res.majorDistribution || []);
      setDashboardStats(res.overview);
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, []);

  const statsItems = [
    { label: 'Total Siswa Aktif', value: dashboardStats?.totalStudents?.toLocaleString() || '0', icon: Users, trend: '+0%', color: 'primary' },
    { label: 'Total Guru & Staf', value: dashboardStats?.totalEmployees?.toLocaleString() || '0', icon: BadgeCheck, trend: null, color: 'primary' },
    { label: 'Pendaftar PPDB', value: dashboardStats?.applicantPPDB?.toLocaleString() || '0', icon: ClipboardList, trend: null, color: 'primary' },
    { label: 'Ujian CBT Berlangsung', value: dashboardStats?.ongoingExams?.toLocaleString() || '0', icon: ScrollText, trend: 'LIVE', color: 'error' },
    { label: 'Kehadiran Siswa', value: `${dashboardStats?.attendancePercentage || 0}%`, icon: GraduationCap, trend: 'Hari Ini', color: 'secondary' },
    { label: 'Tagihan SPP Lunas', value: `${dashboardStats?.paymentPercentage || 0}%`, icon: Wallet, trend: 'Bulan Ini', color: 'primary' },
    { label: 'Total Aset Inventaris', value: dashboardStats?.totalAssets?.toLocaleString() || '0', icon: Package, trend: null, color: 'primary' },
    { label: 'Pengguna Sistem', value: dashboardStats?.systemUsers?.toLocaleString() || '0', icon: ShieldCheck, trend: 'Online', color: 'primary' },
  ];

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-on-surface-variant font-medium Memuat data ERP...">Memuat data ERP...</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Dashboard ERP Terintegrasi</h2>
          <p className="text-on-surface-variant font-medium mt-1">Pusat kendali operasional akademik, kesiswaan, keuangan, dan aset Syiar Gemilang.</p>
        </div>
        <div className="bg-surface-container font-semibold text-on-surface-variant px-5 py-2.5 rounded-lg text-sm border border-outline-variant shadow-sm">
          Sabtu, 9 Mei 2026
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 bg-primary/10 rounded-full text-primary`}>
                <stat.icon className="w-5 h-5 flex-shrink-0" />
              </div>
              {stat.trend && (
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider flex items-center gap-1 bg-secondary-container/30 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" />
                  {stat.trend}
                </span>
              )}
            </div>
            <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-on-surface tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-on-surface">Distribusi Siswa per Jurusan</h3>
            <button className="text-on-surface-variant hover:bg-surface-container p-2 rounded-full transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={majorData.length > 0 ? majorData : CHART_DATA_DEFAULT}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#444653', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#444653', fontSize: 12, fontWeight: 500 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                  {(majorData.length > 0 ? majorData : CHART_DATA_DEFAULT).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-6">Aksi Cepat</h3>
            <div className="space-y-4">
              {[
                { label: 'Kelola Jurusan', icon: BookOpen, path: '/majors' },
                { label: 'Kelola Angkatan', icon: Calendar, path: '/batches' },
                { label: 'Kelola Kelas', icon: Layers, path: '/classes' },
                { label: 'Import Data Siswa', icon: Upload, path: '/students' },
                { label: 'Verifikasi Pendaftar PPDB', icon: CheckSquare, path: '/ppdb' },
              ].map((action, i) => (
                <button 
                  key={i} 
                  onClick={() => router.push(action.path)}
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-surface-container transition-all group active:scale-[0.98]"
                >
                  <div className="flex items-center gap-3 text-on-surface">
                    <action.icon className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                    <span className="text-sm font-semibold">{action.label}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-outline-variant group-hover:text-primary transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-on-surface">Log Aktivitas</h3>
              <a href="#" className="text-xs font-bold text-primary hover:underline">Lihat Semua</a>
            </div>
            <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant/30">
              {activities.map((log, i) => (
                <div key={i} className="relative">
                  <div className={`absolute -left-[23px] w-5 h-5 bg-surface-container-lowest border-2 ${i === 0 ? 'border-primary' : 'border-outline-variant'} rounded-full flex items-center justify-center`}>
                    {i === 0 && <div className="w-2 h-2 bg-primary rounded-full"></div>}
                  </div>
                  <p className="text-sm text-on-surface leading-snug">
                    <span className="font-bold">{log.user}</span> {log.action}.
                  </p>
                  <p className="text-xs font-medium text-outline mt-1.5">{log.time}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
