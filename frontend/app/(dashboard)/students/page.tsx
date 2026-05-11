'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Eye, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  X,
  Loader2,
  AlertCircle,
  Users,
  UserCheck,
  UserX,
  Printer,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewStudentModal, EditStudentModal, DeleteStudentModal } from '@/components/StudentModals';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ total: 0, male: 0, female: 0, active: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Master Data
  const [majors, setMajors] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Filters & Search
  const [filters, setFilters] = useState({
    major_id: '',
    batch_id: '',
    gender: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    last_page: 1
  });

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [modalType, setModalType] = useState<'view' | 'edit' | 'delete' | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nis: '',
    nik: '',
    full_name: '',
    gender: 'L',
    birth_place: '',
    birth_date: '',
    address: '',
    phone: '',
    email: '',
    major_id: '',
    batch_id: '',
    class_id: '',
    status: 'active',
    parents: {
      father_name: '',
      mother_name: '',
      phone: '',
      address: ''
    }
  });

  const fetchStats = async () => {
    try {
      const res = await apiRequest('/stats/students');
      setStats(res);
    } catch (err) {
      console.error('Gagal mengambil statistik:', err);
    }
  };

  const fetchMasterData = async () => {
    try {
      const [mRes, bRes, cRes] = await Promise.all([
        apiRequest('/majors?limit=100'),
        apiRequest('/batches?limit=100'),
        apiRequest('/classes?limit=100')
      ]);
      setMajors(mRes.data || []);
      setBatches(bRes.data || []);
      setClasses(cRes.data || []);
      
      if (mRes.data?.length > 0) {
        setFormData(prev => ({ ...prev, major_id: mRes.data[0].id }));
      }
      if (bRes.data?.length > 0) {
        setFormData(prev => ({ ...prev, batch_id: bRes.data[0].id }));
      }
      if (cRes.data?.length > 0) {
        setFormData(prev => ({ ...prev, class_id: cRes.data[0].id }));
      }
    } catch (err) {
      console.error('Gagal mengambil data master:', err);
    }
  };

  const fetchStudents = async () => {
    setIsLoading(true);
    try {
      const query = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.major_id && { major_id: filters.major_id }),
        ...(filters.batch_id && { batch_id: filters.batch_id }),
        ...(filters.gender && { gender: filters.gender }),
        ...(filters.search && { search: filters.search }),
      }).toString();

      const response = await apiRequest(`/students?${query}`);
      setStudents(response.data || []);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        last_page: response.meta.last_page
      }));
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data siswa');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchMasterData();
      fetchStats();
    }
  }, []);

  useEffect(() => {
    setPagination(prev => ({ ...prev, page: 1 }));
  }, [filters.major_id, filters.batch_id, filters.gender, filters.search]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const timer = setTimeout(() => {
        fetchStudents();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [filters, pagination.page]);

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/students', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          birth_date: new Date(formData.birth_date).toISOString()
        })
      });
      setIsAddModalOpen(false);
      fetchStudents();
      fetchStats();
      setFormData({ ...formData, nis: '', nik: '', full_name: '', birth_place: '', birth_date: '', address: '', phone: '', email: '', parents: { father_name: '', mother_name: '', phone: '', address: '' } });
    } catch (err: any) {
      alert('Gagal menambahkan siswa: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1'}/students/export`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data_siswa_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      alert('Gagal mengekspor data');
    }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsLoading(true);
      const res = await apiRequest('/students/import', {
        method: 'POST',
        body: formData
      });
      alert(`Berhasil mengimpor ${res.imported} siswa`);
      fetchStudents();
      fetchStats();
    } catch (err: any) {
      alert('Gagal mengimpor data: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Manajemen Siswa</h2>
          <p className="text-on-surface-variant font-medium mt-1">Kelola data, status, dan informasi akademik siswa.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors active:scale-95 shadow-sm cursor-pointer">
            <Upload className="w-4 h-4" />
            <span>Import Excel</span>
            <input type="file" className="hidden" accept=".xlsx" onChange={handleImport} />
          </label>
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors active:scale-95 shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Siswa" value={stats.total} icon={<Users className="w-5 h-5" />} color="primary" />
        <StatCard title="Aktif" value={stats.active} icon={<UserCheck className="w-5 h-5" />} color="success" />
        <StatCard title="Alumni" value={stats.alumni} icon={<GraduationCap className="w-5 h-5" />} color="secondary" />
        <StatCard title="Pindah" value={stats.moved} icon={<UserX className="w-5 h-5" />} color="tertiary" />
        <StatCard title="Laki-laki" value={stats.male} icon={<Users className="w-5 h-5" />} color="primary" />
        <StatCard title="Perempuan" value={stats.female} icon={<Users className="w-5 h-5" />} color="tertiary" />
      </div>

      {/* Filter Section */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pencarian</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container focus-within:ring-2 focus-within:ring-primary/20 transition-all relative">
              <Search className="w-4 h-4 text-outline mr-3" />
              <input 
                type="text" 
                placeholder="Cari NIS atau Nama..." 
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
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jenis Kelamin</label>
            <select 
              className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={filters.gender}
              onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">Semua</option>
              <option value="L">Laki-laki</option>
              <option value="P">Perempuan</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Angkatan</label>
            <select 
              className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={filters.batch_id}
              onChange={(e) => setFilters(prev => ({ ...prev, batch_id: e.target.value }))}
            >
              <option value="">Semua Angkatan</option>
              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jurusan</label>
            <select 
              className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={filters.major_id}
              onChange={(e) => setFilters(prev => ({ ...prev, major_id: e.target.value }))}
            >
              <option value="">Semua Jurusan</option>
              {majors.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
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
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">NIS</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Kelas</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Jurusan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Angkatan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      <p className="text-on-surface-variant font-medium text-sm">Memuat data siswa...</p>
                    </div>
                  </td>
                </tr>
              ) : students.length === 0 ? (
                <tr>
                   <td colSpan={7} className="py-10 text-center text-on-surface-variant font-medium flex flex-col items-center gap-2">
                     <AlertCircle className="w-8 h-8 opacity-20" />
                     Belum ada data siswa.
                   </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">
                          {student.full_name?.charAt(0)}
                        </div>
                        <span className="font-semibold text-on-surface">{student.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-8 font-semibold text-on-surface">{student.nis}</td>
                    <td className="py-4 px-8 text-on-surface font-medium">{student.class?.name || '-'}</td>
                    <td className="py-4 px-8 text-on-surface font-medium">{student.major?.code || '-'}</td>
                    <td className="py-4 px-8 text-on-surface font-medium">{student.batch?.name || '-'}</td>
                    <td className="py-4 px-8 text-on-surface">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        student.status === 'active' 
                          ? "bg-secondary-container/20 text-secondary" 
                          : "bg-outline-variant/20 text-on-surface-variant"
                      )}>
                        {student.status === 'active' ? 'Aktif' : student.status}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => { setSelectedStudent(student); setModalType('view'); }}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedStudent(student); setModalType('edit'); }}
                          className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => { setSelectedStudent(student); setModalType('delete'); }}
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

      {/* Modals */}
      <ViewStudentModal 
        isOpen={modalType === 'view'} 
        onClose={() => setModalType(null)} 
        student={selectedStudent} 
      />
      
      <EditStudentModal 
        isOpen={modalType === 'edit'} 
        onClose={() => setModalType(null)} 
        student={selectedStudent} 
        onSuccess={() => { fetchStudents(); fetchStats(); }}
        majors={majors}
        batches={batches}
        classes={classes}
      />

      <DeleteStudentModal 
        isOpen={modalType === 'delete'} 
        onClose={() => setModalType(null)} 
        student={selectedStudent} 
        onSuccess={() => { fetchStudents(); fetchStats(); }}
      />

      {/* Modal Tambah Siswa */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface">Tambah Siswa Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="studentForm" onSubmit={handleCreateStudent} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIS</label>
                    <input type="text" required value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIK</label>
                    <input type="text" required value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Lengkap</label>
                  <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tempat Lahir</label>
                    <input type="text" required value={formData.birth_place} onChange={e => setFormData({...formData, birth_place: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tanggal Lahir</label>
                    <input type="date" required value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jenis Kelamin</label>
                    <select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                    <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telepon</label>
                    <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jurusan</label>
                      <button 
                        type="button"
                        onClick={async () => {
                          const name = prompt('Nama Jurusan:');
                          const code = prompt('Kode Jurusan (SINGKAT):');
                          if (name && code) {
                            try {
                              await apiRequest('/majors', { method: 'POST', body: JSON.stringify({ name, code: code.toUpperCase() }) });
                              fetchMasterData();
                            } catch (err: any) { alert(err.message); }
                          }
                        }}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        + Tambah
                      </button>
                    </div>
                    <select required value={formData.major_id} onChange={e => setFormData({...formData, major_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                      {majors.map(m => <option key={m.id} value={m.id}>{m.name} ({m.code})</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Angkatan</label>
                      <button 
                        type="button"
                        onClick={async () => {
                          const name = prompt('Nama Angkatan (Contoh: 2023/2024):');
                          const year = prompt('Tahun (YYYY):');
                          if (name && year) {
                            try {
                              await apiRequest('/batches', { method: 'POST', body: JSON.stringify({ name, year: parseInt(year) }) });
                              fetchMasterData();
                            } catch (err: any) { alert(err.message); }
                          }
                        }}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        + Tambah
                      </button>
                    </div>
                    <select required value={formData.batch_id} onChange={e => setFormData({...formData, batch_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                      {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kelas</label>
                      <button 
                        type="button"
                        onClick={async () => {
                          const name = prompt('Nama Kelas (Contoh: X RPL 1):');
                          if (name) {
                            try {
                              await apiRequest('/classes', { 
                                method: 'POST', 
                                body: JSON.stringify({ 
                                  name, 
                                  grade_level: 10, 
                                  major_id: formData.major_id, 
                                  batch_id: formData.batch_id 
                                }) 
                              });
                              fetchMasterData();
                            } catch (err: any) { alert(err.message); }
                          }
                        }}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        + Tambah
                      </button>
                    </div>
                    <select required value={formData.class_id} onChange={e => setFormData({...formData, class_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                      {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                    <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                      <option value="active">Aktif</option>
                      <option value="alumni">Alumni</option>
                      <option value="moved">Pindah</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alamat Lengkap</label>
                  <textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none"></textarea>
                </div>

                <div className="pt-4 border-t border-outline-variant">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Data Orang Tua</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Ayah</label>
                      <input type="text" required value={formData.parents.father_name} onChange={e => setFormData({...formData, parents: { ...formData.parents, father_name: e.target.value }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Ibu</label>
                      <input type="text" required value={formData.parents.mother_name} onChange={e => setFormData({...formData, parents: { ...formData.parents, mother_name: e.target.value }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-1 mt-4">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telepon Orang Tua</label>
                    <input type="text" required value={formData.parents.phone} onChange={e => setFormData({...formData, parents: { ...formData.parents, phone: e.target.value, address: formData.address }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" />
                  </div>
                </div>
              </form>
            </div>

            <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
              <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors">Batal</button>
              <button type="submit" form="studentForm" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                <span>Simpan Siswa</span>
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
