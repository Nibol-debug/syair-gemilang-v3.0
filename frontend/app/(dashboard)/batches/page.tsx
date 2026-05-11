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
  Calendar,
  Save,
  CheckCircle2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function BatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    last_page: 1
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    year_start: new Date().getFullYear(),
    year_end: new Date().getFullYear() + 3,
    is_active: true
  });

  const fetchStats = async () => {
    try {
      const res = await apiRequest('/batches');
      setStats({ total: res.meta.total });
    } catch (err) {
      console.error('Gagal mengambil statistik:', err);
    }
  };

  const fetchBatches = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(search && { search }),
      }).toString();

      const response = await apiRequest(`/batches?${query}`);
      setBatches(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        last_page: response.meta.last_page
      }));
    } catch (err: any) {
      console.error('Gagal mengambil data angkatan:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchBatches();
      fetchStats();
    }
  }, [pagination.page, search]);

  const handleOpenModal = (batch: any = null) => {
    if (batch) {
      setSelectedBatch(batch);
      setFormData({
        name: batch.name,
        year_start: batch.year_start,
        year_end: batch.year_end,
        is_active: batch.is_active ?? true
      });
    } else {
      setSelectedBatch(null);
      setFormData({
        name: '',
        year_start: new Date().getFullYear(),
        year_end: new Date().getFullYear() + 3,
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        year_start: parseInt(formData.year_start.toString()),
        year_end: parseInt(formData.year_end.toString())
      };

      if (selectedBatch) {
        await apiRequest(`/batches/${selectedBatch.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await apiRequest('/batches', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }
      setIsModalOpen(false);
      fetchBatches();
      fetchStats();
    } catch (err: any) {
      alert('Gagal menyimpan data: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedBatch) return;
    setIsDeleting(true);
    try {
      await apiRequest(`/batches/${selectedBatch.id}`, {
        method: 'DELETE'
      });
      setShowDeleteConfirm(false);
      fetchBatches();
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
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Data Angkatan</h2>
          <p className="text-on-surface-variant font-medium mt-1">Kelola data tahun ajaran dan angkatan siswa.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Angkatan</span>
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Angkatan" value={stats.total} icon={<Calendar className="w-6 h-6" />} color="primary" />
        <StatCard title="Status Aktif" value={stats.total} icon={<CheckCircle2 className="w-6 h-6" />} color="success" />
      </div>

      {/* Filter Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <div className="max-w-md">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pencarian</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container focus-within:ring-2 focus-within:ring-primary/20 transition-all relative">
              <Search className="w-4 h-4 text-outline mr-3" />
              <input 
                type="text" 
                placeholder="Cari Nama Angkatan..." 
                className="bg-transparent outline-none text-sm w-full text-on-surface placeholder:text-outline-variant pr-8"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              {search && (
                <button 
                  onClick={() => setSearch('')}
                  className="absolute right-3 text-outline hover:text-on-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
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
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Nama Angkatan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Mulai</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Selesai</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-on-surface-variant font-medium text-sm">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : batches.length === 0 ? (
                <tr>
                   <td colSpan={5} className="py-10 text-center text-on-surface-variant font-medium flex flex-col items-center gap-2">
                     <AlertCircle className="w-8 h-8 opacity-20" />
                     Belum ada data angkatan.
                   </td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                    <td className="py-4 px-8 font-bold text-on-surface">{batch.name}</td>
                    <td className="py-4 px-8 font-semibold text-on-surface-variant">{batch.year_start}</td>
                    <td className="py-4 px-8 font-semibold text-on-surface-variant">{batch.year_end}</td>
                    <td className="py-4 px-8">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        batch.is_active 
                          ? "bg-secondary-container/20 text-secondary" 
                          : "bg-outline-variant/20 text-on-surface-variant"
                      )}>
                        {batch.is_active ? 'Aktif' : 'Non-aktif'}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleOpenModal(batch)}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedBatch(batch); setShowDeleteConfirm(true); }}
                          className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors" title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <button className="p-2 text-on-surface-variant group-hover:hidden transition-all"><MoreHorizontal className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-8 py-5 border-t border-outline-variant bg-surface-container-lowest">
          <span className="text-xs font-medium text-on-surface-variant">Menampilkan halaman {pagination.page} dari {pagination.last_page}</span>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg text-outline hover:bg-surface-container disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-md">{pagination.page}</button>
            <button 
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.last_page, prev.page + 1) }))}
              disabled={pagination.page === pagination.last_page}
              className="p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface">{selectedBatch ? 'Edit Angkatan' : 'Tambah Angkatan'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Angkatan</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Contoh: Angkatan 1"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Mulai (Tahun)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.year_start} 
                    onChange={e => setFormData({...formData, year_start: parseInt(e.target.value)})} 
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Selesai (Tahun)</label>
                  <input 
                    type="number" 
                    required 
                    value={formData.year_end} 
                    onChange={e => setFormData({...formData, year_end: parseInt(e.target.value)})} 
                    className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" 
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input 
                  type="checkbox" 
                  id="is_active"
                  checked={formData.is_active} 
                  onChange={e => setFormData({...formData, is_active: e.target.checked})} 
                  className="w-4 h-4 text-primary border-outline-variant rounded focus:ring-primary/20"
                />
                <label htmlFor="is_active" className="text-sm font-semibold text-on-surface">Angkatan Aktif</label>
              </div>
              
              <div className="pt-4 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting} 
                  className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                >
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>{selectedBatch ? 'Update Angkatan' : 'Simpan Angkatan'}</span>
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
            <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto text-error">
              <Trash2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface">Hapus Angkatan?</h3>
              <p className="text-on-surface-variant font-medium">
                Anda akan menghapus angkatan <span className="text-on-surface font-bold">"{selectedBatch?.name}"</span>. Siswa di angkatan ini mungkin akan terpengaruh.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 px-6 py-3 rounded-xl border border-outline text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Batal</button>
              <button 
                onClick={handleDelete} 
                disabled={isDeleting}
                className="flex-1 px-6 py-3 rounded-xl bg-error text-on-error font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses: any = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/10 text-secondary border-secondary/20",
    tertiary: "bg-tertiary/10 text-tertiary border-tertiary/20",
    success: "bg-success-container/30 text-success border-success/20",
  };

  return (
    <div className={cn("p-6 rounded-2xl border flex items-center gap-4 bg-surface-container-lowest shadow-sm", colorClasses[color])}>
      <div className="p-3 rounded-xl bg-current opacity-10" />
      <div className="absolute p-3">{icon}</div>
      <div className="ml-12">
        <p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{title}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}
