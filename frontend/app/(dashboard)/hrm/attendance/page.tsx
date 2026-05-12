'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  ArrowLeft, 
  Calendar, 
  Save, 
  Loader2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Search
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function EmployeeAttendancePage() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [search, setSearch] = useState('');

  const fetchAttendance = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await apiRequest(`/employee-attendance/daily?date=${date}`);
      setEmployees(data);
    } catch (err) {
      console.error('Failed to fetch attendance:', err);
    } finally {
      setIsLoading(false);
    }
  }, [date]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const handleStatusChange = (employeeId: string, status: string) => {
    setEmployees(prev => prev.map(emp => 
      emp.id === employeeId ? { ...emp, status } : emp
    ));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        date,
        attendances: employees.map(emp => ({
          employee_id: emp.id,
          status: emp.status
        })).filter(r => r.status)
      };

      await apiRequest('/employee-attendance/bulk', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      alert('Presensi berhasil disimpan!');
    } catch (err: any) {
      alert('Gagal menyimpan presensi: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredEmployees = employees.filter(emp => 
    emp.full_name.toLowerCase().includes(search.toLowerCase()) ||
    emp.position.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <Link href="/hrm" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline mb-2">
            <ArrowLeft className="w-3 h-3" />
            Kembali ke HRM
          </Link>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Presensi Pegawai</h2>
          <p className="text-on-surface-variant font-medium">Pencatatan kehadiran guru dan staf harian.</p>
        </div>
        
        <div className="flex items-center gap-4 bg-surface-container-lowest border border-outline-variant rounded-2xl p-2 px-4 shadow-sm">
           <Calendar className="w-5 h-5 text-primary" />
           <input 
             type="date" 
             value={date} 
             onChange={(e) => setDate(e.target.value)}
             className="bg-transparent border-none outline-none font-bold text-on-surface cursor-pointer"
           />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="md:col-span-3">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
               <div className="p-6 border-b border-outline-variant bg-surface flex justify-between items-center gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-outline" />
                    <input 
                      type="text" 
                      placeholder="Cari nama atau jabatan..." 
                      className="w-full pl-12 pr-4 py-2.5 bg-surface-container border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                     <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-success" /> Hadir</span>
                     <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-warning" /> Izin/Sakit</span>
                     <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-error" /> Alpa</span>
                  </div>
               </div>

               <div className="overflow-x-auto">
                 <table className="w-full text-left border-collapse">
                   <thead>
                     <tr className="bg-surface-container-low border-b border-outline-variant">
                       <th className="py-4 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest">Pegawai</th>
                       <th className="py-4 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-widest text-center">Status Presensi</th>
                     </tr>
                   </thead>
                   <tbody className="text-sm">
                     {isLoading ? (
                       <tr>
                         <td colSpan={2} className="py-20 text-center">
                           <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto" />
                           <p className="mt-4 font-bold text-on-surface-variant uppercase tracking-widest text-xs">Memuat daftar pegawai...</p>
                         </td>
                       </tr>
                     ) : filteredEmployees.length === 0 ? (
                       <tr>
                         <td colSpan={2} className="py-20 text-center text-on-surface-variant font-bold">Tidak ada data pegawai yang ditemukan.</td>
                       </tr>
                     ) : (
                       filteredEmployees.map((emp) => (
                         <tr key={emp.id} className="border-b border-surface-container-low hover:bg-surface-container/20 transition-colors">
                           <td className="py-4 px-8">
                             <div className="flex items-center gap-4">
                               <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black text-sm">
                                 {emp.full_name.charAt(0)}
                               </div>
                               <div>
                                 <p className="font-bold text-on-surface">{emp.full_name}</p>
                                 <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{emp.position} • {emp.major}</p>
                               </div>
                             </div>
                           </td>
                           <td className="py-4 px-8">
                              <div className="flex items-center justify-center gap-2">
                                 <AttendanceButton 
                                   label="Hadir" 
                                   active={emp.status === 'present'} 
                                   onClick={() => handleStatusChange(emp.id, 'present')}
                                   color="success"
                                   icon={<CheckCircle2 className="w-4 h-4" />}
                                 />
                                 <AttendanceButton 
                                   label="Izin" 
                                   active={emp.status === 'permission'} 
                                   onClick={() => handleStatusChange(emp.id, 'permission')}
                                   color="warning"
                                   icon={<Clock className="w-4 h-4" />}
                                 />
                                 <AttendanceButton 
                                   label="Sakit" 
                                   active={emp.status === 'sick'} 
                                   onClick={() => handleStatusChange(emp.id, 'sick')}
                                   color="warning"
                                   icon={<AlertCircle className="w-4 h-4" />}
                                 />
                                 <AttendanceButton 
                                   label="Alpa" 
                                   active={emp.status === 'absent'} 
                                   onClick={() => handleStatusChange(emp.id, 'absent')}
                                   color="error"
                                   icon={<XCircle className="w-4 h-4" />}
                                 />
                              </div>
                           </td>
                         </tr>
                       ))
                     )}
                   </tbody>
                 </table>
               </div>
            </div>
         </div>

         <aside className="space-y-6">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 shadow-sm space-y-6">
               <h3 className="text-xs font-black text-on-surface uppercase tracking-widest">Ringkasan Hari Ini</h3>
               <div className="space-y-4">
                  <SummaryItem label="Total Pegawai" value={employees.length} />
                  <SummaryItem label="Sudah Diabsen" value={employees.filter(e => e.status).length} color="primary" />
                  <SummaryItem label="Belum Diabsen" value={employees.filter(e => !e.status).length} color="error" />
               </div>
               
               <button 
                 onClick={handleSave}
                 disabled={isSaving || employees.length === 0}
                 className="w-full bg-primary text-on-primary py-4 rounded-xl font-bold text-sm uppercase tracking-widest hover:opacity-95 transition-all active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
               >
                 {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                 Simpan Presensi
               </button>
            </div>

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
               <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Tips</h4>
               <p className="text-xs font-medium text-primary/80 leading-relaxed">
                 Data presensi akan digunakan sebagai dasar rekapitulasi kinerja bulanan dan perhitungan honorarium jika berlaku.
               </p>
            </div>
         </aside>
      </div>
    </div>
  );
}

function AttendanceButton({ label, active, onClick, color, icon }: any) {
  const colors: any = {
    success: active ? "bg-success text-on-success border-success" : "text-success border-success/30 hover:bg-success/5",
    warning: active ? "bg-warning text-on-warning border-warning" : "text-warning border-warning/30 hover:bg-warning/5",
    error: active ? "bg-error text-on-error border-error" : "text-error border-error/30 hover:bg-error/5",
  };

  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all",
        colors[color]
      )}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

function SummaryItem({ label, value, color = "outline" }: any) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-outline-variant/30 last:border-0">
      <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">{label}</span>
      <span className={cn(
        "text-sm font-black",
        color === 'primary' ? "text-primary" : color === 'error' ? "text-error" : "text-on-surface"
      )}>{value}</span>
    </div>
  );
}
