'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
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
  X,
  Loader2,
  ClipboardList,
  Play
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const violations = [
  { name: 'Ahmad S.', class: 'XII IPA 1', type: 'Tab Switch - 3x', time: 'Baru Saja' },
  { name: 'Rina M.', class: 'XII IPS 2', type: 'Kehilangan Fokus', time: '2m lalu' },
];

export default function CBTPage() {
  const [exams, setExams] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subject_id: '6e9529d6-a232-4184-9eea-8176c5b6ccd4', // hardcoded to seeded Math subject
    major_id: '511038dd-f706-480f-b41a-f490b0b9fcbd', // hardcoded to TKJ
    duration: 120,
    token: '',
    start_time: '',
    end_time: ''
  });

  const fetchExams = async () => {
    try {
      const response = await apiRequest('/exams');
      setExams(response.data || []);
    } catch (err) {
      console.error('Failed to fetch exams', err);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await apiRequest('/stats/dashboard').catch(() => null);
      setStats(data?.overview || null);
    } catch (err) {
      console.error('Failed to fetch cbt stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchExams();
      fetchStats();
    }
  }, []);

  const generateToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let token = '';
    for(let i=0; i<6; i++) token += chars.charAt(Math.floor(Math.random() * chars.length));
    return token;
  };

  const handleCreateExam = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/exams', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          duration: Number(formData.duration),
          start_time: new Date(formData.start_time).toISOString(),
          end_time: new Date(formData.end_time).toISOString()
        })
      });
      setIsModalOpen(false);
      fetchExams();
      setFormData({ ...formData, title: '', start_time: '', end_time: '', token: '' });
    } catch (err: any) {
      alert('Gagal membuat ujian: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button 
            onClick={() => {
              setFormData({...formData, token: generateToken()});
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-opacity active:scale-95 shadow-lg shadow-primary/20"
          >
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
              <span className="text-5xl font-bold text-on-surface tracking-tight">{isLoading ? '...' : (stats?.ongoingExams || 342)}</span>
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
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-on-surface-variant">Memuat data ujian...</td>
                </tr>
              ) : exams.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-on-surface-variant">Belum ada data ujian. Silakan buat baru.</td>
                </tr>
              ) : (
                exams.map((exam) => (
                  <tr key={exam.id} className="group hover:bg-surface-container-low/30 transition-colors border-b border-surface-container-low/50">
                    <td className="py-6 px-8">
                      <p className="font-bold text-on-surface text-[15px]">{exam.title}</p>
                      <p className="text-xs font-semibold text-on-surface-variant mt-1.5 uppercase tracking-wider">{exam.major?.name || 'Semua Jurusan'}</p>
                    </td>
                    <td className="py-6 px-8 font-semibold text-on-surface-variant">{exam.subject?.name || 'Matematika'}</td>
                    <td className="py-6 px-8 font-semibold text-on-surface">{exam.duration} Menit</td>
                    <td className="py-6 px-8">
                      <p className="font-bold text-on-surface">{new Date(exam.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                      <p className="text-xs font-semibold text-outline mt-1">{new Date(exam.start_time).toLocaleDateString()}</p>
                    </td>
                    <td className="py-6 px-8">
                      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-bold border bg-secondary-container/20 text-on-secondary-container border-secondary/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
                        Tersedia
                      </span>
                    </td>
                    <td className="py-6 px-8 text-right relative px-8">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                         <Link 
                          href={`/cbt/take/${exam.id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-secondary text-on-secondary rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-md shadow-secondary/20"
                         >
                          <Play className="w-3 h-3 fill-current" />
                          Mulai Ujian
                        </Link>
                         <Link 
                          href={`/cbt/${exam.id}`}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                         >
                          <ClipboardList className="w-4.5 h-4.5" />
                        </Link>
                        <button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                          <MoreVertical className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Ujian */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface">Buat Jadwal Ujian Baru</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="examForm" onSubmit={handleCreateExam} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Judul Ujian</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Waktu Mulai</label>
                    <input type="datetime-local" required value={formData.start_time} onChange={e => setFormData({...formData, start_time: e.target.value})} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Waktu Selesai</label>
                    <input type="datetime-local" required value={formData.end_time} onChange={e => setFormData({...formData, end_time: e.target.value})} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Durasi (Menit)</label>
                    <input type="number" required value={formData.duration} onChange={e => setFormData({...formData, duration: Number(e.target.value)})} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant">Token Ujian</label>
                    <input type="text" readOnly value={formData.token} className="w-full px-4 py-2 bg-surface-container font-mono border border-outline-variant rounded-lg text-sm font-bold text-primary outline-none" />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors">Batal</button>
              <button type="submit" form="examForm" disabled={isSubmitting} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Simpan Ujian</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
