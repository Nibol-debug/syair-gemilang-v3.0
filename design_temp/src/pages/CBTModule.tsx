import React from 'react';
import { 
  Users, 
  Key, 
  AlertTriangle, 
  Plus, 
  FolderSearch, 
  Search, 
  Filter, 
  MoreVertical,
  Activity,
  ChevronLeft,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { cn } from '../lib/utils';

const exams = [
  { 
    title: 'Penilaian Akhir Semester (PAS) Ganjil', 
    class: 'Kelas XII IPA', 
    subject: 'Matematika Peminatan', 
    duration: '120 Menit', 
    time: '08:00 - 10:00', 
    date: 'Hari ini',
    status: 'Sedang Berjalan' 
  },
  { 
    title: 'Try Out UNBK Tahap 1', 
    class: 'Kelas XII Semua Jurusan', 
    subject: 'Bahasa Inggris', 
    duration: '90 Menit', 
    time: '10:30 - 12:00', 
    date: 'Hari ini',
    status: 'Menunggu Jadwal' 
  },
  { 
    title: 'Ulangan Harian 3', 
    class: 'Kelas X IPS 1', 
    subject: 'Sosiologi', 
    duration: '60 Menit', 
    time: '13:00 - 14:00', 
    date: 'Kemarin',
    status: 'Selesai' 
  },
];

const violations = [
  { name: 'Ahmad S.', class: 'XII IPA 1', type: 'Tab Switch - 3x', time: 'Baru Saja' },
  { name: 'Rina M.', class: 'XII IPS 2', type: 'Kehilangan Fokus', time: '2m lalu' },
];

export default function CBTModule() {
  return (
    <div className="space-y-10">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Modul Ujian Online (CBT)</h2>
          <p className="text-on-surface-variant font-medium mt-1">Kelola dan pantau pelaksanaan ujian secara real-time.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-primary text-primary text-sm font-bold hover:bg-primary/5 transition-colors active:scale-95">
            <FolderSearch className="w-4 h-4" />
            <span>Bank Soal</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            <span>Buat Ujian Baru</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm flex flex-col justify-between group overflow-hidden relative">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Siswa Aktif Ujian</h3>
              <div className="p-3 bg-primary/10 rounded-xl text-primary transform group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-8 flex items-end gap-4">
              <span className="text-5xl font-bold text-on-surface tracking-tight">342</span>
              <span className="bg-secondary-container text-on-secondary-container text-[11px] font-bold px-3 py-1.5 rounded-full mb-1 border border-secondary/20 shadow-sm animate-pulse">
                +12% vs Kemarin
              </span>
            </div>
            <div className="absolute bottom-0 left-0 w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
               <div className="h-full bg-primary w-[70%]" />
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm group">
            <div className="flex justify-between items-start">
              <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Token Aktif</h3>
              <div className="p-3 bg-secondary/10 rounded-xl text-secondary transform group-hover:rotate-12 transition-transform">
                <Key className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-8 flex items-end gap-3">
              <span className="text-4xl font-bold text-on-surface font-mono tracking-tighter">XYZ-992</span>
              <span className="text-[11px] font-bold text-outline uppercase tracking-wider mb-2">Berlaku s/d 14:00</span>
            </div>
            <button className="mt-4 text-xs font-bold text-primary hover:underline inline-flex items-center gap-1 opacity-80 hover:opacity-100">
              Refresh Token
            </button>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-error-container/40 border border-error/10 rounded-2xl p-8 shadow-sm flex flex-col">
          <div className="flex justify-between items-start mb-6">
            <h3 className="text-sm font-bold text-on-error-container uppercase tracking-wider">Peringatan Pelanggaran</h3>
            <div className="p-2.5 bg-error/10 rounded-full text-error animate-pulse">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-4 flex-1">
            {violations.map((v, i) => (
              <div key={i} className="flex justify-between items-center bg-white/50 p-4 rounded-xl border border-error/5">
                <div>
                  <p className="text-sm font-bold text-on-error-container">{v.name} ({v.class})</p>
                  <p className="text-xs font-medium text-on-error-container/70 mt-1">{v.type}</p>
                </div>
                <span className="text-[11px] font-bold text-error uppercase">{v.time}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 bg-white py-3 rounded-xl border border-error/20 text-xs font-bold text-on-error-container hover:bg-error-container/20 transition-all shadow-sm">
            Lihat Semua (5)
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="p-8 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
          <h3 className="text-xl font-bold text-on-surface">Daftar Ujian Aktif & Mendatang</h3>
          <div className="flex gap-3">
            <div className="relative w-64 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline group-focus-within:text-primary transition-colors" />
              <input type="text" placeholder="Cari ujian..." className="w-full pl-10 pr-4 py-2.5 border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/10 outline-none transition-all placeholder:text-outline" />
            </div>
            <button className="p-2.5 border border-outline-variant rounded-xl text-on-surface-variant hover:bg-surface-container transition-colors active:scale-95">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low/50 border-b border-outline-variant">
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Judul Ujian</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Mata Pelajaran</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Durasi</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Waktu</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {exams.map((exam, i) => (
                <tr key={i} className="group hover:bg-surface-container-low/30 transition-colors border-b border-surface-container-low/50">
                  <td className="py-6 px-8">
                    <p className="font-bold text-on-surface text-[15px]">{exam.title}</p>
                    <p className="text-xs font-semibold text-on-surface-variant mt-1.5 uppercase tracking-wider">{exam.class}</p>
                  </td>
                  <td className="py-6 px-8 font-semibold text-on-surface-variant">{exam.subject}</td>
                  <td className="py-6 px-8 font-semibold text-on-surface">{exam.duration}</td>
                  <td className="py-6 px-8">
                    <p className="font-bold text-on-surface">{exam.time}</p>
                    <p className="text-xs font-semibold text-outline mt-1">{exam.date}</p>
                  </td>
                  <td className="py-6 px-8">
                    <span className={cn(
                      "inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold border",
                      exam.status === 'Sedang Berjalan' 
                        ? "bg-secondary-container/20 text-on-secondary-container border-secondary/20" 
                        : exam.status === 'Menunggu Jadwal'
                          ? "bg-surface-container-high text-on-surface-variant border-outline-variant/30"
                          : "bg-outline-variant/10 text-outline border-outline-variant/10"
                    )}>
                      {exam.status === 'Sedang Berjalan' && <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />}
                      {exam.status}
                    </span>
                  </td>
                  <td className="py-6 px-8 text-right relative px-8">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                       <button className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20">
                        <Activity className="w-4.5 h-4.5" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                        <MoreVertical className="w-4.5 h-4.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-outline-variant flex justify-between items-center bg-surface-container-low/20">
          <span className="text-xs font-bold text-on-surface-variant opacity-70 tracking-wide uppercase">Menampilkan 1-3 dari 12 ujian</span>
          <div className="flex gap-1">
            <button className="p-2 border border-outline-variant rounded-lg text-outline-variant cursor-not-allowed opacity-50"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-10 h-10 flex items-center justify-center border-2 border-primary bg-primary text-on-primary rounded-xl font-bold text-xs shadow-lg shadow-primary/20">1</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-xl font-bold text-xs transition-all active:scale-95">2</button>
            <button className="w-10 h-10 flex items-center justify-center border border-outline-variant text-on-surface-variant hover:bg-surface-container hover:text-on-surface rounded-xl font-bold text-xs transition-all active:scale-95">3</button>
            <button className="p-2 border border-outline-variant rounded-lg text-on-surface hover:bg-surface-container transition-all active:scale-95"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
