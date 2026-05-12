'use client';

import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  User, 
  MapPin, 
  School, 
  Upload, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

export default function PPDBRegistrationPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    gender: 'male',
    birth_place: '',
    birth_date: '',
    address: '',
    previous_school: '',
    document_url: '',
    major_id: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const fetchMajors = async () => {
    try {
      const response = await apiRequest('/majors?limit=100');
      setMajors(response.data || []);
    } catch (err) {
      console.error('Failed to fetch majors', err);
    }
  };

  useEffect(() => {
    fetchMajors();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const body = new FormData();
    body.append('file', file);

    try {
      const response = await apiRequest('/applicants/upload-document', {
        method: 'POST',
        body
      });
      setFormData(prev => ({ ...prev, document_url: response.url }));
    } catch (err: any) {
      alert('Gagal mengupload file: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.document_url) {
      alert('Harap upload ijazah / berkas terlebih dahulu');
      return;
    }
    if (!formData.major_id) {
      alert('Harap pilih Jurusan & Cabang');
      return;
    }
    setIsLoading(true);
    try {
      await apiRequest('/applicants', {
        method: 'POST',
        body: JSON.stringify(formData)
      });
      setIsSuccess(true);
    } catch (err: any) {
      alert('Gagal mengirim pendaftaran: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-surface-container-lowest flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
          <div className="w-20 h-20 bg-success-container/30 text-success rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-black text-on-surface">Pendaftaran Berhasil!</h2>
          <p className="text-on-surface-variant font-medium">
            Terima kasih telah mendaftar di Syiar Gemilang. Data Anda sedang kami verifikasi. Harap tunggu pengumuman selanjutnya melalui email atau WhatsApp.
          </p>
          <Link href="/" className="block w-full py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 transition-all">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-container-low py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-primary hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Beranda
          </Link>
          <div className="flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            <h1 className="text-xl font-black text-on-surface tracking-tighter">PPDB ONLINE 2026</h1>
          </div>
        </div>

        {/* Stepper */}
        <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-outline-variant">
          <StepItem num={1} label="Biodata" active={step >= 1} current={step === 1} />
          <div className="h-px flex-1 bg-outline-variant mx-4" />
          <StepItem num={2} label="Alamat" active={step >= 2} current={step === 2} />
          <div className="h-px flex-1 bg-outline-variant mx-4" />
          <StepItem num={3} label="Sekolah" active={step >= 3} current={step === 3} />
          <div className="h-px flex-1 bg-outline-variant mx-4" />
          <StepItem num={4} label="Review" active={step >= 4} current={step === 4} />
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl shadow-lg border border-outline-variant p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                  <User className="w-5 h-5 text-primary" />
                  Informasi Pribadi
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup label="Nama Lengkap" value={formData.full_name} onChange={(v: string) => setFormData({...formData, full_name: v})} placeholder="Budi Santoso" />
                  <InputGroup label="Email Aktif" type="email" value={formData.email} onChange={(v: string) => setFormData({...formData, email: v})} placeholder="budi@example.com" />
                  <InputGroup label="No. WhatsApp" value={formData.phone} onChange={(v: string) => setFormData({...formData, phone: v})} placeholder="08123456789" />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Jenis Kelamin</label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={formData.gender === 'male'} onChange={() => setFormData({...formData, gender: 'male'})} className="w-4 h-4 accent-primary" />
                        <span className="text-sm font-semibold">Laki-laki</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" checked={formData.gender === 'female'} onChange={() => setFormData({...formData, gender: 'female'})} className="w-4 h-4 accent-primary" />
                        <span className="text-sm font-semibold">Perempuan</span>
                      </label>
                    </div>
                  </div>
                  <InputGroup label="Tempat Lahir" value={formData.birth_place} onChange={(v: string) => setFormData({...formData, birth_place: v})} placeholder="Jakarta" />
                  <InputGroup label="Tanggal Lahir" type="date" value={formData.birth_date} onChange={(v: string) => setFormData({...formData, birth_date: v})} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  Alamat Tempat Tinggal
                </h2>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Alamat Lengkap</label>
                  <textarea 
                    rows={4} 
                    value={formData.address} 
                    onChange={e => setFormData({...formData, address: e.target.value})} 
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="Jl. Raya No. 123, Desa..."
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                  <School className="w-5 h-5 text-primary" />
                  Pilihan Jurusan & Cabang Kampus
                </h2>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Pilih Jurusan & Lokasi Kampus</label>
                    <select 
                      required
                      value={formData.major_id}
                      onChange={e => setFormData({...formData, major_id: e.target.value})}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="">-- Pilih Jurusan & Lokasi --</option>
                      {majors.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <InputGroup label="Nama Sekolah Asal" value={formData.previous_school} onChange={(v: string) => setFormData({...formData, previous_school: v})} placeholder="SMP Negeri 1 Jakarta" />
                
                <div className={cn(
                  "p-8 border-2 border-dashed rounded-2xl flex flex-col items-center gap-3 transition-all",
                  formData.document_url ? "border-success bg-success-container/10" : "border-outline-variant bg-surface-container-lowest"
                )}>
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  ) : formData.document_url ? (
                    <CheckCircle2 className="w-8 h-8 text-success" />
                  ) : (
                    <Upload className="w-8 h-8 opacity-40" />
                  )}
                  
                  <div className="text-center">
                    <p className="text-sm font-bold">
                      {isUploading ? "Sedang mengunggah..." : 
                       formData.document_url ? "Ijazah Berhasil Diunggah" : 
                       "Upload Ijazah / SKL (PDF/JPG)"}
                    </p>
                    <p className="text-[10px] text-on-surface-variant font-medium mt-1">Maksimal file 2MB</p>
                  </div>

                  <label className={cn(
                    "px-4 py-2 text-xs font-bold rounded-lg cursor-pointer transition-all",
                    formData.document_url 
                      ? "bg-success text-on-success hover:opacity-90" 
                      : "bg-primary text-on-primary hover:opacity-90"
                  )}>
                    {formData.document_url ? "Ganti File" : "Pilih File"}
                    <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileUpload} />
                  </label>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                  Konfirmasi Pendaftaran
                </h2>
                <div className="bg-surface-container rounded-2xl p-6 space-y-4">
                  <ReviewItem label="Nama" value={formData.full_name} />
                  <ReviewItem label="Email" value={formData.email} />
                  <ReviewItem label="Telepon" value={formData.phone} />
                  <ReviewItem label="Jurusan & Cabang" value={majors.find(m => m.id === formData.major_id)?.name} />
                  <ReviewItem label="Asal Sekolah" value={formData.previous_school} />
                </div>
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-xl border border-primary/20">
                  <input type="checkbox" required className="mt-1 accent-primary" />
                  <p className="text-xs font-medium text-on-surface-variant leading-relaxed">
                    Saya menyatakan bahwa data yang saya masukkan adalah benar dan dapat dipertanggungjawabkan. Saya setuju dengan syarat dan ketentuan pendaftaran Syiar Gemilang.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between pt-8 border-t border-outline-variant">
              {step > 1 ? (
                <button type="button" onClick={prevStep} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-outline text-on-surface font-bold transition-all hover:bg-surface-container">
                  <ChevronLeft className="w-5 h-5" />
                  Sebelumnya
                </button>
              ) : <div />}
              
              {step < 4 ? (
                <button type="button" onClick={nextStep} className="flex items-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary font-bold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all">
                  Lanjutkan
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button type="submit" disabled={isLoading} className="flex items-center gap-2 px-10 py-3 rounded-xl bg-secondary text-on-secondary font-bold shadow-lg shadow-secondary/20 hover:opacity-90 active:scale-95 transition-all">
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ClipboardList className="w-5 h-5" />}
                  Kirim Pendaftaran
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function StepItem({ num, label, active, current }: any) {
  return (
    <div className={cn(
      "flex flex-col items-center gap-2 transition-all",
      active ? "text-primary" : "text-outline-variant"
    )}>
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2",
        current ? "bg-primary text-on-primary border-primary scale-110 shadow-lg shadow-primary/20" : 
        active ? "bg-primary/10 border-primary" : "bg-surface border-outline-variant"
      )}>
        {num}
      </div>
      <span className={cn("text-[10px] font-black uppercase tracking-widest", current ? "opacity-100" : "opacity-60")}>{label}</span>
    </div>
  );
}

function InputGroup({ label, value, onChange, type = "text", placeholder }: any) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">{label}</label>
      <input 
        type={type}
        required
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
    </div>
  );
}

function ReviewItem({ label, value }: any) {
  return (
    <div className="flex justify-between border-b border-outline-variant/30 pb-2">
      <span className="text-xs font-bold text-on-surface-variant uppercase">{label}</span>
      <span className="text-sm font-black text-on-surface">{value || '-'}</span>
    </div>
  );
}
