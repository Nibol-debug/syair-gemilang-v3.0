'use client';

import React, { useState, useEffect } from 'react';
import { X, Loader2, Trash2, Save, Eye, User, Phone, Mail, MapPin, Calendar, BookOpen, Hash, Verified, Edit, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

// --- View Detail Modal ---
export const ViewStudentModal = ({ student, isOpen, onClose }: any) => {
  if (!isOpen || !student) return null;

  const handlePrint = () => {
    const printContent = document.getElementById('student-card-printable');
    if (!printContent) return;
    
    const win = window.open('', '_blank');
    if (!win) return;
    
    win.document.write(`
      <html>
        <head>
          <title>Kartu Pelajar - ${student.full_name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap');
            body { font-family: 'Inter', sans-serif; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; background: #f0f0f0; }
            .card { width: 350px; height: 220px; background: linear-gradient(135deg, #0052D4 0%, #4364F7 50%, #6FB1FC 100%); border-radius: 15px; padding: 20px; color: white; position: relative; box-shadow: 0 10px 30px rgba(0,0,0,0.2); overflow: hidden; }
            .card::before { content: ""; position: absolute; top: -50px; right: -50px; width: 150px; height: 150px; background: rgba(255,255,255,0.1); border-radius: 50%; }
            .header { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
            .logo { width: 40px; height: 40px; background: white; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: #0052D4; font-weight: 900; font-size: 18px; }
            .school-name { font-size: 14px; font-weight: 900; letter-spacing: 1px; }
            .content { display: flex; gap: 15px; }
            .photo { width: 80px; height: 100px; background: rgba(255,255,255,0.2); border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 40px; border: 2px solid rgba(255,255,255,0.3); }
            .details { flex: 1; }
            .details h2 { margin: 0; font-size: 16px; font-weight: 900; text-transform: uppercase; }
            .details p { margin: 2px 0; font-size: 10px; font-weight: 600; opacity: 0.9; }
            .qr { position: absolute; bottom: 20px; right: 20px; background: white; padding: 5px; border-radius: 8px; width: 50px; height: 50px; }
            .qr img { width: 100%; height: 100%; }
            .footer { position: absolute; bottom: 20px; left: 20px; font-size: 8px; font-weight: 700; opacity: 0.7; letter-spacing: 1px; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="header">
              <div class="logo">SG</div>
              <div class="school-name">SYIAR GEMILANG ERP</div>
            </div>
            <div class="content">
              <div class="photo">${student.full_name.charAt(0)}</div>
              <div class="details">
                <h2>${student.full_name}</h2>
                <p>NIS: ${student.nis}</p>
                <p>Jurusan: ${student.major?.name || '-'}</p>
                <p>Angkatan: ${student.batch?.name || '-'}</p>
                <p>Status: AKTIF</p>
              </div>
            </div>
            <div class="footer">KARTU PELAJAR DIGITAL</div>
            <div class="qr"><img src="${student.qr_code}" /></div>
          </div>
          <script>window.print(); setTimeout(() => window.close(), 500);</script>
        </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-3xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" />
            Detail Siswa
          </h3>
          <div className="flex items-center gap-2">
             <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary/20 transition-all">
              <Printer className="w-4 h-4" />
              Cetak Kartu
            </button>
            <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        <div className="p-8 overflow-y-auto flex-1 space-y-8 text-sm">
          {/* Header Info */}
          <div className="flex items-start gap-6 pb-6 border-b border-outline-variant/50">
            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl shadow-inner">
              {student.full_name?.charAt(0)}
            </div>
            <div className="space-y-1">
              <h4 className="text-2xl font-bold text-on-surface">{student.full_name}</h4>
              <p className="text-on-surface-variant font-bold flex items-center gap-2">
                <Hash className="w-4 h-4" />
                NIS: {student.nis} / NIK: {student.nik}
              </p>
              <span className={cn(
                "inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border mt-2",
                student.status === 'active' ? "bg-secondary-container/20 text-secondary border-secondary/20" : "bg-outline-variant/20 text-on-surface-variant"
              )}>
                {student.status}
              </span>
            </div>
            <div className="ml-auto">
              {student.qr_code && (
                <div className="bg-white p-2 border border-outline-variant rounded-xl shadow-sm">
                  <img src={student.qr_code} alt="QR Code" className="w-20 h-20" />
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Personal Data */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">Data Pribadi</h5>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-on-surface-variant font-medium">
                   <User className="w-4 h-4 text-outline" />
                   <span>{student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-medium">
                  <Calendar className="w-4 h-4 text-outline" />
                  <span>{student.birth_place}, {new Date(student.birth_date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-medium">
                  <Mail className="w-4 h-4 text-outline" />
                  <span>{student.email}</span>
                </div>
                <div className="flex items-center gap-3 text-on-surface-variant font-medium">
                  <Phone className="w-4 h-4 text-outline" />
                  <span>{student.phone}</span>
                </div>
                <div className="flex items-start gap-3 text-on-surface-variant font-medium leading-relaxed">
                  <MapPin className="w-4 h-4 text-outline mt-0.5" />
                  <span>{student.address}</span>
                </div>
              </div>
            </div>

            {/* Academic Info */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-4">Informasi Akademik</h5>
              <div className="bg-surface-container rounded-2xl p-5 space-y-4 border border-outline-variant/30 shadow-inner">
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-outline font-bold text-[10px] uppercase tracking-widest">Kelas</span>
                  <span className="text-on-surface font-bold">{student.class?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center border-b border-outline-variant/20 pb-2">
                  <span className="text-outline font-bold text-[10px] uppercase tracking-widest">Jurusan</span>
                  <span className="text-on-surface font-bold">{student.major?.name || '-'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-outline font-bold text-[10px] uppercase tracking-widest">Angkatan</span>
                  <span className="text-on-surface font-bold">{student.batch?.name || '-'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Parents Info */}
          {student.parents && student.parents.length > 0 && (
            <div className="pt-6 border-t border-outline-variant/50">
              <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Informasi Orang Tua</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {student.parents.map((parent: any, i: number) => (
                  <div key={i} className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm">
                    <p className="text-on-surface font-bold mb-3 flex items-center gap-2">
                      <User className="w-4 h-4 text-outline" />
                      {parent.father_name} & {parent.mother_name}
                    </p>
                    <div className="space-y-1 text-xs text-on-surface-variant font-medium opacity-80">
                      <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5" /> {parent.phone}</p>
                      <p className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 mt-0.5" /> {parent.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History */}
          {student.histories && student.histories.length > 0 && (
            <div className="pt-6 border-t border-outline-variant/50 pb-4">
              <h5 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6">Riwayat Status</h5>
              <div className="space-y-4">
                {student.histories.map((h: any, i: number) => (
                  <div key={i} className="flex gap-4 items-start relative">
                    {i !== student.histories.length - 1 && <div className="absolute left-2.5 top-6 bottom-0 w-0.5 bg-outline-variant/30" />}
                    <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 relative z-10">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface uppercase tracking-wider">{h.type}</p>
                      <p className="text-xs font-medium text-on-surface-variant mt-0.5">{h.description}</p>
                      <p className="text-[10px] font-bold text-outline mt-1">{new Date(h.date).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
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

// --- Edit Student Modal ---
export const EditStudentModal = ({ student, isOpen, onClose, onSuccess, majors, batches, classes }: any) => {
  const [formData, setFormData] = useState<any>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (student) {
      setFormData({
        nis: student.nis,
        nik: student.nik,
        full_name: student.full_name,
        gender: student.gender,
        birth_place: student.birth_place,
        birth_date: student.birth_date ? new Date(student.birth_date).toISOString().split('T')[0] : '',
        address: student.address,
        phone: student.phone,
        email: student.email,
        major_id: student.major_id,
        batch_id: student.batch_id,
        class_id: student.class_id,
        status: student.status,
        parents: student.parents?.[0] ? {
          father_name: student.parents[0].father_name,
          mother_name: student.parents[0].mother_name,
          phone: student.parents[0].phone,
          address: student.parents[0].address
        } : {
          father_name: '',
          mother_name: '',
          phone: '',
          address: ''
        }
      });
    }
  }, [student]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest(`/students/${student.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          ...formData,
          birth_date: new Date(formData.birth_date).toISOString()
        })
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('Gagal mengupdate siswa: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center bg-surface">
          <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
            <Edit className="w-5 h-5 text-primary" />
            Edit Data Siswa
          </h3>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto flex-1">
          <form id="editStudentForm" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIS</label>
                <input type="text" required value={formData.nis || ''} onChange={e => setFormData({...formData, nis: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">NIK</label>
                <input type="text" required value={formData.nik || ''} onChange={e => setFormData({...formData, nik: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Lengkap</label>
              <input type="text" required value={formData.full_name || ''} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jenis Kelamin</label>
                <select required value={formData.gender || ''} onChange={e => setFormData({...formData, gender: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kelas</label>
                <select required value={formData.class_id || ''} onChange={e => setFormData({...formData, class_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                  {classes?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tempat Lahir</label>
                <input type="text" required value={formData.birth_place || ''} onChange={e => setFormData({...formData, birth_place: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tanggal Lahir</label>
                <input type="date" required value={formData.birth_date || ''} onChange={e => setFormData({...formData, birth_date: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Email</label>
                <input type="email" required value={formData.email || ''} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telepon</label>
                <input type="text" required value={formData.phone || ''} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jurusan</label>
                <select required value={formData.major_id || ''} onChange={e => setFormData({...formData, major_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                  {majors?.map((m: any) => <option key={m.id} value={m.id}>{m.name} ({m.code})</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Angkatan</label>
                <select required value={formData.batch_id || ''} onChange={e => setFormData({...formData, batch_id: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                  {batches?.map((b: any) => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Status</label>
                <select required value={formData.status || ''} onChange={e => setFormData({...formData, status: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer">
                  <option value="active">Aktif</option>
                  <option value="alumni">Alumni</option>
                  <option value="moved">Pindah</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Alamat</label>
              <textarea required value={formData.address || ''} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all h-20 resize-none"></textarea>
            </div>

            <div className="pt-4 border-t border-outline-variant">
              <h4 className="text-sm font-bold text-primary uppercase tracking-wider mb-4">Data Orang Tua</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Ayah</label>
                  <input type="text" required value={formData.parents?.father_name || ''} onChange={e => setFormData({...formData, parents: { ...formData.parents, father_name: e.target.value }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Nama Ibu</label>
                  <input type="text" required value={formData.parents?.mother_name || ''} onChange={e => setFormData({...formData, parents: { ...formData.parents, mother_name: e.target.value }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
              </div>
              <div className="space-y-1 mt-4">
                <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Telepon Orang Tua</label>
                <input type="text" required value={formData.parents?.phone || ''} onChange={e => setFormData({...formData, parents: { ...formData.parents, phone: e.target.value, address: formData.address }})} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
            </div>
          </form>
        </div>

        <div className="px-6 py-4 border-t border-outline-variant bg-surface flex justify-end gap-3">
          <button type="button" onClick={onClose} className="px-6 py-2.5 rounded-xl border border-outline text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-all">Batal</button>
          <button type="submit" form="editStudentForm" disabled={isSubmitting} className="flex items-center gap-2 px-8 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95">
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Delete Confirm Modal ---
export const DeleteStudentModal = ({ student, isOpen, onClose, onSuccess }: any) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !student) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await apiRequest(`/students/${student.id}`, { method: 'DELETE' });
      onSuccess();
      onClose();
    } catch (err: any) {
      alert('Gagal menghapus siswa: ' + err.message);
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
          <h3 className="text-xl font-bold text-on-surface tracking-tight">Hapus Data Siswa?</h3>
          <p className="text-on-surface-variant font-medium leading-relaxed">
            Anda akan menghapus data <span className="text-on-surface font-bold">"{student.full_name}"</span>. Tindakan ini tidak dapat dibatalkan.
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
            Hapus Siswa
          </button>
        </div>
      </div>
    </div>
  );
};
