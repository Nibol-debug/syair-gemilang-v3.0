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
import { cn, getUserFromToken } from '@/lib/utils';

export default function DashboardPage() {
  const [user, setUser] = React.useState<any>(null);
  const [data, setData] = React.useState<any>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  const fetchData = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/stats/dashboard');
      setData(res);
    } catch (err) {
      console.error('Gagal mengambil data dashboard:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
    if (currentUser) {
      fetchData();
    }
  }, [fetchData]);

  if (isLoading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-4 py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-on-surface-variant font-medium">Memuat Portal {user?.role || ''}...</p>
      </div>
    );
  }

  if (user?.role === 'Guru Mata Pelajaran' || user?.role === 'Wali Kelas') {
    return <GuruDashboard data={data} user={user} />;
  }

  if (user?.role === 'Siswa' || user?.role === 'Orang Tua') {
    return <StudentDashboard data={data} user={user} />;
  }

  return <AdminDashboard data={data} user={user} />;
}

// --- SUB-COMPONENTS ---

function AdminDashboard({ data, user }: any) {
  const router = useRouter();
  
  const statsItems = [
    { label: 'Total Siswa Aktif', value: data?.overview?.totalStudents?.toLocaleString() || '0', icon: Users, trend: '+2.4%', color: 'primary' },
    { label: 'Total Guru & Staf', value: data?.overview?.totalEmployees?.toLocaleString() || '0', icon: BadgeCheck, trend: null, color: 'primary' },
    { label: 'Pendaftar PPDB', value: data?.overview?.applicantPPDB?.toLocaleString() || '0', icon: ClipboardList, trend: null, color: 'primary' },
    { label: 'Ujian CBT Berlangsung', value: data?.overview?.ongoingExams?.toLocaleString() || '0', icon: ScrollText, trend: 'LIVE', color: 'error' },
    { label: 'Kehadiran Siswa', value: `${data?.overview?.attendancePercentage || 0}%`, icon: GraduationCap, trend: 'Hari Ini', color: 'secondary' },
    { label: 'Tagihan SPP Lunas', value: `${data?.overview?.paymentPercentage || 0}%`, icon: Wallet, trend: 'Bulan Ini', color: 'primary' },
    { label: 'Total Aset Inventaris', value: data?.overview?.totalAssets?.toLocaleString() || '0', icon: Package, trend: null, color: 'primary' },
    { label: 'Pengguna Sistem', value: data?.overview?.systemUsers?.toLocaleString() || '0', icon: ShieldCheck, trend: 'Online', color: 'primary' },
  ];

  return (
    <div className="space-y-10">
      <DashboardHeader title="Dashboard ERP Utama" subtitle="Pusat kendali operasional akademik, kesiswaan, keuangan, dan aset Syiar Gemilang." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsItems.map((stat, i) => <StatCard key={i} {...stat} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
          <h3 className="text-xl font-bold text-on-surface mb-8">Distribusi Siswa per Jurusan</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.majorDistribution?.length > 0 ? data.majorDistribution : CHART_DATA_DEFAULT}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#444653', fontSize: 12, fontWeight: 500 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#444653', fontSize: 12, fontWeight: 500 }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={60}>
                  {(data?.majorDistribution || CHART_DATA_DEFAULT).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color || `hsl(${index * 45}, 70%, 50%)`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="flex flex-col gap-8">
           <QuickActions items={[
              { label: 'Kelola Jurusan', icon: BookOpen, path: '/majors' },
              { label: 'Kelola Angkatan', icon: Calendar, path: '/batches' },
              { label: 'Kelola Kelas', icon: Layers, path: '/classes' },
              { label: 'Verifikasi PPDB', icon: CheckSquare, path: '/ppdb-admin' },
           ]} />
           <RecentActivity />
        </div>
      </div>
    </div>
  );
}

function GuruDashboard({ data, user }: any) {
  return (
    <div className="space-y-10">
      <DashboardHeader title={`Selamat Datang, ${user.username}`} subtitle="Portal Guru: Kelola kelas, bank soal, dan pantau ujian yang sedang berlangsung." />
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Kelas Diampu" value={data?.totalClasses || '0'} icon={Layers} color="primary" />
        <StatCard label="Ujian Aktif" value={data?.ongoingExams || '0'} icon={ScrollText} color="error" trend="Live" />
        <StatCard label="Ujian Mendatang" value={data?.upcomingExams || '0'} icon={Calendar} color="secondary" />
        <StatCard label="Jurnal Masuk" value={data?.recentTeachingLogs?.length || '0'} icon={BookOpen} color="primary" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
               <h3 className="text-xl font-bold text-on-surface mb-6">Jurnal Mengajar Terakhir</h3>
               <div className="space-y-4">
                  {data?.recentTeachingLogs?.length > 0 ? data.recentTeachingLogs.map((log: any) => (
                    <div key={log.id} className="p-4 border border-outline-variant rounded-xl flex justify-between items-center bg-surface">
                       <div>
                          <p className="font-bold text-on-surface">{log.subject?.name}</p>
                          <p className="text-xs text-on-surface-variant">Kelas: {log.class?.name} • {new Date(log.date).toLocaleDateString()}</p>
                       </div>
                       <div className="text-xs font-bold text-primary px-3 py-1 bg-primary/10 rounded-full uppercase tracking-tighter">Terkirim</div>
                    </div>
                  )) : (
                    <p className="text-sm text-on-surface-variant italic">Belum ada jurnal mengajar.</p>
                  )}
               </div>
            </div>
         </div>
         <div className="flex flex-col gap-8">
            <QuickActions items={[
              { label: 'Manajemen Kelas', icon: Layers, path: '/academic' },
              { label: 'Bank Soal CBT', icon: ScrollText, path: '/cbt' },
              { label: 'Input Nilai', icon: CheckSquare, path: '/grading' },
              { label: 'Presensi Siswa', icon: Users, path: '/academic' },
            ]} />
         </div>
      </div>
    </div>
  );
}

function StudentDashboard({ data, user }: any) {
  return (
    <div className="space-y-10">
      <DashboardHeader title={`Halo, ${user.username}`} subtitle="Portal Siswa: Pantau jadwal ujian, nilai terbaru, dan status administrasi Anda." />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard label="Ujian Berlangsung" value={data?.ongoingExams || '0'} icon={ScrollText} color="error" trend="Akses Sekarang" />
        <StatCard label="Kehadiran" value={`${data?.attendanceCount || 0}`} icon={Users} color="secondary" trend="Total Hadir" />
        <StatCard label="Tunggakan SPP" value={data?.unpaidFees?.length || '0'} icon={Wallet} color="primary" trend="Bulan ini" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-on-surface mb-6">Nilai Terakhir</h3>
            <div className="space-y-4">
               {data?.recentGrades?.length > 0 ? data.recentGrades.map((grade: any) => (
                 <div key={grade.id} className="flex justify-between items-center p-4 border-b border-outline-variant/30">
                    <div>
                       <p className="font-bold text-on-surface">{grade.subject?.name}</p>
                       <p className="text-xs text-on-surface-variant capitalize">{grade.type}</p>
                    </div>
                    <div className="text-2xl font-black text-primary">{grade.score}</div>
                 </div>
               )) : (
                 <p className="text-sm text-on-surface-variant italic">Belum ada nilai yang diinput.</p>
               )}
            </div>
         </div>
         <div className="flex flex-col gap-8">
            <QuickActions items={[
              { label: 'Ikuti Ujian', icon: ScrollText, path: '/cbt' },
              { label: 'Lihat Rapor', icon: GraduationCap, path: '/grading' },
              { label: 'Bayar SPP', icon: Wallet, path: '/finance' },
            ]} />
         </div>
      </div>
    </div>
  );
}

// --- REUSABLE WIDGETS ---

function DashboardHeader({ title, subtitle }: any) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">{title}</h2>
        <p className="text-on-surface-variant font-medium mt-1">{subtitle}</p>
      </div>
      <div className="bg-surface-container font-semibold text-on-surface-variant px-5 py-2.5 rounded-lg text-sm border border-outline-variant shadow-sm hidden md:block">
        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, trend, color }: any) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col relative overflow-hidden group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2.5 rounded-full", color === 'error' ? 'bg-error/10 text-error' : color === 'secondary' ? 'bg-secondary/10 text-secondary' : 'bg-primary/10 text-primary')}>
          <Icon className="w-5 h-5 flex-shrink-0" />
        </div>
        {trend && (
          <span className={cn("text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 px-2 py-1 rounded-full", color === 'error' ? 'bg-error/10 text-error animate-pulse' : 'bg-secondary-container/30 text-secondary')}>
            {trend.includes('+') && <TrendingUp className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      <p className="text-xs font-semibold text-on-surface-variant uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-on-surface tracking-tight">{value}</h3>
    </div>
  );
}

function QuickActions({ items }: { items: any[] }) {
  const router = useRouter();
  return (
    <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
      <h3 className="text-xl font-bold text-on-surface mb-6">Aksi Cepat</h3>
      <div className="space-y-4">
        {items.map((action, i) => (
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
  );
}

function RecentActivity() {
  return (
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
  );
}

const CHART_DATA_DEFAULT = [
  { name: 'TKJ', value: 510, color: '#1e40af' },
  { name: 'DBS', value: 360, color: '#173bab' },
  { name: 'DG', value: 430, color: '#3755c3' },
];

const activities = [
  { user: 'Budi Santoso', action: 'mengunggah soal ujian "Matematika Dasar"', time: '10 menit yang lalu' },
  { user: 'Admin Pusat', action: 'mengubah status 45 siswa menjadi Aktif', time: '1 jam yang lalu' },
  { user: 'Sistem', action: 'menyelesaikan sinkronisasi absensi biometrik', time: 'Hari ini, 07:00' },
];
