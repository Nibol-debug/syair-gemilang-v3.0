'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Loader2,
  AlertCircle,
  BookOpen,
  Users,
  Layers,
  Save,
  MapPin
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MajorsPage() {
  const [majors, setMajors] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, totalStudents: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Filters & Search
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1, limit: 10, total: 0, last_page: 1
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    branch_id: ''
  });

  const fetchMasterData = async () => {
    try {
      const res = await apiRequest('/branches');
      setBranches(res || []);
    } catch (err) {
      console.error('Gagal mengambil data cabang:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await apiRequest('/majors');
      setStats({
        total: res.meta.total,
        totalStudents: 0
      });
    } catch (err) {
      console.error('Gagal mengambil statistik:', err);
    }
  };

  const fetchMajors = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      }).toString();

      const response = await apiRequest(`/majors?${query}`);
      setMajors(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        last_page: response.meta.last_page
      }));
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data jurusan');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMajors();
      fetchStats();
      fetchMasterData();
    }
  }, [pagination.page, search]);

  const handleOpenModal = (major: any = null) => {
    if (major) {
      setSelectedMajor(major);
      setFormData({
        code: major.code,
        name: major.name,
        branch_id: major.branch_id
      });
    } else {
      setSelectedMajor(null);
      setFormData({
        code: '',
        name: '',
        branch_id: branches[0]?.id || ''
      });
    }
    setIsModalOpen(true);
  };

  const handleAddBranch = async () => {
    const name = prompt("Masukkan Nama Cabang Baru:");
    if (!name) return;
    try {
      await apiRequest('/branches', {
        method: 'POST',
        body: JSON.stringify({ name })
      });
      fetchMasterData();
    } catch (err: any) {
      alert("Gagal menambah cabang: " + err.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (selectedMajor) {
        await apiRequest(`/majors/${selectedMajor.id}`, {
          method: 'PATCH',
          body: JSON.stringify(formData)
        });
      } else {
        await apiRequest('/majors', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      setIsModalOpen(false);
      fetchMajors();
      fetchStats();
    } catch (err: any) {
      alert('Gagal menyimpan data: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedMajor) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/majors/${selectedMajor.id}`, {
        method: 'DELETE'
      });
      setShowDeleteConfirm(false);
      fetchMajors();
      fetchStats();
    } catch (err: any) {
      alert('Gagal menghapus data: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Data Jurusan & Cabang</h2>
          <p className="text-on-surface-variant font-medium mt-1">Kelola program keahlian per lokasi kampus RGI.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Jurusan</span>
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <div className="max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cari Jurusan</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container focus-within:ring-2 focus-within:ring-primary/20 transition-all relative">
              <Search className="w-4 h-4 text-outline mr-3" />
              <input 
                type="text" 
                placeholder="Cari Kode atau Nama Jurusan..." 
                className="bg-transparent outline-none text-sm w-full text-on-surface placeholder:text-outline-variant pr-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && <button onClick={() => setSearch('')} className="absolute right-3 text-outline"><X className="w-4 h-4" /></button>}
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Kode</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Nama Jurusan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Cabang / Lokasi</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr><td colSpan={4} className="py-10 text-center"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></td></tr>
              ) : (
                majors.map((major) => (
                  <tr key={major.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                    <td className="py-4 px-8 font-bold text-primary">{major.code}</td>
                    <td className="py-4 px-8 font-semibold text-on-surface">{major.name}</td>
                    <td className="py-4 px-8">
                       <span className="flex items-center gap-2 text-on-surface-variant font-bold text-xs uppercase">
                         <MapPin className="w-3 h-3 text-primary" />
                         {major.branch?.name || '-'}
                       </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(major)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedMajor(major); setShowDeleteConfirm(true); }} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-on-surface-variant group-hover:hidden ml-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-outline-variant bg-surface-container-lowest">
          <span className="text-xs font-medium text-on-surface-variant">Halaman {pagination.page} dari {pagination.last_page}</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={pagination.page === 1} className="p-2 rounded-lg text-outline"><ChevronLeft className="w-5 h-5" /></button>
            <button className="w-9 h-9 rounded-lg bg-primary text-on-primary font-bold text-xs">{pagination.page}</button>
            <button onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.last_page, prev.page + 1) }))} disabled={pagination.page === pagination.last_page} className="p-2 rounded-lg text-on-surface"><ChevronRight className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface">{selectedMajor ? 'Edit Jurusan' : 'Tambah Jurusan'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5" /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Kode Jurusan</label>
                <input type="text" required placeholder="Contoh: FD, GD, SE" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full px-5 py-3 bg-surface border border-outline-variant rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nama Jurusan</label>
                <input type="text" required placeholder="Contoh: Fashion Design" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-surface border border-outline-variant rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none" />
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center mb-1">
                   <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Pilih Cabang RGI</label>
                   <button type="button" onClick={handleAddBranch} className="text-[10px] font-black text-primary hover:underline">+ TAMBAH CABANG</button>
                </div>
                <select required value={formData.branch_id} onChange={e => setFormData({...formData, branch_id: e.target.value})} className="w-full px-5 py-3 bg-surface border border-outline-variant rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none cursor-pointer">
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-outline rounded-2xl text-sm font-black text-on-surface-variant">BATAL</button>
                <button type="submit" disabled={isSubmitting} className="px-10 py-3 bg-primary text-on-primary rounded-2xl text-sm font-black flex items-center gap-2 shadow-lg shadow-primary/20 active:scale-95 transition-all">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} SIMPAN DATA
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8 text-center space-y-6">
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto text-error"><Trash2 className="w-10 h-10" /></div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface">Hapus Jurusan?</h3>
              <p className="text-on-surface-variant font-medium">Anda akan menghapus <span className="text-on-surface font-bold">"{selectedMajor?.name}"</span>.</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-6 py-3 rounded-xl border border-outline text-on-surface-variant font-bold text-sm">Batal</button>
              <button onClick={handleDelete} disabled={isDeleting} className="flex-1 px-6 py-3 rounded-xl bg-error text-on-error font-bold text-sm flex items-center justify-center gap-2">{isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Hapus'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
