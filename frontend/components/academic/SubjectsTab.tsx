'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Save, Book } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';
import { useUserRole } from '@/lib/useUserRole';

export default function SubjectsTab() {
  const { canManageAcademic } = useUserRole();
  const [subjects, setSubjects] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterMajor, setFilterMajor] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<any>(null);
  const [formData, setFormData] = useState({ name: '', major_id: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchSubjects = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({ limit: '100', ...(filterMajor && { major_id: filterMajor }) });
      const res = await apiRequest(`/subjects?${query}`);
      setSubjects(res.data || []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  const fetchMajors = async () => {
    try {
      const res = await apiRequest('/majors?limit=100');
      setMajors(res.data || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchMajors(); }, []);
  useEffect(() => { fetchSubjects(); }, [filterMajor]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        major_id: formData.major_id || null
      };

      if (editingSubject) {
        await apiRequest(`/subjects/${editingSubject.id}`, { method: 'PATCH', body: JSON.stringify(payload) });
      } else {
        await apiRequest('/subjects', { method: 'POST', body: JSON.stringify(payload) });
      }
      setModalOpen(false);
      setEditingSubject(null);
      setFormData({ name: '', major_id: '' });
      fetchSubjects();
    } catch (err: any) { alert('Gagal: ' + err.message); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus mata pelajaran ini?')) return;
    try { await apiRequest(`/subjects/${id}`, { method: 'DELETE' }); fetchSubjects(); }
    catch (err: any) { alert('Gagal menghapus: ' + err.message); }
  };

  const openEdit = (subject: any) => {
    setEditingSubject(subject);
    setFormData({ name: subject.name, major_id: subject.major_id || '' });
    setModalOpen(true);
  };

  const openAdd = () => {
    setEditingSubject(null);
    setFormData({ name: '', major_id: '' });
    setModalOpen(true);
  };

  const filtered = subjects.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-on-surface">Daftar Mata Pelajaran</h3>
          <p className="text-sm text-on-surface-variant mt-1">Kelola kurikulum dan mata pelajaran per jurusan.</p>
        </div>
        {canManageAcademic && (
          <button onClick={openAdd} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            <Plus className="w-4 h-4" /> Tambah Mapel
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Pencarian</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-outline mr-3" />
              <input type="text" placeholder="Cari mata pelajaran..." className="bg-transparent outline-none text-sm w-full" value={search} onChange={e => setSearch(e.target.value)} />
              {search && <button onClick={() => setSearch('')}><X className="w-4 h-4 text-outline" /></button>}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Filter Jurusan</label>
            <select value={filterMajor} onChange={e => setFilterMajor(e.target.value)} className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option value="">Semua Jurusan</option>
              {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-surface-container-low border-b border-outline-variant">
              <th className="py-4 px-6 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Mata Pelajaran</th>
              <th className="py-4 px-6 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Jurusan</th>
              <th className="py-4 px-6 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {isLoading ? (
              <tr><td colSpan={3} className="py-10 text-center"><Loader2 className="w-6 h-6 text-primary animate-spin mx-auto" /></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={3} className="py-10 text-center text-on-surface-variant">Tidak ada mata pelajaran ditemukan.</td></tr>
            ) : filtered.map(subject => (
              <tr key={subject.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                <td className="py-4 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center"><Book className="w-4 h-4 text-primary" /></div>
                    <span className="font-semibold text-on-surface">{subject.name}</span>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-surface-container border border-outline-variant">
                    {subject.major?.name || 'Umum'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {canManageAcademic && (
                      <>
                        <button onClick={() => openEdit(subject)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => handleDelete(subject.id)} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 border-t border-outline-variant text-xs text-on-surface-variant font-medium">
          Total: {filtered.length} mata pelajaran
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-[28rem] rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 text-primary rounded-xl"><Book className="w-6 h-6" /></div>
                <h3 className="text-xl font-black text-on-surface tracking-tight">{editingSubject ? 'Edit' : 'Tambah'} Mata Pelajaran</h3>
              </div>
              <button onClick={() => setModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Nama Mata Pelajaran</label>
                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} placeholder="Contoh: Pemrograman Web" className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Jurusan (Opsional)</label>
                <select value={formData.major_id} onChange={e => setFormData({ ...formData, major_id: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                  <option value="">Umum (Semua Jurusan)</option>
                  {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                </select>
              </div>
              <div className="flex gap-4 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 px-6 py-3 rounded-xl border border-outline text-on-surface font-bold hover:bg-surface-container transition-all">Batal</button>
                <button type="submit" disabled={isSubmitting} className="flex-[2] flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
