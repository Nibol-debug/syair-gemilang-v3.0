'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Loader2,
  AlertCircle,
  X,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function PayrollsPage() {
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchPayrolls = async () => {
    setIsLoading(true);
    try {
      const res = await apiRequest(`/payrolls?month=${month}&year=${year}&limit=100`);
      setPayrolls(res.data || []);
    } catch (err: any) {
      console.error('Gagal mengambil data payroll:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [month, year]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError('');
    setSuccess('');

    try {
      await apiRequest(`/payrolls/generate?month=${month}&year=${year}`, { method: 'POST' });
      setSuccess('Payroll berhasil digenerate');
      fetchPayrolls();
    } catch (err: any) {
      setError(err.message || 'Gagal generate payroll');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePay = async (id: string) => {
    try {
      await apiRequest(`/payrolls/${id}/pay`, { method: 'PATCH' });
      setSuccess('Status pembayaran berhasil diubah');
      fetchPayrolls();
    } catch (err: any) {
      setError(err.message || 'Gagal mengubah status');
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const getMonthName = (m: number) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[m - 1] || '';
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight">Manajemen Payroll</h2>
          <p className="text-on-surface-variant font-medium mt-1">Kelola penggajian pegawai.</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-error-container/30 border border-error/20 text-error">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{error}</span>
          <button onClick={() => setError('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {success && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-success-container/30 border border-success/20 text-success">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span className="text-sm font-medium">{success}</span>
          <button onClick={() => setSuccess('')} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-8 shadow-sm">
        <div className="flex flex-col md:flex-row gap-6 items-end">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Bulan</label>
            <select 
              className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'][i]}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Tahun</label>
            <select 
              className="border border-outline-variant rounded-xl px-4 py-2.5 bg-surface-container text-sm text-on-surface font-medium outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer"
              value={year}
              onChange={(e) => setYear(parseInt(e.target.value))}
            >
              {[2024, 2025, 2026, 2027].map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button 
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-on-primary text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            <span>Auto-Generate Payroll</span>
          </button>
        </div>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Pegawai</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Gaji Pokok</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Tunjangan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Potongan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Gaji Bersih</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em] text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-on-surface-variant font-medium">
                    Belum ada data payroll untuk periode ini. Klik "Auto-Generate Payroll" untuk membuat data.
                  </td>
                </tr>
              ) : (
                payrolls.map((payroll) => (
                  <tr key={payroll.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm uppercase">
                          {payroll.employee?.full_name?.charAt(0)}
                        </div>
                        <span className="font-bold text-on-surface">{payroll.employee?.full_name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-8 text-on-surface font-medium">{formatCurrency(payroll.basic_salary)}</td>
                    <td className="py-4 px-8 text-success font-medium">+{formatCurrency(payroll.allowances)}</td>
                    <td className="py-4 px-8 text-error font-medium">-{formatCurrency(payroll.deductions)}</td>
                    <td className="py-4 px-8">
                      <span className="font-black text-on-surface text-base">{formatCurrency(payroll.net_salary)}</span>
                    </td>
                    <td className="py-4 px-8">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        payroll.status === 'paid'
                          ? "bg-success-container/30 text-success"
                          : "bg-warning-container/30 text-warning"
                      )}>
                        {payroll.status === 'paid' ? 'Dibayar' : 'Pending'}
                      </span>
                    </td>
                    <td className="py-4 px-8 text-right">
                      {payroll.status === 'pending' && (
                        <button
                          onClick={() => handlePay(payroll.id)}
                          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-success-container/30 text-success text-xs font-bold hover:bg-success-container/50 transition-colors ml-auto"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Tandai Dibayar</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
