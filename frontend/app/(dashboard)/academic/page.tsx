'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';

const AcademicPage = () => {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchedules = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/schedules');
      setSchedules(Array.isArray(response) ? response : []);
    } catch (err: any) {
      setError(err.message || 'Gagal mengambil data jadwal');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchSchedules();
    }
  }, []);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const dayLabels: { [key: string]: string } = {
    'Monday': 'Senin',
    'Tuesday': 'Selasa',
    'Wednesday': 'Rabu',
    'Thursday': 'Kamis',
    'Friday': 'Jumat',
    'Saturday': 'Sabtu',
    'Sunday': 'Minggu'
  };

  return (
    <div className="space-y-lg">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-lg gap-4">
        <div>
          <h2 className="font-h2 text-h2 text-on-background">Manajemen Akademik</h2>
          <p className="text-on-surface-variant mt-1 font-body-sm text-body-sm">Kelola kurikulum, mata pelajaran, dan jadwal pelajaran.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">calendar_month</span>
            Kalender Akademik
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-outline text-on-surface font-label-md text-label-md hover:bg-surface-container transition-colors">
            <span className="material-symbols-outlined text-[20px]">book</span>
            Mata Pelajaran
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary-container text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity shadow-sm">
            <span className="material-symbols-outlined text-[20px]">add</span>
            Tambah Jadwal
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-surface border border-outline-variant rounded-xl p-md mb-lg shadow-[0_4px_20px_rgba(30,64,175,0.05)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Hari</label>
            <select className="border border-outline-variant rounded-lg px-3 py-2.5 bg-surface text-body-sm text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all appearance-none cursor-pointer">
              <option value="">Semua Hari</option>
              {days.map(day => <option key={day} value={day}>{dayLabels[day]}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Kelas</label>
            <select className="border border-outline-variant rounded-lg px-3 py-2.5 bg-surface text-body-sm text-on-surface outline-none focus:border-primary-container focus:ring-2 focus:ring-primary-container/20 transition-all appearance-none cursor-pointer">
              <option value="">Semua Kelas</option>
              <option value="x">X (Sepuluh)</option>
              <option value="xi">XI (Sebelas)</option>
              <option value="xii">XII (Dua Belas)</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-label-sm text-label-sm text-on-surface-variant">Pencarian</label>
            <div className="flex items-center border border-outline-variant rounded-lg px-3 py-2 bg-surface focus-within:border-primary-container focus-within:ring-2 focus-within:ring-primary-container/20 transition-all">
              <span className="material-symbols-outlined text-outline text-[20px] mr-2">search</span>
              <input className="w-full outline-none bg-transparent text-body-sm text-on-surface placeholder:text-outline-variant" placeholder="Cari mata pelajaran atau guru..." type="text"/>
            </div>
          </div>
        </div>
      </div>

      {/* Data Table Card */}
      <div className="bg-surface border border-outline-variant rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] overflow-hidden">
        <div className="p-md border-b border-outline-variant bg-surface-bright flex justify-between items-center">
          <h3 className="font-label-md text-label-md text-on-surface">Jadwal Pelajaran Mingguan</h3>
          <span className="text-body-sm text-on-surface-variant">Semester Ganjil 2023/2024</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Hari</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Waktu</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Mata Pelajaran</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Kelas</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase">Guru Pengajar</th>
                <th className="py-4 px-6 font-label-sm text-label-sm text-on-surface-variant tracking-wider uppercase text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-body-sm text-on-surface">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-on-surface-variant font-label-md">
                    Memuat jadwal...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-error font-label-md">
                    {error}
                  </td>
                </tr>
              ) : schedules.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-on-surface-variant font-label-md">
                    Tidak ada jadwal ditemukan.
                  </td>
                </tr>
              ) : (
                schedules.map((schedule) => (
                  <tr key={schedule.id} className="border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors group">
                    <td className="py-3 px-6">
                      <span className="font-bold text-primary uppercase text-[12px]">{dayLabels[schedule.day] || schedule.day}</span>
                    </td>
                    <td className="py-3 px-6 text-on-surface">
                      <div className="flex items-center gap-1 font-medium">
                        <span className="material-symbols-outlined text-[16px] text-outline">schedule</span>
                        {schedule.start_time} - {schedule.end_time}
                      </div>
                    </td>
                    <td className="py-3 px-6">
                      <p className="font-medium text-on-surface">{schedule.subject?.name}</p>
                    </td>
                    <td className="py-3 px-6 text-on-surface-variant">
                      <span className="px-2 py-0.5 bg-surface-container border border-outline-variant rounded text-[12px] font-bold">
                        {schedule.class?.name}
                      </span>
                    </td>
                    <td className="py-3 px-6">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold uppercase">
                          {schedule.teacher?.full_name?.charAt(0)}
                        </div>
                        <span className="text-on-surface-variant">{schedule.teacher?.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-md transition-colors">
                          <span className="material-symbols-outlined text-[20px]">edit</span>
                        </button>
                        <button className="p-1.5 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-md transition-colors">
                          <span className="material-symbols-outlined text-[20px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Informational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-gutter">
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-start gap-4">
          <div className="p-2 bg-secondary/10 text-secondary rounded-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>fact_check</span>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface">Presensi Pelajaran</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Gunakan modul absensi untuk mencatat kehadiran siswa pada setiap sesi mata pelajaran secara real-time.</p>
            <button className="mt-3 text-primary font-label-sm text-label-sm hover:underline">Buka Absensi &rarr;</button>
          </div>
        </div>
        <div className="bg-surface-container-low border border-outline-variant rounded-xl p-md flex items-start gap-4">
          <div className="p-2 bg-primary/10 text-primary rounded-lg">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>edit_note</span>
          </div>
          <div>
            <h4 className="font-label-md text-label-md text-on-surface">Jurnal Mengajar</h4>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Guru wajib mengisi jurnal mengajar (teaching log) setelah menyelesaikan setiap sesi pelajaran.</p>
            <button className="mt-3 text-primary font-label-sm text-label-sm hover:underline">Lihat Jurnal &rarr;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AcademicPage;
