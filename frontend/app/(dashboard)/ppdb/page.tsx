'use client';

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Eye, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Loader2,
  ClipboardList,
  UserPlus,
  Clock,
  CheckCircle2,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

export default function PPDBPage() {
  const [applicants, setApplicants] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Filters & Search
  const [filters, setFilters] = useState({
    search: '',
    status: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    last_page: 1
  });

  const fetchApplicants = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.search && { search: filters.search }),
        ...(filters.status && { status: filters.status }),
      }).toString();

      const response = await apiRequest(`/applicants?${query}`);
      setApplicants(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        last_page: response.meta.last_page
      }));
    } catch (err: any) {
      console.error('Gagal mengambil data pendaftar:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchApplicants();
    }
  }, [filters, pagination.page]);

  // Reset pagination on filter change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters]);

  const handleVerify = async (id: string, status: string) => {
    try {
      await apiRequest(`/applicants/${id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      fetchApplicants();
    } catch (err: any) {
      alert('Gagal memverifikasi pendaftar: ' + err.message);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">PPDB Online</h2>
          <p className="text-on-surface-variant font-medium mt-1">Penerimaan Peserta Didik Baru Tahun Ajaran 2024/2025.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pendaftar</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pendaftar" value={pagination.total} icon={<ClipboardList className="w-6 h-6" />} color="primary" />
        <StatCard title="Menunggu" value={applicants.filter(a => a.status === 'pending').length} icon={<Clock className="w-6 h-6" />} color="secondary" />
        <StatCard title="Terverifikasi" value={applicants.filter(a => a.status === 'verified').length} icon={<UserPlus className="w-6 h-6" />} color="tertiary" />
        <StatCard title="Diterima" value={applicants.filter(a => a.status === 'accepted').length} icon={<CheckCircle2 className="w-6 h-6" />} color="success" />
      </div>

      {/* Filter Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col gap-2 col-span-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pencarian</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container focus-within:ring-2 focus-within:ring-primary/20 transition-all relative">
              <Search className="w-4 h-4 text-outline mr-3" />
              <input 
                type="text" 
                placeholder="Cari Nama atau Email Pendaftar..." 
                className="bg-transparent outline-none text-sm w-full text-on-surface placeholder:text-outline-variant pr-8"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
              {filters.search && (
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                  className="absolute right-3 text-outline hover:text-on-surface transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status Seleksi</label>
            <select 
              className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
            >
              <option value="">Semua Status</option>
              <option value="pending">Menunggu</option>
              <option value="verified">Terverifikasi</option>
              <option value="accepted">Diterima</option>
              <option value="rejected">Ditolak</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Nama Pendaftar</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Email</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Telepon</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Tanggal Daftar</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-on-surface-variant font-medium text-sm">Memuat data...</p>
                    </div>
                  </td>
                </tr>
              ) : applicants.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-10 text-center text-on-surface-variant font-medium">
                     Tidak ada data pendaftar.
                   </td>
                </tr>
              ) : (
                applicants.map((item) => (
                  <tr key={item.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                    <td className="py-4 px-8 font-semibold text-on-surface">{item.full_name}</td>
                    <td className="py-4 px-8 text-on-surface font-medium">{item.email}</td>
                    <td className="py-4 px-8 text-on-surface font-medium">{item.phone}</td>
                    <td className="py-4 px-8 text-on-surface-variant font-medium">{new Date(item.created_at).toLocaleDateString()}</td>
                    <td className="py-4 px-8 text-on-surface">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        item.status === 'accepted' ? "bg-success-container/30 text-success" :
                        item.status === 'verified' ? "bg-secondary-container/20 text-secondary" :
                        item.status === 'rejected' ? "bg-error-container/20 text-error" :
                        "bg-outline-variant/20 text-on-surface-variant"
                      )}>
                        {item.status === 'pending' ? 'Menunggu' : 
                         item.status === 'verified' ? 'Terverifikasi' :
                         item.status === 'accepted' ? 'Diterima' : 'Ditolak'}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.status === 'pending' && (
                          <button 
                            onClick={() => handleVerify(item.id, 'verified')}
                            className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Verify"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors" title="Delete">
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
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(pagination.last_page, prev.page + 1) }))}
              disabled={pagination.page === pagination.last_page}
              className="p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
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
