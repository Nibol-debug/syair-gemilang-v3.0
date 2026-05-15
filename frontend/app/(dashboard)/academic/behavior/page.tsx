'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useUserRole } from '@/lib/useUserRole';
import {
  HeartHandshake,
  Search,
  Plus,
  Loader2,
  X,
  Save,
  Star,
  FileText,
  User,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDateTime } from '@/lib/utils';

export default function BehaviorAssessmentPage() {
  const { isTeacher, isAdmin, isStaff, user } = useUserRole();
  const canAssess = isTeacher || isAdmin || isStaff;
  const [mounted, setMounted] = useState(false);

  const [assessments, setAssessments] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    student_id: '',
    attitude: 85,
    ethics: 85,
    manners: 85,
    notes: ''
  });

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (canAssess) {
        // Fetch assessments
        try {
          const assessRes = await apiRequest('/student-behavior');
          setAssessments(assessRes.data || []);
        } catch (err) {
          console.error('Gagal memuat data penilaian:', err);
        }

        // Fetch students for dropdown
        try {
          const studentsRes = await apiRequest('/students?limit=1000');
          setStudents(studentsRes.data || []);
        } catch (err) {
          console.error('Gagal memuat data siswa:', err);
        }
      } else if (user?.studentId) {
        const assessRes = await apiRequest(`/student-behavior?studentId=${user.studentId}`);
        setAssessments(assessRes.data || []);
      }
    } catch (err) {
      console.error('Terjadi kesalahan saat memuat data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/student-behavior', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      alert('Penilaian perilaku berhasil disimpan!');
      setIsModalOpen(false);
      setFormData({ student_id: '', attitude: 85, ethics: 85, manners: 85, notes: '' });
      fetchData();
    } catch (err: any) {
      alert('Gagal menyimpan: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success bg-success/10 border-success/20';
    if (score >= 80) return 'text-primary bg-primary/10 border-primary/20';
    if (score >= 70) return 'text-secondary bg-secondary/10 border-secondary/20';
    return 'text-error bg-error/10 border-error/20';
  };

  const getPredicate = (score: number) => {
    if (score >= 90) return 'Sangat Baik (A)';
    if (score >= 80) return 'Baik (B)';
    if (score >= 70) return 'Cukup (C)';
    return 'Kurang (D)';
  };

  if (!mounted) return <div className="p-8 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-on-surface flex items-center gap-3">
            <HeartHandshake className="w-8 h-8 text-primary" />
            Penilaian Perilaku Siswa
          </h1>
          <p className="text-on-surface-variant mt-2 max-w-2xl">
            Sistem penilaian afektif mencakup Sikap (Attitude), Etika (Ethics), dan Adab (Manners) sebagai bagian dari pembentukan karakter.
          </p>
        </div>
        
        {canAssess && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
          >
            <Plus className="w-4 h-4" />
            Input Penilaian
          </button>
        )}
      </div>

      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm overflow-hidden">
        <div className="p-4 border-b border-outline-variant bg-surface-container/30 flex justify-between items-center">
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-outline" />
            <input 
              type="text" 
              placeholder="Cari siswa atau catatan..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-outline-variant/50 rounded-lg bg-surface text-sm focus:ring-2 focus:ring-primary/20 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Siswa</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-center">Sikap</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-center">Etika</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-center">Adab</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider text-center">Rata-rata</th>
                <th className="px-6 py-4 text-xs font-bold text-outline uppercase tracking-wider">Penilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8"><Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" /></td></tr>
              ) : assessments.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-on-surface-variant">Belum ada data penilaian perilaku.</td></tr>
              ) : (
                assessments.filter(a => 
                  a.student?.full_name.toLowerCase().includes(search.toLowerCase()) || 
                  a.notes?.toLowerCase().includes(search.toLowerCase())
                ).map((a) => (
                  <tr key={a.id} className="hover:bg-surface-container-lowest transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-on-surface-variant">{formatDateTime(a.date)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-on-surface">{a.student?.full_name}</p>
                      <p className="text-[10px] text-outline uppercase mt-0.5 tracking-wider">{a.student?.nis}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getScoreColor(a.attitude))}>{a.attitude}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getScoreColor(a.ethics))}>{a.ethics}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn("px-3 py-1 rounded-full text-xs font-bold border", getScoreColor(a.manners))}>{a.manners}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center">
                        <span className="text-lg font-black text-on-surface">{Number(a.overallScore).toFixed(1)}</span>
                        <span className="text-[10px] font-bold text-outline uppercase">{getPredicate(Number(a.overallScore))}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <User className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-on-surface-variant">{a.assessor?.full_name}</span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && canAssess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2"><Star className="w-5 h-5 text-primary" /> Input Penilaian Perilaku</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Siswa</label>
                <select 
                  required 
                  value={formData.student_id}
                  onChange={e => setFormData({...formData, student_id: e.target.value})}
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none font-medium"
                >
                  <option value="" disabled>-- Pilih Siswa --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.full_name} ({s.nis})</option>)}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Sikap (1-100)</label>
                  <input 
                    type="number" min="0" max="100" required
                    value={formData.attitude}
                    onChange={e => setFormData({...formData, attitude: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl text-center font-bold text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Etika (1-100)</label>
                  <input 
                    type="number" min="0" max="100" required
                    value={formData.ethics}
                    onChange={e => setFormData({...formData, ethics: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl text-center font-bold text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Adab (1-100)</label>
                  <input 
                    type="number" min="0" max="100" required
                    value={formData.manners}
                    onChange={e => setFormData({...formData, manners: Number(e.target.value)})}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-xl text-center font-bold text-lg focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-1">Catatan Khusus (Opsional)</label>
                <textarea 
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none resize-none"
                  placeholder="Misal: Sangat aktif membantu teman yang kesulitan..."
                />
              </div>

              <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl flex gap-3">
                <AlertCircle className="w-5 h-5 text-primary shrink-0" />
                <p className="text-[11px] font-medium text-primary">
                  Nilai ini akan terekapitulasi di laporan E-Rapor pada bagian aspek kepribadian dan sosial.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl border border-outline-variant text-on-surface font-semibold text-sm hover:bg-surface-container">
                  Batal
                </button>
                <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Simpan Penilaian</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
