'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2, X, Loader2, Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

const EVENT_TYPES: Record<string, { label: string; color: string; dot: string }> = {
  ujian: { label: 'Ujian', color: 'bg-red-100 text-red-700 border-red-200', dot: 'bg-red-500' },
  libur: { label: 'Libur', color: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  kegiatan: { label: 'Kegiatan', color: 'bg-blue-100 text-blue-700 border-blue-200', dot: 'bg-blue-500' },
  rapat: { label: 'Rapat', color: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  other: { label: 'Lainnya', color: 'bg-gray-100 text-gray-700 border-gray-200', dot: 'bg-gray-500' },
};

const MONTH_NAMES = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
const DAY_NAMES = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

export default function CalendarTab() {
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [modalOpen, setModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ title: '', date: '', type: 'kegiatan' });

  const fetchEvents = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest('/academic-calendar');
      setEvents(Array.isArray(res) ? res : []);
    } catch (err) { console.error(err); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchEvents(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await apiRequest('/academic-calendar', {
        method: 'POST',
        body: JSON.stringify({ ...formData, date: new Date(formData.date).toISOString() })
      });
      setModalOpen(false);
      setFormData({ title: '', date: '', type: 'kegiatan' });
      fetchEvents();
    } catch (err: any) { alert('Gagal: ' + err.message); }
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus event ini?')) return;
    try { await apiRequest(`/academic-calendar/${id}`, { method: 'DELETE' }); fetchEvents(); }
    catch (err: any) { alert('Gagal: ' + err.message); }
  };

  // Calendar logic
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let i = 1; i <= daysInMonth; i++) calendarDays.push(i);

  const getEventsForDay = (day: number) => {
    return events.filter(e => {
      const d = new Date(e.date);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  // Upcoming events (next 30 days)
  const upcoming = events
    .filter(e => {
      const d = new Date(e.date);
      const diff = (d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 0 && diff <= 60;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-xl font-bold text-on-surface">Kalender Akademik</h3>
          <p className="text-sm text-on-surface-variant mt-1">Jadwal ujian, libur, dan kegiatan sekolah.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 shadow-lg shadow-primary/20 active:scale-95 transition-all">
          <Plus className="w-4 h-4" /> Tambah Event
        </button>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3">
        {Object.entries(EVENT_TYPES).map(([key, cfg]) => (
          <div key={key} className="flex items-center gap-1.5">
            <div className={cn("w-2.5 h-2.5 rounded-full", cfg.dot)} />
            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">{cfg.label}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-outline-variant flex items-center justify-between bg-surface">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface-container transition-colors"><ChevronLeft className="w-5 h-5" /></button>
            <h4 className="text-lg font-black text-on-surface">{MONTH_NAMES[month]} {year}</h4>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface-container transition-colors"><ChevronRight className="w-5 h-5" /></button>
          </div>
          <div className="p-4">
            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {DAY_NAMES.map(d => (
                <div key={d} className="text-center text-[10px] font-bold text-on-surface-variant uppercase tracking-widest py-2">{d}</div>
              ))}
            </div>
            {/* Calendar cells */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, idx) => {
                if (day === null) return <div key={`empty-${idx}`} className="aspect-square" />;
                const dayEvents = getEventsForDay(day);
                const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
                return (
                  <div key={day} className={cn(
                    "aspect-square rounded-xl p-1.5 border transition-all relative group",
                    isToday ? 'bg-primary/10 border-primary/30' : 'border-transparent hover:bg-surface-container hover:border-outline-variant/50',
                    dayEvents.length > 0 && 'bg-surface-container-low'
                  )}>
                    <span className={cn("text-xs font-bold", isToday ? 'text-primary' : 'text-on-surface')}>{day}</span>
                    <div className="flex flex-wrap gap-0.5 mt-0.5">
                      {dayEvents.slice(0, 3).map(ev => {
                        const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.other;
                        return <div key={ev.id} className={cn("w-full h-1 rounded-full", cfg.dot)} title={ev.title} />;
                      })}
                    </div>
                    {/* Tooltip */}
                    {dayEvents.length > 0 && (
                      <div className="absolute z-10 left-0 top-full mt-1 bg-inverse-surface text-inverse-on-surface p-2 rounded-lg shadow-lg hidden group-hover:block min-w-[160px]">
                        {dayEvents.map(ev => (
                          <div key={ev.id} className="flex items-center justify-between gap-2 text-[10px] py-0.5">
                            <span className="truncate">{ev.title}</span>
                            <button onClick={() => handleDelete(ev.id)} className="text-red-300 hover:text-red-400 flex-shrink-0"><Trash2 className="w-3 h-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Upcoming Events Sidebar */}
        <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-outline-variant bg-surface">
            <h4 className="font-bold text-sm text-on-surface">Agenda Mendatang</h4>
          </div>
          <div className="p-3 space-y-2 max-h-[500px] overflow-y-auto">
            {isLoading ? (
              <div className="py-8 text-center"><Loader2 className="w-5 h-5 text-primary animate-spin mx-auto" /></div>
            ) : upcoming.length === 0 ? (
              <p className="text-xs text-on-surface-variant text-center py-8">Tidak ada agenda mendatang.</p>
            ) : upcoming.map(ev => {
              const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.other;
              const d = new Date(ev.date);
              return (
                <div key={ev.id} className={cn("p-3 rounded-xl border group relative", cfg.color)}>
                  <div className="flex items-center gap-2 mb-1">
                    <div className={cn("w-2 h-2 rounded-full", cfg.dot)} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">{cfg.label}</span>
                  </div>
                  <p className="text-sm font-bold">{ev.title}</p>
                  <p className="text-[10px] font-medium mt-1 opacity-70">{d.getDate()} {MONTH_NAMES[d.getMonth()]} {d.getFullYear()}</p>
                  <button onClick={() => handleDelete(ev.id)} className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 rounded transition-all hover:bg-black/10"><Trash2 className="w-3 h-3" /></button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-outline-variant flex justify-between items-center bg-surface">
              <h3 className="text-xl font-black text-on-surface tracking-tight">Tambah Event</h3>
              <button onClick={() => setModalOpen(false)} className="p-2 text-on-surface-variant hover:bg-surface-container rounded-xl"><X className="w-6 h-6" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-5">
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Judul Event</label>
                <input type="text" required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Contoh: UTS Semester Ganjil" className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Tanggal</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">Tipe</label>
                  <select required value={formData.type} onChange={e => setFormData({ ...formData, type: e.target.value })} className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-xl text-sm font-semibold outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer">
                    {Object.entries(EVENT_TYPES).map(([key, cfg]) => <option key={key} value={key}>{cfg.label}</option>)}
                  </select>
                </div>
              </div>
              <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center gap-2 px-8 py-3 rounded-xl bg-primary text-on-primary font-black shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all disabled:opacity-50">
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Simpan Event
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
