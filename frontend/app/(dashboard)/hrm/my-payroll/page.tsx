'use client';

import React, { useEffect, useState } from 'react';
import { apiRequest } from '@/lib/api';
import { useUserRole } from '@/lib/useUserRole';
import { 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock,
  Loader2,
  Download
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function MyPayrollPage() {
  const { employeeId } = useUserRole();
  const [payrolls, setPayrolls] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchPayrolls = async () => {
    if (!employeeId) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await apiRequest(`/payrolls?employee_id=${employeeId}&limit=50`);
      setPayrolls(res.data || []);
    } catch (err: any) {
      console.error('Gagal mengambil data payroll:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPayrolls();
  }, [employeeId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  };

  const getMonthName = (month: number) => {
    const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
    return months[month - 1] || '';
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-on-surface tracking-tight">Slip Gaji Digital</h2>
        <p className="text-on-surface-variant font-medium mt-1">Histori dan detail gaji Anda.</p>
      </div>

      <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Periode</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Gaji Pokok</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Tunjangan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Potongan</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Gaji Bersih</th>
                <th className="py-5 px-8 text-[11px] font-bold text-on-surface-variant uppercase tracking-[0.1em]">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center">
                    <Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
                  </td>
                </tr>
              ) : !employeeId ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-error font-medium">
                    Akun Anda tidak terhubung dengan data pegawai. Hubungi administrator.
                  </td>
                </tr>
              ) : payrolls.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-on-surface-variant font-medium">
                    Belum ada data gaji.
                  </td>
                </tr>
              ) : (
                payrolls.map((payroll) => (
                  <tr key={payroll.id} className="border-b border-surface-container-low hover:bg-surface-container/30 transition-colors">
                    <td className="py-4 px-8">
                      <div className="flex items-center gap-2 font-bold text-on-surface">
                        <Calendar className="w-4 h-4 text-outline" />
                        {getMonthName(payroll.month)} {payroll.year}
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
