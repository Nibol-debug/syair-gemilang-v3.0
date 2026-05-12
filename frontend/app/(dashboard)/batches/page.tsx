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
  CheckCircle2,
  AlertTriangle,
  History
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
  
  // Status Confirmation State
  const [showStatusConfirm, setShowStatusConfirm] = useState(false);
  const [targetBatch, setTargetBatch] = useState<any>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
    is_active: false // Default to inactive for new batches
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
        start_date: new Date(batch.start_date).toISOString().split('T')[0],
        end_date: new Date(batch.end_date).toISOString().split('T')[0],
        is_active: batch.is_active ?? false
      });
    } else {
      setSelectedBatch(null);
      setFormData({
        name: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0],
        is_active: false // Force inactive for new
      });
    }
    setIsModalOpen(true);
  };

  const handleStatusToggle = (batch: any) => {
    setTargetBatch(batch);
    setShowStatusConfirm(true);
  };

  const confirmStatusUpdate = async () => {
    if (!targetBatch) return;
    setIsUpdatingStatus(true);
    try {
      const newStatus = !targetBatch.is_active;
      await apiRequest(`/batches/${targetBatch.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ is_active: newStatus })
      });
      setShowStatusConfirm(false);
      fetchBatches();
      fetchStats();
    } catch (err: any) {
      alert('Gagal update status: ' + err.message);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString(),
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
          <p className="text-on-surface-variant font-medium mt-1">Siklus 6 bulan. Menonaktifkan angkatan otomatis merubah santri menjadi Alumni.</p>
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
        <StatCard title="Santri Menjadi Alumni" value="Otomatis" icon={<History className="w-6 h-6" />} color="success" />
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Nama Angkatan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Periode</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center"><Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" /></td>
                </tr>
              ) : (
                batches.map((batch) => (
                  <tr key={batch.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                    <td className="py-4 px-8 font-bold text-on-surface">{batch.name}</td>
                    <td className="py-4 px-8 font-semibold text-on-surface-variant">
                      {new Date(batch.start_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })} - {new Date(batch.end_date).toLocaleDateString('id-ID', { month: 'short', year: 'numeric' })}
                    </td>
                    <td className="py-4 px-8">
                      <button 
                        onClick={() => handleStatusToggle(batch)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all active:scale-95",
                          batch.is_active 
                            ? "bg-success/10 text-success border-success/20 hover:bg-success/20" 
                            : "bg-surface-container-high text-on-surface-variant border-outline-variant hover:bg-outline-variant/30"
                        )}
                      >
                        {batch.is_active ? 'AKTIF' : 'NON-AKTIF'}
                      </button>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handleOpenModal(batch)} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg"><Edit2 className="w-4 h-4" /></button>
                        <button onClick={() => { setSelectedBatch(batch); setShowDeleteConfirm(true); }} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                      </div>
                      <MoreHorizontal className="w-4 h-4 text-on-surface-variant group-hover:hidden ml-auto" />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Confirmation Modal */}
      {showStatusConfirm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden p-8 text-center space-y-6 border border-outline-variant">
             <div className={cn(
               "w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner",
               targetBatch.is_active ? "bg-error/10 text-error" : "bg-primary/10 text-primary"
             )}>
               {targetBatch.is_active ? <AlertTriangle className="w-10 h-10" /> : <CheckCircle2 className="w-10 h-10" />}
             </div>
             <div className="space-y-2">
               <h3 className="text-xl font-black text-on-surface tracking-tight">
                 {targetBatch.is_active ? 'Nonaktifkan Angkatan?' : 'Aktifkan Angkatan?'}
               </h3>
               <p className="text-sm text-on-surface-variant font-medium leading-relaxed">
                 {targetBatch.is_active 
                   ? 'PERHATIAN: Seluruh santri AKTIF di angkatan ini akan otomatis berubah status menjadi ALUMNI.' 
                   : 'Angkatan ini akan menjadi aktif dan bisa digunakan di modul pendaftaran/akademik.'}
               </p>
             </div>
             <div className="flex flex-col gap-3 pt-2">
               <button 
                onClick={confirmStatusUpdate}
                disabled={isUpdatingStatus}
                className={cn(
                  "w-full py-3 rounded-2xl font-black text-sm transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg",
                  targetBatch.is_active ? "bg-error text-on-error shadow-error/20" : "bg-primary text-on-primary shadow-primary/20"
                )}
               >
                 {isUpdatingStatus ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                 YA, LANJUTKAN
               </button>
               <button 
                onClick={() => setShowStatusConfirm(false)}
                className="w-full py-3 rounded-2xl border border-outline text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all"
               >
                 BATALKAN
               </button>
             </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-xl overflow-hidden">
             <div className="px-6 py-4 border-b border-outline-variant flex justify-between bg-surface items-center">
              <h3 className="font-bold text-on-surface">{selectedBatch ? 'Edit Data Angkatan' : 'Tambah Angkatan Baru'}</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-on-surface-variant" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Nama / Nomor Angkatan</label>
                <input type="text" required placeholder="Contoh: 34" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-5 py-3 bg-surface border border-outline-variant rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Tanggal Mulai</label>
                  <input type="date" required value={formData.start_date} onChange={e => setFormData({...formData, start_date: e.target.value})} className="w-full px-5 py-3 bg-surface border border-outline-variant rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Tanggal Selesai</label>
                  <input type="date" required value={formData.end_date} onChange={e => setFormData({...formData, end_date: e.target.value})} className="w-full px-5 py-3 bg-surface border border-outline-variant rounded-2xl text-sm font-bold focus:ring-4 focus:ring-primary/10 outline-none" />
                </div>
              </div>
              <p className="text-[10px] text-on-surface-variant italic">*Catatan: Angkatan baru dibuat NON-AKTIF secara default demi keamanan data santri.</p>
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
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses: any = { primary: "bg-primary/10 text-primary border-primary/20", success: "bg-success/10 text-success border-success/20", };
  return (
    <div className={cn("p-6 rounded-3xl border flex items-center gap-4 bg-surface-container-lowest shadow-sm transition-all hover:shadow-md", colorClasses[color])}>
      <div className="p-3 rounded-2xl bg-current opacity-10" />
      <div className="absolute p-3">{icon}</div>
      <div className="ml-12">
        <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{title}</p>
        <p className="text-2xl font-black">{value}</p>
      </div>
    </div>
  );
}
