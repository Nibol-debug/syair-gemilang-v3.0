import React from 'react';
import { 
  Download, 
  CheckCircle2, 
  BarChart2, 
  AlertCircle, 
  Search, 
  ChevronRight, 
  ChevronLeft, 
  Edit, 
  History,
  TrendingUp,
  RefreshCcw,
  Verified
} from 'lucide-react';
import { cn } from '../lib/utils';

const stats = [
  { label: 'Total Nilai Diproses', value: '1,248', trend: '+12%', icon: BarChart2, color: 'primary' },
  { label: 'Rata-rata Nilai', value: '82.4', trend: 'Target 80', icon: TrendingUp, color: 'secondary' },
  { label: 'Siswa Lulus (KKM)', value: '1,152', trend: '92% Siswa', icon: CheckCircle2, color: 'success' },
  { label: 'Perlu Remedial', value: '96', trend: 'Tindakan Dibutuhkan', icon: AlertCircle, color: 'error' },
];

const students = [
  { name: 'Ahmad Fauzi', nis: '202310012', subject: 'Matematika', cbt: 88, tugas: 92, akhir: 90, status: 'Lulus' },
  { name: 'Siti Aminah', nis: '202310045', subject: 'Matematika', cbt: 65, tugas: 70, akhir: 67, status: 'Remedial' },
  { name: 'Budi Darmawan', nis: '202310022', subject: 'Matematika', cbt: 82, tugas: 85, akhir: 84, status: 'Lulus' },
];

