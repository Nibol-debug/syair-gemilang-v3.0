'use client';

import React, { useState, useMemo, useEffect } from 'react';
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
  ShieldCheck,
  UserCheck,
  UserX,
  ShieldAlert,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function UsersPage() {
  const [isLoading] = useState(false);
  
  // Filters & Search
  const [filters, setFilters] = useState({
    search: '',
    role: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10
  });

  // Mock Data
  const users = [
    { id: '1', name: 'Admin Utama', email: 'admin@syiar.sch.id', role: 'Super Admin', status: 'active', lastLogin: '2024-05-20 08:30' },
    { id: '2', name: 'Budi Santoso', email: 'budi@syiar.sch.id', role: 'Kepala Sekolah', status: 'active', lastLogin: '2024-05-19 14:15' },
    { id: '3', name: 'Siti Aminah', email: 'siti@syiar.sch.id', role: 'Guru', status: 'active', lastLogin: '2024-05-20 10:00' },
    { id: '4', name: 'Eko Wijaya', email: 'eko@syiar.sch.id', role: 'Bendahara', status: 'inactive', lastLogin: '2024-05-10 11:20' },
  ];

  // Filtering Logic
  const filteredData = useMemo(() => {
    return users.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                           item.email.toLowerCase().includes(filters.search.toLowerCase());
      const matchesRole = filters.role === '' || item.role.toUpperCase().includes(filters.role.toUpperCase());
      return matchesSearch && matchesRole;
    });
  }, [filters]);

  // Reset pagination on filter change
  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters]);

  // Paginated Data
  const paginatedData = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.limit;
    return filteredData.slice(startIndex, startIndex + pagination.limit);
  }, [filteredData, pagination]);

  const totalPages = Math.ceil(filteredData.length / pagination.limit) || 1;

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Manajemen Pengguna</h2>
          <p className="text-on-surface-variant font-medium mt-1">Kelola akun pengguna, peran, dan hak akses sistem.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Pengguna</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Pengguna" value={12} icon={<ShieldCheck className="w-6 h-6" />} color="primary" />
        <StatCard title="Admin" value={3} icon={<ShieldAlert className="w-6 h-6" />} color="secondary" />
        <StatCard title="Aktif" value={10} icon={<UserCheck className="w-6 h-6" />} color="success" />
        <StatCard title="Non-Aktif" value={2} icon={<UserX className="w-6 h-6" />} color="tertiary" />
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
                placeholder="Cari Nama atau Email..." 
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
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Peran (Role)</label>
            <select 
              className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value }))}
            >
              <option value="">Semua Peran</option>
              <option value="ADMIN">Admin</option>
              <option value="STAFF">Staff</option>
              <option value="GURU">Guru</option>
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
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Nama</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Email</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Peran</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Login Terakhir</th>
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
              ) : paginatedData.length === 0 ? (
                <tr>
                   <td colSpan={6} className="py-10 text-center text-on-surface-variant font-medium">
                     Tidak ada data yang sesuai dengan filter.
                   </td>
                </tr>
              ) : (
                paginatedData.map((user) => (
                  <tr key={user.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                    <td className="py-4 px-8 font-semibold text-on-surface">{user.name}</td>
                    <td className="py-4 px-8 text-on-surface font-medium">{user.email}</td>
                    <td className="py-4 px-8">
                        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary">
                            {user.role}
                        </span>
                    </td>
                    <td className="py-4 px-8 text-on-surface-variant font-medium">{user.lastLogin}</td>
                    <td className="py-4 px-8 text-on-surface">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        user.status === 'active' 
                          ? "bg-secondary-container/20 text-secondary" 
                          : "bg-outline-variant/20 text-on-surface-variant"
                      )}>
                        {user.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
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
          <span className="text-xs font-medium text-on-surface-variant">Menampilkan halaman {pagination.page} dari {totalPages}</span>
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
              onClick={() => setPagination(prev => ({ ...prev, page: Math.min(totalPages, prev.page + 1) }))}
              disabled={pagination.page === totalPages}
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
