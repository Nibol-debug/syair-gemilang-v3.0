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
  User,
  Printer,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ViewStudentModal, EditStudentModal, DeleteStudentModal } from '@/components/StudentModals';
import { MapPicker } from '@/components/MapPicker';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';

export default function StudentsPage() {
  const [activeTab, setActiveTab] = useState<'list' | 'stats'>('list');
  const [students, setStudents] = useState<any[]>([]);
  const [stats, setStats] = useState<any>({ 
    total: 0, male: 0, female: 0, active: 0, alumni: 0, moved: 0,
    ageDistribution: [],
    locationDistribution: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Master Data
  const [branches, setBranches] = useState<any[]>([]);
  const [majors, setMajors] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [classes, setClasses] = useState<any[]>([]);

  // Filters & Search
  const [filters, setFilters] = useState({
    branch_id: '',
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
  const [isUploading, setIsUploading] = useState(false);
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
    branch_id: '',
    major_id: '',
    batch_id: '',
    class_id: '',
    status: 'active',
    health_history: '',
    latitude: '',
    longitude: '',
    profile_picture: '',
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
      const [brRes, mRes, bRes, cRes] = await Promise.all([
        apiRequest('/branches'),
        apiRequest('/majors?limit=100'),
        apiRequest('/batches?limit=100'),
        apiRequest('/classes?limit=100')
      ]);
      setBranches(brRes || []);
      setMajors(mRes.data || []);
      setBatches(bRes.data || []);
      setClasses(cRes.data || []);
      
      const updates: any = {};
      if (brRes?.length > 0) updates.branch_id = brRes[0].id;
      if (mRes.data?.length > 0) updates.major_id = mRes.data[0].id;
      if (bRes.data?.length > 0) updates.batch_id = bRes.data[0].id;
      
      setFormData(prev => ({ ...prev, ...updates }));
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
        ...(filters.branch_id && { branch_id: filters.branch_id }),
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
  }, [filters.branch_id, filters.major_id, filters.batch_id, filters.gender, filters.search]);

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
          birth_date: new Date(formData.birth_date).toISOString(),
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        })
      });
      setIsAddModalOpen(false);
      fetchStudents();
      fetchStats();
      setFormData({ ...formData, nis: '', nik: '', full_name: '', birth_place: '', birth_date: '', address: '', phone: '', email: '', health_history: '', latitude: '', longitude: '', profile_picture: '', parents: { father_name: '', mother_name: '', phone: '', address: '' } });
    } catch (err: any) {
      alert('Gagal menambahkan siswa: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const form = new FormData();
    form.append('photo', file);
    try {
      const res = await apiRequest('/students/upload-photo', { method: 'POST', body: form });
      setFormData(prev => ({ ...prev, profile_picture: res.url }));
    } catch (err) { alert('Gagal unggah foto'); }
    finally { setIsUploading(false); }
  };

  const handleExport = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/api/v1/students/export`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `data_siswa_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) { alert('Gagal mengekspor data'); }
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    try {
      setIsLoading(true);
      const res = await apiRequest('/students/import', { method: 'POST', body: formData });
      alert(`Berhasil mengimpor ${res.imported} siswa`);
      fetchStudents();
      fetchStats();
    } catch (err: any) { alert('Gagal mengimpor data: ' + err.message); }
    finally { setIsLoading(false); }
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
            <Upload className="w-4 h-4" /><span>Import Excel</span>
            <input type="file" className="hidden" accept=".xlsx" onChange={handleImport} />
          </label>
          <button onClick={handleExport} className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors active:scale-95 shadow-sm">
            <Download className="w-4 h-4" /><span>Export</span>
          </button>
          <button onClick={() => setIsAddModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md">
            <Plus className="w-4 h-4" /><span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard title="Total Siswa" value={stats.total} icon={<Users className="w-5 h-5" />} color="primary" />
        <StatCard title="Aktif" value={stats.active} icon={<UserCheck className="w-5 h-5" />} color="success" />
        <StatCard title="Alumni" value={stats.alumni} icon={<GraduationCap className="w-5 h-5" />} color="secondary" />
        <StatCard title="Pindah" value={stats.moved} icon={<UserX className="w-5 h-5" />} color="tertiary" />
        <StatCard title="Laki-laki" value={stats.male} icon={<Users className="w-5 h-5" />} color="primary" />
        <StatCard title="Perempuan" value={stats.female} icon={<Users className="w-5 h-5" />} color="tertiary" />
      </div>

      <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
        <button onClick={() => setActiveTab('list')} className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'list' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface")}>Daftar Siswa</button>
        <button onClick={() => setActiveTab('stats')} className={cn("px-6 py-2 rounded-lg text-sm font-bold transition-all", activeTab === 'stats' ? "bg-white text-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface")}>Statistik Visual</button>
      </div>

      {activeTab === 'list' ? (
        <>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pencarian</label>
                <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container focus-within:ring-2 focus-within:ring-primary/20 transition-all relative">
                  <Search className="w-4 h-4 text-outline mr-3" />
                  <input type="text" placeholder="Cari NIS atau Nama..." className="bg-transparent outline-none text-sm w-full text-on-surface placeholder:text-outline-variant pr-8" value={filters.search} onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))} />
                  {filters.search && <button onClick={() => setFilters(prev => ({ ...prev, search: '' }))} className="absolute right-3 text-outline hover:text-on-surface transition-colors"><X className="w-4 h-4" /></button>}
                </div>
              </div>
              <div className="flex flex-col gap-2"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jenis Kelamin</label><select className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer" value={filters.gender} onChange={(e) => setFilters(prev => ({ ...prev, gender: e.target.value }))}><option value="">Semua</option><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
              <div className="flex flex-col gap-2"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cabang</label><select className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer" value={filters.branch_id} onChange={(e) => setFilters(prev => ({ ...prev, branch_id: e.target.value, major_id: '' }))}><option value="">Semua Cabang</option>{branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
              <div className="flex flex-col gap-2"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jurusan</label><select className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer" value={filters.major_id} onChange={(e) => setFilters(prev => ({ ...prev, major_id: e.target.value }))}><option value="">Semua Jurusan</option>{majors.filter(m => !filters.branch_id || m.branch_id === filters.branch_id).map(m => <option key={m.id} value={m.id}>{m.name}</option>)}</select></div>
            </div>
          </div>

          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Nama</th>
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">NIS</th>
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Cabang</th>
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Kelas</th>
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Jurusan</th>
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Angkatan</th>
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                    <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {isLoading ? (
                    <tr><td colSpan={8} className="py-10 text-center"><div className="flex flex-col items-center gap-2"><Loader2 className="w-8 h-8 text-primary animate-spin" /><p className="text-on-surface-variant font-medium text-sm">Memuat data siswa...</p></div></td></tr>
                  ) : students.length === 0 ? (
                    <tr><td colSpan={8} className="py-10 text-center text-on-surface-variant font-medium flex flex-col items-center gap-2"><AlertCircle className="w-8 h-8 opacity-20" />Belum ada data siswa.</td></tr>
                  ) : (
                    students.map((student) => (
                      <tr key={student.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                        <td className="py-4 px-8"><div className="flex items-center gap-3">{student.profile_picture ? <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${student.profile_picture}`} alt="" className="w-9 h-9 rounded-full object-cover" /> : <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs uppercase">{student.full_name?.charAt(0)}</div>}<span className="font-semibold text-on-surface">{student.full_name}</span></div></td>
                        <td className="py-4 px-8 font-semibold text-on-surface">{student.nis}</td>
                        <td className="py-4 px-8 text-on-surface font-medium">{student.branch?.name || '-'}</td>
                        <td className="py-4 px-8 text-on-surface font-medium">{student.class?.name || '-'}</td>
                        <td className="py-4 px-8 text-on-surface font-medium">{student.major?.name || '-'}</td>
                        <td className="py-4 px-8 text-on-surface font-medium">{student.batch?.name || '-'}</td>
                        <td className="py-4 px-8 text-on-surface"><span className={cn("px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider", student.status === 'active' ? "bg-secondary-container/20 text-secondary" : "bg-outline-variant/20 text-on-surface-variant")}>{student.status === 'active' ? 'Aktif' : student.status}</span></td>
                        <td className="py-4 px-8 text-right"><div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity"><button onClick={() => { setSelectedStudent(student); setModalType('view'); }} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="View"><Eye className="w-4 h-4" /></button><button onClick={() => { setSelectedStudent(student); setModalType('edit'); }} className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Edit"><Edit2 className="w-4 h-4" /></button><button onClick={() => { setSelectedStudent(student); setModalType('delete'); }} className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button></div><button className="p-2 text-on-surface-variant group-hover:hidden transition-all"><MoreHorizontal className="w-4 h-4" /></button></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between px-8 py-5 border-t border-outline-variant bg-surface-container-lowest">
              <span className="text-xs font-medium text-on-surface-variant">Menampilkan halaman {pagination.page} dari {pagination.last_page}</span>
              <div className="flex items-center gap-1">
                <button onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))} disabled={pagination.page === 1} className="p-2 rounded-lg text-outline hover:bg-surface-container disabled:opacity-50 transition-colors"><ChevronLeft className="w-5 h-5" /></button>
                <button className="w-9 h-9 rounded-lg bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-md">{pagination.page}</button>
                <button onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.last_page, prev.page + 1) }))} disabled={pagination.page === pagination.last_page} className="p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors active:scale-95"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6">Persebaran Usia</h3>
            <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><BarChart data={stats.ageDistribution}><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" /><XAxis dataKey="name" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} /><Tooltip cursor={{ fill: '#f1f5f9' }} /><Bar dataKey="value" fill="#1e40af" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer></div>
          </div>
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
            <h3 className="text-lg font-bold text-on-surface mb-6">Persebaran Wilayah (Kampus)</h3>
            <div className="h-[300px] w-full"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={stats.locationDistribution} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{stats.locationDistribution.map((entry: any, index: number) => (<Cell key={`cell-${index}`} fill={['#1e40af', '#10b981', '#f59e0b', '#ef4444'][index % 4]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer><div className="flex flex-wrap justify-center gap-4 mt-4">{stats.locationDistribution.map((item: any, i: number) => (<div key={i} className="flex items-center gap-2"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: ['#1e40af', '#10b981', '#f59e0b', '#ef4444'][i % 4] }} /><span className="text-xs font-bold text-on-surface-variant">{item.name}: {item.value}</span></div>))}</div></div>
          </div>
        </div>
      )}

      <ViewStudentModal isOpen={modalType === 'view'} onClose={() => setModalType(null)} student={selectedStudent} />
      <EditStudentModal isOpen={modalType === 'edit'} onClose={() => setModalType(null)} student={selectedStudent} onSuccess={() => { fetchStudents(); fetchStats(); }} branches={branches} majors={majors} batches={batches} classes={classes} />
      <DeleteStudentModal isOpen={modalType === 'delete'} onClose={() => setModalType(null)} student={selectedStudent} onSuccess={() => { fetchStudents(); fetchStats(); }} />

      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-4xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[95vh]">
            <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-lg font-bold text-on-surface">Tambah Siswa Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 overflow-y-auto flex-1">
              <form id="studentForm" onSubmit={handleCreateStudent} className="space-y-6">
                <div className="flex items-center gap-6 bg-surface-container p-4 rounded-2xl border border-outline-variant/30">
                  <div className="relative group">
                    <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                      {formData.profile_picture ? <img src={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${formData.profile_picture}`} className="w-full h-full object-cover" /> : <User className="w-8 h-8 text-primary" />}
                      {isUploading && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="w-6 h-6 text-white animate-spin" /></div>}
                    </div>
                    <label className="absolute -bottom-2 -right-2 p-2 bg-primary text-on-primary rounded-xl cursor-pointer shadow-lg hover:scale-105 transition-all"><Upload className="w-4 h-4" /><input type="file" className="hidden" accept="image/*" onChange={handlePhotoUpload} /></label>
                  </div>
                  <div><h4 className="font-bold text-on-surface text-sm uppercase tracking-wider">Foto Profil Santri</h4><p className="text-[10px] font-medium text-on-surface-variant">Klik tombol biru untuk mengunggah foto.</p></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIS</label><input type="text" required value={formData.nis} onChange={e => setFormData({...formData, nis: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIK</label><input type="text" required value={formData.nik} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                </div>
                <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Lengkap</label><input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Lokasi Rumah (Pilih di Peta)</label>
                  <MapPicker onLocationSelect={(lat: number, lng: number, addr?: string) => { setFormData(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString(), address: addr || prev.address })); }} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tempat Lahir</label><input type="text" required value={formData.birth_place} onChange={e => setFormData({...formData, birth_place: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tanggal Lahir</label><input type="date" required value={formData.birth_date} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jenis Kelamin</label><select required value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"><option value="L">Laki-laki</option><option value="P">Perempuan</option></select></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label><input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                   <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telepon</label><input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Cabang RGI</label>
                    <select 
                      required 
                      value={formData.branch_id} 
                      onChange={e => {
                        const newBranchId = e.target.value;
                        const firstMajor = majors.find(m => m.branch_id === newBranchId);
                        setFormData({
                          ...formData, 
                          branch_id: newBranchId, 
                          major_id: firstMajor ? firstMajor.id : '',
                          class_id: ''
                        });
                      }} 
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                    >
                      {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jurusan</label>
                    <select 
                      required 
                      value={formData.major_id} 
                      onChange={e => setFormData({...formData, major_id: e.target.value, class_id: ''})} 
                      className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
                    >
                      <option value="">Pilih Jurusan</option>
                      {majors
                        .filter(m => m.branch_id === formData.branch_id)
                        .map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Angkatan</label><select required value={formData.batch_id} onChange={e => setFormData({...formData, batch_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">{batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}</select></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kelas</label><select required value={formData.class_id} onChange={e => setFormData({...formData, class_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"><option value="">Pilih Kelas</option>{classes.filter(c => c.major_id === formData.major_id && c.batch_id === formData.batch_id).map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                  <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</label><select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"><option value="active">Aktif</option><option value="alumni">Alumni</option><option value="moved">Pindah</option></select></div>
                </div>
                <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alamat Lengkap (Auto-fill)</label><textarea required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none"></textarea></div>
                <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Riwayat Kesehatan</label><textarea value={formData.health_history} onChange={e => setFormData({...formData, health_history: e.target.value})} placeholder="Alergi, penyakit kronis, dll..." className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none h-20 resize-none"></textarea></div>
                <div className="pt-4 border-t border-outline-variant">
                  <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Data Orang Tua</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Ayah</label><input type="text" required value={formData.parents.father_name} onChange={e => setFormData({...formData, parents: { ...formData.parents, father_name: e.target.value }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                    <div className="space-y-1"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Ibu</label><input type="text" required value={formData.parents.mother_name} onChange={e => setFormData({...formData, parents: { ...formData.parents, mother_name: e.target.value }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                  </div>
                  <div className="space-y-1 mt-4"><label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telepon Orang Tua</label><input type="text" required value={formData.parents.phone} onChange={e => setFormData({...formData, parents: { ...formData.parents, phone: e.target.value, address: formData.address }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none" /></div>
                </div>
              </form>
            </div>
            <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3"><button type="button" onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors">Batal</button><button type="submit" form="studentForm" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">{isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}<span>Simpan Siswa</span></button></div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusProgress({ label, value, total, color }: any) {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (<div className="space-y-2"><div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider"><span className="text-on-surface-variant">{label}</span><span className="text-on-surface">{value} ({Math.round(percentage)}%)</span></div><div className="h-2 w-full bg-surface-container rounded-full overflow-hidden"><div className={cn("h-full transition-all duration-1000", color)} style={{ width: `${percentage}%` }} /></div></div>);
}

function StatCard({ title, value, icon, color }: any) {
  const colorClasses: any = { primary: "bg-primary/10 text-primary border-primary/20", secondary: "bg-secondary/10 text-secondary border-secondary/20", tertiary: "bg-tertiary/10 text-tertiary border-tertiary/20", success: "bg-success-container/30 text-success border-success/20", };
  return (<div className={cn("p-6 rounded-2xl border flex items-center gap-4 bg-surface-container-lowest shadow-sm", colorClasses[color])}><div className="p-3 rounded-xl bg-current opacity-10" /><div className="absolute p-3">{icon}</div><div className="ml-12"><p className="text-[10px] font-bold uppercase tracking-widest opacity-70">{title}</p><p className="text-2xl font-black">{value}</p></div></div>);
}
