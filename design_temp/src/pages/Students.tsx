import React from 'react';
import { 
  Plus, 
  Upload, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  Edit2, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal
} from 'lucide-react';
import { cn } from '../lib/utils';

const students = [
  { nis: '2023001', name: 'Ahmad Fauzi', class: 'X TKJ 1', major: 'Teknik Komputer & Jaringan', status: 'Aktif', initial: 'A' },
  { nis: '2023045', name: 'Budi Santoso', class: 'X DG 2', major: 'Desain Grafis', status: 'Aktif', initial: 'B' },
  { nis: '2021089', name: 'Citra Lestari', class: 'XII DBS 1', major: 'Desain Bisnis & Sepeda', status: 'Alumni', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&auto=format&fit=crop' },
];

export default function Students() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-on-background tracking-tight">Manajemen Siswa</h2>
          <p className="text-on-surface-variant font-medium mt-1">Kelola data, status, dan informasi akademik siswa.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors active:scale-95 shadow-sm">
            <Upload className="w-4 h-4" />
            <span>Import Excel</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-outline text-on-surface text-sm font-semibold hover:bg-surface-container transition-colors active:scale-95 shadow-sm">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity active:scale-95 shadow-md">
            <Plus className="w-4 h-4" />
            <span>Tambah Siswa</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Pencarian</label>
            <div className="flex items-center border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container focus-within:ring-2 focus-within:ring-primary/20 transition-all">
              <Search className="w-4 h-4 text-outline mr-3" />
              <input type="text" placeholder="Cari NIS atau Nama..." className="bg-transparent outline-none text-sm w-full text-on-surface placeholder:text-outline-variant" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Jurusan</label>
            <select className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option value="">Semua Jurusan</option>
              <option value="tkj">Teknik Komputer & Jaringan</option>
              <option value="dbs">Desain Bisnis & Sepeda</option>
              <option value="dg">Desain Grafis</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Angkatan</label>
            <select className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option value="">Semua Angkatan</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Kelas</label>
            <select className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
              <option value="">Semua Kelas</option>
              <option value="x">Kelas X</option>
              <option value="xi">Kelas XI</option>
              <option value="xii">Kelas XII</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">NIS</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Nama Lengkap</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Kelas</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Jurusan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.map((student, i) => (
                <tr key={i} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors group">
                  <td className="py-4 px-8 font-semibold text-on-surface">{student.nis}</td>
                  <td className="py-4 px-8">
                    <div className="flex items-center gap-3">
                      {student.image ? (
                        <img src={student.image} alt={student.name} className="w-9 h-9 rounded-full object-cover border border-outline-variant" />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                          {student.initial}
                        </div>
                      )}
                      <span className="font-semibold text-on-surface">{student.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-8 text-on-surface font-medium">{student.class}</td>
                  <td className="py-4 px-8 text-on-surface-variant font-medium">{student.major}</td>
                  <td className="py-4 px-8 text-on-surface">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      student.status === 'Aktif' 
                        ? "bg-secondary-container/20 text-secondary" 
                        : "bg-outline-variant/20 text-on-surface-variant"
                    )}>
                      {student.status}
                    </span>
                  </td>
                  <td className="py-4 px-8 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="View">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-primary hover:bg-surface-container rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-on-surface-variant hover:text-error hover:bg-error-container/30 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="p-2 text-on-surface-variant group-hover:hidden transition-all">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex items-center justify-between px-8 py-5 border-t border-outline-variant bg-surface-container-lowest">
          <span className="text-xs font-medium text-on-surface-variant">Menampilkan 1-3 dari 450 siswa</span>
          <div className="flex items-center gap-1">
            <button className="p-2 rounded-lg text-outline hover:bg-surface-container disabled:opacity-50 transition-colors" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-9 h-9 rounded-lg bg-primary text-on-primary font-bold text-xs flex items-center justify-center shadow-md">1</button>
            <button className="w-9 h-9 rounded-lg text-on-surface hover:bg-surface-container font-bold text-xs flex items-center justify-center transition-all">2</button>
            <button className="w-9 h-9 rounded-lg text-on-surface hover:bg-surface-container font-bold text-xs flex items-center justify-center transition-all">3</button>
            <span className="text-on-surface-variant px-2 font-bold select-none">...</span>
            <button className="w-9 h-9 rounded-lg text-on-surface hover:bg-surface-container font-bold text-xs flex items-center justify-center transition-all">45</button>
            <button className="p-2 rounded-lg text-on-surface hover:bg-surface-container transition-colors active:scale-95">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
