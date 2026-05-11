'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
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
  Verified,
  X,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';

const stats = [
  { label: 'Total Nilai Diproses', value: '1,248', trend: '+12%', icon: BarChart2, color: 'primary' },
  { label: 'Rata-rata Nilai', value: '82.4', trend: 'Target 80', icon: TrendingUp, color: 'secondary' },
  { label: 'Siswa Lulus (KKM)', value: '1,152', trend: '92% Siswa', icon: CheckCircle2, color: 'success' },
  { label: 'Perlu Remedial', value: '96', trend: 'Tindakan Dibutuhkan', icon: AlertCircle, color: 'error' },
];

export default function GradingPage() {
  const [grades, setGrades] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedSemester, setSelectedSemester] = useState(1);

  const [formData, setFormData] = useState({
    student_id: '',
    subject_id: '',
    semester: 1
  });

  const fetchInitialData = async () => {
    try {
      const [classesRes, subjectsRes] = await Promise.all([
        apiRequest('/classes'),
        apiRequest('/subjects')
      ]);
      setClasses(classesRes.data || []);
      setSubjects(subjectsRes.data || []);
      
      if (classesRes.data?.length > 0) setSelectedClass(classesRes.data[0].id);
      if (subjectsRes.data?.length > 0) {
        setSelectedSubject(subjectsRes.data[0].id);
        setFormData(prev => ({ ...prev, subject_id: subjectsRes.data[0].id }));
      }
    } catch (err) {
      console.error('Gagal mengambil data awal:', err);
    }
  };

  const fetchGrades = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest(`/grades/class/${selectedClass}?subject_id=${selectedSubject}`);
      setGrades(response || []);
      // Also update student list for modal
      setStudents(response || []);
      if (response.length > 0) {
        setFormData(prev => ({ ...prev, student_id: response[0].id }));
      }
    } catch (err) {
      console.error('Gagal mengambil data nilai:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchInitialData();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && selectedClass && selectedSubject) {
      fetchGrades();
    }
  }, [selectedClass, selectedSubject]);

  const handleFinalize = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/grades/finalize', {
        method: 'POST',
        body: JSON.stringify({
          student_id: formData.student_id,
          subject_id: selectedSubject,
          semester: Number(formData.semester)
        })
      });
      alert('Finalisasi nilai berhasil!');
      setIsModalOpen(false);
      fetchGrades();
    } catch (err: any) {
      alert('Gagal finalisasi: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-primary/20 text-primary font-bold text-sm hover:bg-primary/5 transition-all active:scale-95"
          >
            <Download className="w-4.5 h-4.5" />
            <span>Ekspor PDF</span>
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-95 transition-all active:scale-95 shadow-xl shadow-primary/20"
          >
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
        <div className="flex-1 grid grid-cols-2 lg:grid-cols-4 gap-3">
          <select 
            value={selectedClass} 
            onChange={e => setSelectedClass(e.target.value)}
            className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option value="" disabled>Pilih Kelas</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <select 
            value={selectedSubject} 
            onChange={e => setSelectedSubject(e.target.value)}
            className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option value="" disabled>Pilih Mata Pelajaran</option>
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
          <select 
            value={selectedSemester} 
            onChange={e => setSelectedSemester(Number(e.target.value))}
            className="bg-surface-container px-4 py-2.5 rounded-xl border border-outline-variant/50 text-sm font-semibold text-on-surface outline-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer"
          >
            <option value={1}>Semester Ganjil</option>
            <option value={2}>Semester Genap</option>
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
        <button 
          onClick={fetchGrades}
          className="px-6 py-2.5 bg-surface-container-high text-on-surface-variant font-bold text-sm rounded-xl hover:bg-outline-variant/30 transition-all active:scale-95"
        >
          Refresh Data
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/40 border-b border-outline-variant">
              <tr>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em]">Nama Siswa & NIS</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-center">Nilai CBT</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-center">Nilai Tugas</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-center">Nilai Akhir</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em]">Status</th>
                <th className="px-8 py-5 text-[11px] font-bold text-outline uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low font-medium">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : grades.length === 0 ? (
                 <tr>
                   <td colSpan={6} className="text-center py-10 text-on-surface-variant">Data nilai tidak ditemukan untuk filter ini.</td>
                 </tr>
              ) : grades.map((item, i) => (
                <tr key={item.id} className="group hover:bg-surface-container-low/20 transition-all">
                  <td className="px-8 py-5">
                    <p className="text-sm font-bold text-on-surface">{item.full_name}</p>
                    <p className="text-[11px] font-bold text-outline uppercase mt-1 tracking-wider">NIS: {item.nis}</p>
                  </td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-on-surface-variant">{item.cbt_score || '-'}</td>
                  <td className="px-8 py-5 text-center text-sm font-bold text-on-surface-variant">{item.assignment_score || '-'}</td>
                  <td className="px-8 py-5 text-center">
                    <span className={cn(
                      "text-2xl font-bold font-mono tracking-tighter",
                      item.final_score >= 75 ? "text-success" : "text-primary"
                    )}>
                      {item.final_score || '-'}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={cn(
                      "px-3.5 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                      item.status === 'Lulus' ? "bg-success-container/30 text-success border-success/20" :
                      item.status === 'Remedial' ? "bg-error-container/20 text-error border-error/20" :
                      "bg-surface-container-high text-on-surface-variant border-outline-variant/30"
                    )}>
                      {item.status}
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
      </div>

      {/* Modal Finalisasi Nilai */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface">Finalisasi Nilai Akhir</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <form id="finalizeForm" onSubmit={handleFinalize} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Pilih Siswa</label>
                  <select required value={formData.student_id} onChange={e => setFormData({...formData, student_id: e.target.value})} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value="" disabled>-- Pilih Siswa --</option>
                    {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.nis})</option>)}
                  </select>
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant">Semester</label>
                  <select required value={formData.semester} onChange={e => setFormData({...formData, semester: Number(e.target.value)})} className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-sm focus:ring-2 focus:ring-primary/20 outline-none">
                    <option value={1}>1 (Ganjil)</option>
                    <option value={2}>2 (Genap)</option>
                  </select>
                </div>

                <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <p className="text-sm font-medium text-primary">
                    Peringatan: Finalisasi akan mengunci seluruh perhitungan nilai komponen (Tugas, UTS, UAS, CBT) menjadi nilai rapor akhir.
                  </p>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
              <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors">Batal</button>
              <button type="submit" form="finalizeForm" disabled={isSubmitting || !formData.student_id} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Verified className="w-4 h-4" />}
                <span>Proses Finalisasi</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
