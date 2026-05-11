import React from 'react';
import { 
  Users, 
  BadgeCheck, 
  ScrollText as QuizIcon, 
  GraduationCap, 
  TrendingUp, 
  Plus, 
  Upload, 
  FileText, 
  ArrowRight,
  MoreVertical
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

const data = [
  { name: 'TKJ', value: 510, color: '#1e40af' },
  { name: 'DBS', value: 360, color: '#173bab' },
  { name: 'DG', value: 430, color: '#3755c3' },
];

const stats = [
  { label: 'Total Siswa Aktif', value: '1,300', icon: Users, trend: '+2.4%', color: 'primary' },
  { label: 'Guru & Staf', value: '84', icon: BadgeCheck, trend: null, color: 'primary' },
  { label: 'Ujian Berlangsung', value: '3', icon: QuizIcon, trend: null, color: 'error' },
  { label: 'Kehadiran Hari Ini', value: '96%', icon: GraduationCap, trend: '96% Hadir', color: 'secondary' },
];

const activities = [
  { user: 'Budi Santoso', action: 'mengunggah soal ujian "Matematika Dasar"', time: '10 menit yang lalu' },
  { user: 'Admin Pusat', action: 'mengubah status 45 siswa menjadi Aktif', time: '1 jam yang lalu' },
  { user: 'Sistem', action: 'menyelesaikan sinkronisasi absensi biometrik', time: 'Hari ini, 07:00' },
];

export default function Dashboard() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Ringkasan Hari Ini</h2>
          <p className="text-on-surface-variant font-medium mt-1">Tinjauan operasional akademik Syiar Gemilang.</p>
        </div>
        <div className="bg-surface-container font-semibold text-on-surface-variant px-5 py-2.5 rounded-lg text-sm border border-outline-variant shadow-sm">
          Senin, 24 Oktober 2023
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
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
              <BarChart data={data}>
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
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
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
                { label: 'Import Data Siswa', icon: Upload },
                { label: 'Buat Ujian Baru (CBT)', icon: Plus },
                { label: 'Finalisasi Nilai Akhir', icon: FileText },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-xl border border-outline-variant hover:border-primary hover:bg-surface-container transition-all group active:scale-[0.98]">
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