export default function Grading() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <nav className="flex items-center gap-1.5 text-xs font-bold text-outline uppercase tracking-wider mb-2">
            <span>Akademik</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-primary">Sistem Penilaian</span>
          </nav>
          <h2 className="text-4xl font-bold text-on-surface tracking-tight">Sistem Penilaian</h2>
          <p className="text-on-surface-variant font-medium mt-2 max-w-2xl leading-relaxed">
            Manajemen evaluasi hasil belajar siswa yang komprehensif, mencakup integrasi nilai CBT, tugas harian, dan ujian akhir semester.
          </p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all active:scale-95">
            <Download className="w-4.5 h-4.5" />
            <span>Ekspor PDF</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-95 transition-all active:scale-95 shadow-xl shadow-primary/20">
            <Verified className="w-4.5 h-4.5" />
            <span>Finalisasi Nilai</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col relative overflow-hidden group hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className={cn(
                "p-3 rounded-2xl transition-transform group-hover:scale-110 duration-500",
                stat.color === 'primary' ? "bg-primary/10 text-primary" :
                stat.color === 'secondary' ? "bg-secondary/10 text-secondary" :
                stat.color === 'success' ? "bg-on-secondary-container/10 text-on-secondary-container" :
                "bg-error/10 text-error"
              )}>
                <stat.icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-[10px] font-bold px-2.5 py-1.5 rounded-full border shadow-sm transition-all",
                stat.color === 'primary' ? "bg-secondary-container/30 text-secondary border-secondary/10" :
                stat.color === 'secondary' ? "bg-surface-container-high text-on-surface-variant border-outline-variant/30" :
                stat.color === 'success' ? "bg-on-secondary-container/10 text-on-secondary-container border-on-secondary-container/10" :
                "bg-error/10 text-error border-error/10"
              )}>
                {stat.trend}
              </span>
            </div>
            <p className="text-[11px] font-bold text-outline uppercase tracking-[0.1em] mb-1">{stat.label}</p>
            <h3 className="text-3xl font-bold text-on-surface tracking-tight">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="bg-surface-container-lowest p-3 rounded-2xl border border-outline-variant shadow-sm flex flex-wrap gap-4 items-center">
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-5 gap-3">
          <select className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
            <option>Semua Jurusan</option>
            <option>IPA</option>
            <option>IPS</option>
          </select>
          <select className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
            <option>Kelas XII-A</option>
            <option>Kelas XII-B</option>
          </select>
          <select className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
            <option>Matematika</option>
            <option>Fisika</option>
          </select>
          <select className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer">
            <option>Semester Ganjil</option>
            <option>Semester Genap</option>
          </select>
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Nama/NIS..." 
              className="w-full pl-10 pr-4 py-2.5 border border-outline-variant/50 rounded-xl bg-surface-container text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>
        <button className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant font-bold text-sm rounded-xl hover:bg-outline-variant/30 transition-all active:scale-95">
          Terapkan Filter
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/40 border-b border-outline-variant">
              <tr>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em]">Nama Siswa & NIS</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em]">Mata Pelajaran</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-center">Nilai CBT</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-center">Nilai Tugas</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-center">Nilai Akhir</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em]">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-medium">
              {students.map((student, i) => (
                <tr key={i} className="group hover:bg-surface-container-low/20 transition-all">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-on-surface">{student.name}</p>
                    <p className="text-[11px] font-bold text-outline uppercase mt-1 tracking-wider">NIS: {student.nis}</p>
                  </td>
                  <td className="px-8 py-5 text-sm text-on-surface-variant">{student.subject}</td>
                  <td className="px-8 py-5 text-center text-on-surface font-bold">{student.cbt}</td>
                  <td className="px-8 py-5 text-center text-on-surface font-bold">{student.tugas}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={cn(
                      "text-2xl font-bold font-mono tracking-tighter",
                      student.akhir >= 75 ? "text-primary" : "text-error"
                    )}>
                      {student.akhir}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      student.status === 'Lulus' 
                        ? "bg-secondary-container/20 text-on-secondary-container border-secondary/20" 
                        : "bg-error-container/20 text-on-error-container border-error/20"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-all transform scale-95 group-hover:scale-100">
                      <button className="p-2 text-primary hover:bg-primary-fixed/50 rounded-lg transition-colors" title="Edit">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="p-2 text-outline hover:bg-surface-container-high rounded-lg transition-colors" title="History">
                        <History className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="px-8 py-5 bg-surface-container-low/30 border-t border-outline-variant flex justify-between items-center">
          <span className="text-[11px] font-bold text-on-surface-variant uppercase tracking-wider opacity-60">Menampilkan 1-10 dari 1,248 data</span>
          <div className="flex gap-1.5">
            <button className="p-2 border border-outline-variant/50 rounded-xl text-outline-variant cursor-not-allowed opacity-50"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-10 h-10 bg-primary text-on-primary rounded-xl font-bold text-xs shadow-lg shadow-primary/20">1</button>
            <button className="w-10 h-10 border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high rounded-xl font-bold text-xs transition-all active:scale-95">2</button>
            <button className="w-10 h-10 border border-outline-variant/50 text-on-surface-variant hover:bg-surface-container-high rounded-xl font-bold text-xs transition-all active:scale-95">3</button>
            <button className="p-2 border border-outline-variant/50 rounded-xl text-on-surface hover:bg-surface-container-high transition-all active:scale-95"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      <div className="bg-primary-container/5 border-2 border-primary/10 rounded-2xl p-8 flex items-center gap-8 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-16 translate-x-16 blur-3xl group-hover:scale-150 transition-transform duration-[2000ms]" />
        <div className="p-4 bg-primary/10 rounded-2xl flex items-center justify-center relative z-10">
          <RefreshCcw className="w-7 h-7 text-primary animate-spin-[5s] linear" />
        </div>
        <div className="flex-1 relative z-10">
          <h5 className="text-lg font-bold text-primary mb-1">Informasi Sinkronisasi CBT</h5>
          <p className="text-sm font-medium text-on-surface-variant leading-relaxed max-w-3xl">
            Data nilai dari CBT Module disinkronkan secara otomatis setiap 15 menit. Terakhir diperbarui hari ini pukul 09:42 WIB. Pastikan semua modul ujian telah ditutup sebelum melakukan finalisasi nilai raport.
          </p>
        </div>
        <button className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10 relative z-10 whitespace-nowrap">
          Sinkronkan Sekarang
        </button>
      </div>
    </div>
  );
}
