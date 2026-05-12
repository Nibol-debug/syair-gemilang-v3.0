'use client';

import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  User, 
  Mail, 
  Phone, 
  School, 
  Calendar, 
  MapPin,
  FileText,
  Loader2,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

export const ViewApplicantModal = ({ applicant, isOpen, onClose, onUpdate }: any) => {
  const [isUpdating, setIsUpdating] = useState(false);

  if (!isOpen || !applicant) return null;

  const updateStatus = async (status: string) => {
    setIsUpdating(true);
    try {
      await apiRequest(`/applicants/${applicant.id}/verify`, {
        method: 'PATCH',
        body: JSON.stringify({ status })
      });
      onUpdate();
      onClose();
    } catch (err: any) {
      alert('Gagal mengupdate status: ' + err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-surface-container-lowest w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface">
          <div>
            <h3 className="text-xl font-black text-on-surface tracking-tight">Detail Calon Siswa</h3>
            <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">ID: {applicant.id.split('-')[0]}</p>
          </div>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
          {/* Status Badge */}
          <div className="flex justify-center">
            <span className={cn(
              "px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border-2",
              applicant.status === 'pending' ? "bg-amber-100 text-amber-700 border-amber-200" :
              applicant.status === 'verified' ? "bg-blue-100 text-blue-700 border-blue-200" :
              applicant.status === 'accepted' ? "bg-green-100 text-green-700 border-green-200" :
              "bg-red-100 text-red-700 border-red-200"
            )}>
              {applicant.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/20 pb-2">Informasi Biodata</h4>
               <InfoRow icon={<User />} label="Nama Lengkap" value={applicant.full_name} />
               <InfoRow icon={<Mail />} label="Email" value={applicant.email} />
               <InfoRow icon={<Phone />} label="Telepon" value={applicant.phone} />
               <InfoRow icon={<Calendar />} label="TTL" value={`${applicant.birth_place}, ${new Date(applicant.birth_date).toLocaleDateString()}`} />
            </div>
            <div className="space-y-6">
               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/20 pb-2">Pendidikan & Lokasi</h4>
               <InfoRow icon={<School />} label="Asal Sekolah" value={applicant.previous_school} />
               <InfoRow icon={<Award />} label="Pilihan Jurusan & Cabang" value={applicant.major?.name} />
               <InfoRow icon={<MapPin />} label="Alamat" value={applicant.address} />
            </div>
          </div>

          {/* Documents Section */}
          <div className="space-y-4 pt-4">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] border-b border-primary/20 pb-2">Dokumen Terlampir</h4>
            <div className="bg-surface-container rounded-2xl p-6 flex items-center justify-between border border-outline-variant group hover:border-primary/50 transition-all">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl text-primary shadow-sm">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-black text-on-surface">Scan Ijazah / SKL</p>
                    <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Format: PDF/JPG</p>
                  </div>
               </div>
               {applicant.document_url ? (
                 <a 
                   href={`http://localhost:3001${applicant.document_url}`}
                   target="_blank"
                   rel="noreferrer"
                   className="px-4 py-2 bg-primary text-on-primary text-xs font-black rounded-lg hover:opacity-90 transition-all"
                 >
                   Lihat Dokumen
                 </a>
               ) : (
                 <span className="px-4 py-2 bg-outline-variant/30 text-on-surface-variant text-xs font-black rounded-lg">Belum Upload</span>
               )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 py-6 border-t border-outline-variant bg-surface-container-low flex justify-between gap-4">
          <button 
            onClick={() => updateStatus('rejected')}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-error/20 text-error font-black text-sm hover:bg-error/5 transition-all"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <XCircle className="w-5 h-5" />}
            Tolak Berkas
          </button>
          <button 
            onClick={() => updateStatus('verified')}
            disabled={isUpdating}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-black text-sm hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95"
          >
            {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
            Verifikasi & Terima
          </button>
        </div>
      </div>
    </div>
  );
};

function InfoRow({ icon, label, value }: any) {
  return (
    <div className="flex gap-4 items-start">
      <div className="mt-1 text-outline">{React.cloneElement(icon, { size: 16 })}</div>
      <div>
        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">{label}</p>
        <p className="text-sm font-black text-on-surface">{value || '-'}</p>
      </div>
    </div>
  );
}
