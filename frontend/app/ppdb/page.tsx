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
import { MapPicker } from '@/components/MapPicker';

export default function PPDBRegistrationPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [majors, setMajors] = useState<any[]>([]);
  const [branches, setBranches] = useState<any[]>([]);
  const [selectedBranchId, setSelectedBranchId] = useState('');
  
  const [formData, setFormData] = useState({
    full_name: '',
    nik: '',
    email: '',
    phone: '',
    gender: 'male',
    marital_status: 'single',
    education_level: 'SLTA',
    father_name: '',
    mother_name: '',
    birth_place: '',
    birth_date: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    previous_school: '',
    document_url: '', // Ijazah
    ktp_url: '',
    kk_url: '',
    sktm_url: '',
    vaccine_url: '',
    health_cert_url: '',
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

  const fetchBranches = async () => {
    try {
      const response = await apiRequest('/branches');
      // If response is an array, use it directly, otherwise use response.data
      setBranches(Array.isArray(response) ? response : (response.data || []));
    } catch (err) {
      console.error('Failed to fetch branches', err);
    }
  };

  useEffect(() => {
    fetchMajors();
    fetchBranches();
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
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
      setFormData(prev => ({ ...prev, [fieldName]: response.url }));
    } catch (err: any) {
      alert('Gagal mengupload file: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Mandatory documents validation
    const mandatoryDocs = {
      document_url: 'Ijazah',
      ktp_url: 'KTP',
      kk_url: 'Kartu Keluarga',
      sktm_url: 'SKTM',
      health_cert_url: 'Surat Keterangan Sehat'
    };

    for (const [field, label] of Object.entries(mandatoryDocs)) {
      if (!formData[field as keyof typeof formData]) {
        alert(`Harap upload berkas ${label} terlebih dahulu`);
        return;
      }
    }

    if (!formData.major_id) {
      alert('Harap pilih Jurusan & Cabang');
      return;
    }

    // Age validation (17-30)
    const birthDate = new Date(formData.birth_date);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    if (age < 17 || age > 30) {
      alert('Kriteria usia penerima manfaat adalah 17 s/d 30 tahun');
      return;
    }

    if (formData.marital_status !== 'single') {
      alert('Kriteria penerima manfaat adalah Single / Belum Menikah');
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
        <div className="max-w-[28rem] w-full bg-white rounded-3xl shadow-xl p-10 text-center space-y-6">
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

        {/* Criteria Summary */}
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 space-y-3">
          <h3 className="text-sm font-black text-primary uppercase tracking-widest">Kriteria Penerima Manfaat RGI:</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-[11px] font-bold text-on-surface-variant">
            <li className="flex items-center gap-2">• Usia Produktif (17 - 30 Tahun)</li>
            <li className="flex items-center gap-2">• Dari Keluarga Tidak Mampu (Dhuafa)</li>
            <li className="flex items-center gap-2">• Pendidikan Maksimal SLTA/Sederajat</li>
            <li className="flex items-center gap-2">• Single / Belum Menikah</li>
            <li className="flex items-center gap-2">• Bersedia Tinggal di Asrama</li>
            <li className="flex items-center gap-2">• Sehat Jasmani & Rohani</li>
          </ul>
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
                  <InputGroup label="NIK (Nomor Induk Kependudukan)" value={formData.nik} onChange={(v: string) => setFormData({...formData, nik: v})} placeholder="3201..." />
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
                  
                  <InputGroup label="Nama Ayah" value={formData.father_name} onChange={(v: string) => setFormData({...formData, father_name: v})} placeholder="Nama Ayah" />
                  <InputGroup label="Nama Ibu" value={formData.mother_name} onChange={(v: string) => setFormData({...formData, mother_name: v})} placeholder="Nama Ibu" />

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Status Pernikahan</label>
                    <select 
                      value={formData.marital_status}
                      onChange={e => setFormData({...formData, marital_status: e.target.value})}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="single">Single / Belum Menikah</option>
                      <option value="married">Menikah</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Pendidikan Terakhir</label>
                    <select 
                      value={formData.education_level}
                      onChange={e => setFormData({...formData, education_level: e.target.value})}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="SLTA">SLTA / Sederajat (SMA/SMK/MA)</option>
                      <option value="SLTP">SLTP / Sederajat (SMP/MTs)</option>
                      <option value="Diploma">Diploma / Kuliah (Tidak sesuai kriteria)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-xl font-bold text-on-surface flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-primary" />
                  Alamat Tempat Tinggal
                </h2>
                
                <div className="space-y-4">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Cari Lokasi Rumah (Gunakan Peta)</label>
                  <MapPicker 
                    initialPos={formData.latitude ? { lat: formData.latitude, lng: formData.longitude } : { lat: -6.4025, lng: 106.7942 }} 
                    onLocationSelect={(lat: number, lng: number, address: string) => {
                      setFormData(prev => ({
                        ...prev,
                        latitude: lat,
                        longitude: lng,
                        address: address || prev.address
                      }));
                    }}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Alamat Lengkap (Bisa disesuaikan manual)</label>
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
                  Pilihan Cabang & Jurusan Kampus
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Pilih Cabang / Lokasi</label>
                    <select 
                      required
                      value={selectedBranchId}
                      onChange={e => {
                        setSelectedBranchId(e.target.value);
                        setFormData({...formData, major_id: ''}); // Reset major if branch changes
                      }}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
                    >
                      <option value="">-- Pilih Cabang --</option>
                      {branches.map(b => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-1">Pilih Jurusan</label>
                    <select 
                      required
                      disabled={!selectedBranchId}
                      value={formData.major_id}
                      onChange={e => setFormData({...formData, major_id: e.target.value})}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50"
                    >
                      <option value="">-- Pilih Jurusan --</option>
                      {majors
                        .filter(m => m.branch_id === selectedBranchId)
                        .map(m => (
                          <option key={m.id} value={m.id}>{m.name}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <InputGroup label="Nama Sekolah Asal" value={formData.previous_school} onChange={(v: string) => setFormData({...formData, previous_school: v})} placeholder="SMP Negeri 1 Jakarta" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FileUploadGroup 
                    label="Scan Ijazah / SKL" 
                    fieldName="document_url" 
                    value={formData.document_url} 
                    onUpload={handleFileUpload} 
                    isUploading={isUploading} 
                  />
                  <FileUploadGroup 
                    label="Kartu Tanda Penduduk (KTP)" 
                    fieldName="ktp_url" 
                    value={formData.ktp_url} 
                    onUpload={handleFileUpload} 
                    isUploading={isUploading} 
                  />
                  <FileUploadGroup 
                    label="Kartu Keluarga (KK)" 
                    fieldName="kk_url" 
                    value={formData.kk_url} 
                    onUpload={handleFileUpload} 
                    isUploading={isUploading} 
                  />
                  <FileUploadGroup 
                    label="SKTM (Kelurahan/DKM)" 
                    fieldName="sktm_url" 
                    value={formData.sktm_url} 
                    onUpload={handleFileUpload} 
                    isUploading={isUploading} 
                  />
                  <FileUploadGroup 
                    label="Surat Keterangan Sehat" 
                    fieldName="health_cert_url" 
                    value={formData.health_cert_url} 
                    onUpload={handleFileUpload} 
                    isUploading={isUploading} 
                  />
                  <FileUploadGroup 
                    label="Sertifikat Vaksin (Opsional)" 
                    fieldName="vaccine_url" 
                    value={formData.vaccine_url} 
                    onUpload={handleFileUpload} 
                    isUploading={isUploading} 
                  />
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
                  <ReviewItem label="NIK" value={formData.nik} />
                  <ReviewItem label="Status" value={formData.marital_status === 'single' ? 'Belum Menikah' : 'Menikah'} />
                  <ReviewItem label="Pendidikan" value={formData.education_level} />
                  <ReviewItem label="Nama Ayah" value={formData.father_name} />
                  <ReviewItem label="Nama Ibu" value={formData.mother_name} />
                  <ReviewItem label="Email" value={formData.email} />
                  <ReviewItem label="Telepon" value={formData.phone} />
                  <ReviewItem label="Cabang" value={branches.find(b => b.id === selectedBranchId)?.name} />
                  <ReviewItem label="Jurusan" value={majors.find(m => m.id === formData.major_id)?.name} />
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

function FileUploadGroup({ label, fieldName, value, onUpload, isUploading }: any) {
  return (
    <div className={cn(
      "p-4 border-2 border-dashed rounded-2xl flex flex-col items-center gap-2 transition-all",
      value ? "border-success bg-success-container/10" : "border-outline-variant bg-surface-container-lowest"
    )}>
      <div className="text-center">
        <p className="text-[10px] font-black uppercase tracking-tighter text-on-surface-variant">{label}</p>
      </div>
      
      <div className="flex items-center gap-3">
        {value ? (
          <CheckCircle2 className="w-5 h-5 text-success" />
        ) : (
          <Upload className="w-5 h-5 opacity-40" />
        )}
        
        <label className={cn(
          "px-3 py-1.5 text-[10px] font-bold rounded-lg cursor-pointer transition-all",
          value 
            ? "bg-success text-on-success hover:opacity-90" 
            : "bg-primary text-on-primary hover:opacity-90"
        )}>
          {value ? "Ganti" : "Pilih File"}
          <input type="file" className="hidden" accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => onUpload(e, fieldName)} />
        </label>
      </div>
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
