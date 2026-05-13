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
  Award,
  Eye
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

  const acceptAsStudent = async () => {
    setIsUpdating(true);
    try {
      await apiRequest(`/applicants/${applicant.id}/accept`, {
        method: 'POST'
      });
      onUpdate();
      onClose();
    } catch (err: any) {
      alert('Gagal menerima pendaftar: ' + err.message);
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
               <InfoRow icon={<User />} label="Status / Pendidikan" value={`${applicant.marital_status === 'single' ? 'Single' : 'Menikah'} / ${applicant.education_level}`} />
               <InfoRow icon={<User />} label="Nama Ayah / Ibu" value={`${applicant.father_name || '-'} / ${applicant.mother_name || '-'}`} />
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <DocLink label="Scan Ijazah / SKL" url={applicant.document_url} />
               <DocLink label="KTP" url={applicant.ktp_url} />
               <DocLink label="Kartu Keluarga" url={applicant.kk_url} />
               <DocLink label="SKTM" url={applicant.sktm_url} />
               <DocLink label="Surat Keterangan Sehat" url={applicant.health_cert_url} />
               <DocLink label="Sertifikat Vaksin" url={applicant.vaccine_url} />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-8 py-6 border-t border-outline-variant bg-surface-container-low flex flex-col gap-4">
          <div className="flex gap-4">
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
              disabled={isUpdating || applicant.status !== 'pending'}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-black text-sm hover:opacity-90 shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
              Verifikasi & Terima Berkas
            </button>
          </div>
          
          {(applicant.status === 'verified' || applicant.status === 'accepted') && (
            <button 
              onClick={acceptAsStudent}
              disabled={isUpdating || applicant.status === 'accepted'}
              className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-secondary text-on-secondary font-black text-sm hover:opacity-90 shadow-lg shadow-secondary/20 transition-all active:scale-95 disabled:bg-success disabled:text-on-success disabled:opacity-100"
            >
              {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-5 h-5" />}
              {applicant.status === 'accepted' ? 'Telah Diterima (Menunggu Pembayaran)' : 'Lulus Seleksi & Generate Tagihan Daftar Ulang'}
            </button>
          )}
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

function DocLink({ label, url }: { label: string, url?: string }) {
  return (
    <div className="bg-surface-container rounded-xl p-4 flex items-center justify-between border border-outline-variant group hover:border-primary/50 transition-all">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white rounded-lg text-primary shadow-sm">
          <FileText className="w-4 h-4" />
        </div>
        <p className="text-[10px] font-black text-on-surface uppercase tracking-tight">{label}</p>
      </div>
      {url ? (
        <a 
          href={`http://localhost:3001${url}`}
          target="_blank"
          rel="noreferrer"
          className="p-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-lg transition-all"
        >
          < Eye className="w-4 h-4" />
        </a>
      ) : (
        <span className="text-[10px] font-bold text-outline-variant italic">Kosong</span>
      )}
    </div>
  );
}
