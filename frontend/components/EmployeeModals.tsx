'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Trash2, Save, Eye, User, Phone, Mail, MapPin, Calendar, BookOpen, Briefcase, GraduationCap, FileText, Upload, Download, CheckCircle2, Plus, Edit } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

// --- View Detail Modal ---
export const ViewEmployeeModal = ({ employee: initialEmployee, isOpen, onClose }: any) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'education' | 'documents'>('profile');
  const [employee, setEmployee] = useState(initialEmployee);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setEmployee(initialEmployee);
  }, [initialEmployee, isOpen]);

  if (!isOpen || !employee) return null;

  const handleUploadDocument = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const type = prompt('Jenis Dokumen (Ijazah, SK, Sertifikasi, dll):', 'Ijazah');
    if (!type) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
      const res = await apiRequest(`/employees/${employee.id}/documents`, {
        method: 'POST',
        body: formData
      });
      setEmployee({
        ...employee,
        documents: [...(employee.documents || []), res]
      });
      alert('Dokumen berhasil diunggah!');
    } catch (err: any) {
      alert('Gagal unggah: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Detail Pegawai
          </h3>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 bg-surface border-b border-outline-variant flex gap-6">
          <button 
            onClick={() => setActiveTab('profile')}
            className={cn(
              "py-4 text-sm font-bold border-b-2 transition-all",
              activeTab === 'profile' ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
            )}
          >
            Profil
          </button>
          <button 
            onClick={() => setActiveTab('education')}
            className={cn(
              "py-4 text-sm font-bold border-b-2 transition-all",
              activeTab === 'education' ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
            )}
          >
            Pendidikan
          </button>
          <button 
            onClick={() => setActiveTab('documents')}
            className={cn(
              "py-4 text-sm font-bold border-b-2 transition-all",
              activeTab === 'documents' ? "border-primary text-primary" : "border-transparent text-on-surface-variant hover:text-on-surface"
            )}
          >
            Dokumen
          </button>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 text-sm">
          {activeTab === 'profile' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="flex items-center gap-6 pb-6 border-b border-outline-variant/50">
                <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl shadow-inner">
                  {employee.full_name?.charAt(0)}
                </div>
                <div className="space-y-1">
                  <h4 className="text-2xl font-bold text-on-surface">{employee.full_name}</h4>
                  <p className="text-primary font-bold flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    {employee.position}
                  </p>
                  <span className={cn(
                    "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mt-2",
                    employee.status === 'active' ? "bg-secondary-container/20 text-secondary border-secondary/20" : "bg-outline-variant/20 text-on-surface-variant"
                  )}>
                    {employee.status}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Informasi Dasar</h5>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-on-surface-variant font-medium">
                      <Calendar className="w-4 h-4 text-outline" />
                      <span>Bergabung: {new Date(employee.join_date).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-3 text-on-surface-variant font-medium">
                      <GraduationCap className="w-4 h-4 text-outline" />
                      <span>Pendidikan Terakhir: {employee.education}</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Departemen / Bidang</h5>
                  <div className="bg-surface-container rounded-2xl p-5 border border-outline-variant/30 shadow-inner">
                    <div className="flex justify-between items-center">
                      <span className="text-outline font-bold text-[10px] uppercase tracking-widest">Jurusan</span>
                      <span className="text-on-surface font-bold">{employee.major?.name || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'education' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">Riwayat Pendidikan</h5>
               <div className="bg-surface-container rounded-2xl p-6 border border-outline-variant/30">
                 <div className="flex gap-4 items-start relative">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{employee.education}</p>
                      <p className="text-xs font-medium text-on-surface-variant mt-0.5">Pendidikan Terakhir yang Terdaftar</p>
                    </div>
                 </div>
               </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
               <div className="flex justify-between items-center mb-4">
                 <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Dokumen Pendukung</h5>
                 <label className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 cursor-pointer transition-all",
                    isUploading && "opacity-50 pointer-events-none"
                 )}>
                    {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {isUploading ? 'Mengunggah...' : 'Upload Baru'}
                    <input type="file" className="hidden" onChange={handleUploadDocument} disabled={isUploading} />
                 </label>
               </div>
               
               {employee.documents && employee.documents.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {employee.documents.map((doc: any, i: number) => (
                     <div key={i} className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface hover:bg-surface-container transition-colors group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-surface-container-high text-primary">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-on-surface truncate max-w-[150px]">{doc.type}</p>
                            <p className="text-[10px] font-medium text-on-surface-variant">Terunggah: {new Date(doc.created_at || Date.now()).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}${doc.file_url}`} target="_blank" className="p-2 text-outline-variant hover:text-primary transition-colors">
                          <Download className="w-4 h-4" />
                        </a>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center py-12 text-on-surface-variant opacity-40">
                    <FileText className="w-12 h-12 mb-2" />
                    <p className="font-bold">Belum ada dokumen</p>
                 </div>
               )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end">
          <button onClick={onClose} className="px-6 py-2.5 rounded-xl bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-outline-variant/30 transition-all">Tutup</button>
        </div>
      </div>
    </div>
  );
};

// --- Edit & Create Modal (Unified for simplicity) ---
export const EditEmployeeModal = ({ employee, isOpen, onClose, onSuccess, majors, isCreate = false }: any) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (employee && !isCreate) {
      setFormData({
        full_name: employee.full_name,
        education: employee.education,
        position: employee.position,
        join_date: employee.join_date ? new Date(employee.join_date).toISOString().split('T')[0] : '',
        status: employee.status,
        major_id: employee.major_id || ''
      });
    } else {
      setFormData({
        full_name: '',
        education: '',
        position: '',
        join_date: new Date().toISOString().split('T')[0],
        status: 'active',
        major_id: ''
      });
    }
  }, [employee, isOpen, isCreate]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const url = isCreate ? '/employees' : `/employees/${employee.id}`;
      const method = isCreate ? 'POST' : 'PATCH';
      
      // Clean empty strings for UUID fields
      const payload: any = {
        full_name: formData.full_name,
        education: formData.education,
        position: formData.position,
        join_date: new Date(formData.join_date).toISOString(),
        status: formData.status,
      };
      if (formData.major_id) payload.major_id = formData.major_id;

      await apiRequest(url, {
        method,
        body: JSON.stringify(payload)
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('Gagal menyimpan data pegawai: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            {isCreate ? <Plus className="w-5 h-5 text-primary" /> : <Edit className="w-5 h-5 text-primary" />}
            {isCreate ? 'Tambah Pegawai Baru' : 'Edit Data Pegawai'}
          </h3>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="employeeForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Lengkap</label>
              <input type="text" required value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pendidikan Terakhir</label>
                <input type="text" required placeholder="Contoh: S1 Pendidikan" value={formData.education} onChange={e => setFormData({...formData, education: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jabatan</label>
                <input type="text" required placeholder="Contoh: Guru Matematika" value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tanggal Bergabung</label>
                <input type="date" required value={formData.join_date} onChange={e => setFormData({...formData, join_date: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                <select required value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                  <option value="active">Aktif</option>
                  <option value="inactive">Non-aktif</option>
                  <option value="leave">Cuti</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jurusan (Jika Guru)</label>
                <button 
                  type="button"
                  onClick={async () => {
                    const name = prompt('Nama Jurusan:');
                    const code = prompt('Kode Jurusan (SINGKAT):');
                    if (name && code) {
                      try {
                        await apiRequest('/majors', { method: 'POST', body: JSON.stringify({ name, code: code.toUpperCase() }) });
                        window.location.reload(); // Quickest way to refresh master data in this component for now
                      } catch (err: any) { alert(err.message); }
                    }
                  }}
                  className="text-[10px] font-bold text-primary hover:underline"
                >
                  + Tambah
                </button>
              </div>
              <select value={formData.major_id} onChange={e => setFormData({...formData, major_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                <option value="">Tidak ada Jurusan</option>
                {majors.map((m: any) => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-outline text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Batal</button>
          <button type="submit" form="employeeForm" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isCreate ? 'Simpan Pegawai' : 'Simpan Perubahan'}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Delete Confirm Modal ---
export const DeleteEmployeeModal = ({ employee, isOpen, onClose, onSuccess }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !employee) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiRequest(`/employees/${employee.id}`, { method: 'DELETE' });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('Gagal menghapus pegawai: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-md rounded-2xl shadow-2xl overflow-hidden p-8 text-center space-y-6 animate-in fade-in zoom-in duration-200">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto text-error shadow-inner">
          <Trash2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-on-surface tracking-tight">Hapus Data Pegawai?</h3>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Anda akan menghapus data <span className="text-on-surface font-bold">"{employee.full_name}"</span>. Tindakan ini tidak dapat dibatalkan.
          </p>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="flex-1 px-6 py-3 rounded-xl border border-outline text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all active:scale-95">Batal</button>
          <button 
            onClick={handleDelete} 
            disabled={isDeleting}
            className="flex-1 px-6 py-3 rounded-xl bg-error text-on-error font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-error/20"
          >
            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            Hapus Pegawai
          </button>
        </div>
      </div>
    </div>
  );
};
