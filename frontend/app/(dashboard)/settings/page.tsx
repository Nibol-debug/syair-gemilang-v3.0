'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  User, Shield, Settings as SettingsIcon, Save, X, Eye, EyeOff, 
  Smartphone, Trash2, Globe, Lock, Power, CheckCircle2, AlertCircle,
  Database
} from 'lucide-react';
import { useUserRole } from '@/lib/useUserRole';
import {
  getProfile,
  updateProfile,
  changePassword,
  getDevices,
  removeDevice,
  getPreferences,
  updateNotificationPreferences,
  updateSystemSettings,
  toggleMaintenanceMode,
  UserProfile,
  Device,
  UserPreferences,
} from '@/lib/settings';

type TabType = 'profile' | 'account' | 'notifications' | 'system';

export default function SettingsPage() {
  const { isAdmin, isTeacher } = useUserRole();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);

  // Notification preferences state
  const [notifSettings, setNotifSettings] = useState({
    notif_academic: true,
    notif_messages: true,
    notif_payments: true,
    notif_email_digest: false,
  });

  // System settings state
  const [systemSettings, setSystemSettings] = useState({
    active_academic_year: '2025/2026',
    active_semester: '1',
    cbt_strict_anticheat: true,
    cbt_show_score_auto: false,
    cbt_random_questions: true,
    cbt_device_locking: true,
    maintenance_mode: false,
  });

  // Profile form state
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    full_name: '',
    gender: '',
    birth_place: '',
    birth_date: '',
    address: '',
  });

  // Password form state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    loadProfile();
    loadDevices();
    loadPreferences();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const data = await getProfile();
      setProfile(data);

      // Populate form data
      setFormData({
        username: data.username || '',
        email: data.student?.email || '',
        phone: data.student?.phone || '',
        full_name: data.student?.full_name || data.employee?.full_name || '',
        gender: data.student?.gender || '',
        birth_place: data.student?.birth_place || '',
        birth_date: data.student?.birth_date ? data.student.birth_date.split('T')[0] : '',
        address: data.student?.address || '',
      });
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal memuat profil' });
    } finally {
      setLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (error) {
      console.error('Failed to load devices:', error);
    }
  };

  const loadPreferences = async () => {
    try {
      const data = await getPreferences();
      setPreferences(data);
      setNotifSettings({
        notif_academic: data.notif_academic,
        notif_messages: data.notif_messages,
        notif_payments: data.notif_payments,
        notif_email_digest: data.notif_email_digest,
      });
      setSystemSettings({
        active_academic_year: data.active_academic_year || '2025/2026',
        active_semester: data.active_semester?.toString() || '1',
        cbt_strict_anticheat: data.cbt_strict_anticheat,
        cbt_show_score_auto: data.cbt_show_score_auto,
        cbt_random_questions: data.cbt_random_questions,
        cbt_device_locking: data.cbt_device_locking,
        maintenance_mode: data.maintenance_mode,
      });
    } catch (error) {
      console.error('Failed to load preferences:', error);
    }
  };

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      const updateData: any = {
        username: formData.username,
      };

      if (profile?.student) {
        updateData.student = {
          email: formData.email,
          phone: formData.phone,
          full_name: formData.full_name,
          gender: formData.gender,
          birth_place: formData.birth_place,
          birth_date: formData.birth_date,
          address: formData.address,
        };
      } else if (profile?.employee) {
        updateData.employee = {
          full_name: formData.full_name,
        };
      }

      await updateProfile(updateData);
      setMessage({ type: 'success', text: 'Profil berhasil diperbarui' });
      setTimeout(() => setMessage(null), 3000);
      loadProfile(); // Reload to get fresh data
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal memperbarui profil: ' + (error.message || 'Error tidak dikenal') });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Kata sandi minimal 6 karakter' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setSaving(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Kata sandi berhasil diubah' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Gagal mengubah kata sandi' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Hapus perangkat ini? Anda akan keluar dari perangkat tersebut.')) return;
    
    try {
      await removeDevice(deviceId);
      loadDevices();
      setMessage({ type: 'success', text: 'Perangkat berhasil dihapus' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Gagal menghapus perangkat' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveNotifications = async () => {
    try {
      setSaving(true);
      await updateNotificationPreferences(notifSettings);
      setMessage({ type: 'success', text: 'Preferensi notifikasi berhasil disimpan' });
      setTimeout(() => setMessage(null), 3000);
      loadPreferences();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal menyimpan preferensi: ' + (error.message || 'Error tidak dikenal') });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSystemSettings = async () => {
    try {
      setSaving(true);
      await updateSystemSettings({
        active_academic_year: systemSettings.active_academic_year,
        active_semester: parseInt(systemSettings.active_semester),
        cbt_strict_anticheat: systemSettings.cbt_strict_anticheat,
        cbt_show_score_auto: systemSettings.cbt_show_score_auto,
        cbt_random_questions: systemSettings.cbt_random_questions,
        cbt_device_locking: systemSettings.cbt_device_locking,
      });
      setMessage({ type: 'success', text: 'Konfigurasi akademik berhasil disimpan' });
      setTimeout(() => setMessage(null), 3000);
      loadPreferences();
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal menyimpan konfigurasi: ' + (error.message || 'Error tidak dikenal') });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleToggleMaintenanceMode = async () => {
    const newMode = !systemSettings.maintenance_mode;
    if (!confirm(newMode ? 'Aktifkan maintenance mode? Hanya admin yang bisa login.' : 'Nonaktifkan maintenance mode?')) return;
    
    try {
      setSaving(true);
      await toggleMaintenanceMode(newMode);
      setSystemSettings(prev => ({ ...prev, maintenance_mode: newMode }));
      setMessage({ type: 'success', text: `Maintenance mode ${newMode ? 'diaktifkan' : 'dinonaktifkan'}` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: 'Gagal mengubah maintenance mode: ' + (error.message || 'Error tidak dikenal') });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profil Saya', icon: User },
    { id: 'account' as TabType, label: 'Keamanan', icon: Shield },
    { id: 'notifications' as TabType, label: 'Notifikasi', icon: Globe },
  ];
  
  if (isAdmin || isTeacher) {
    tabs.push({ id: 'system' as TabType, label: 'Pengaturan Sistem', icon: SettingsIcon });
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-on-surface mb-2">Pengaturan</h1>
        <p className="text-sm text-on-surface-variant">Kelola akun, preferensi, dan konfigurasi sistem Anda di sini.</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
          message.type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span className="font-medium">{message.text}</span>
        </div>
      )}

      <div className="mb-8">
        <div className="flex gap-1 bg-surface-container-low p-1 rounded-xl w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-2.5 text-sm font-bold transition-all rounded-lg ${
                activeTab === tab.id
                  ? 'bg-surface-container-lowest text-primary shadow-sm'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container/50'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profile' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <User className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Informasi Profil</h2>
              <p className="text-sm text-on-surface-variant">Data ini digunakan untuk keperluan administrasi dan laporan akademik.</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Username</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Nama Lengkap</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow"
                />
              </div>
            </div>

            {profile?.student && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-on-surface-variant ml-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-on-surface-variant ml-1">Nomor Telepon</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-on-surface-variant ml-1">Jenis Kelamin</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow"
                    >
                      <option value="">Pilih</option>
                      <option value="male">Laki-laki</option>
                      <option value="female">Perempuan</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-on-surface-variant ml-1">Tempat Lahir</label>
                    <input
                      type="text"
                      name="birth_place"
                      value={formData.birth_place}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-bold text-on-surface-variant ml-1">Tanggal Lahir</label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-on-surface-variant ml-1">Alamat Lengkap</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium transition-shadow resize-none"
                  />
                </div>
              </>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-10 pt-8 border-t border-outline-variant">
            <button
              onClick={() => loadProfile()}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-on-surface-variant hover:bg-surface-container rounded-xl transition-all"
            >
              <X className="w-4 h-4" />
              Batal
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-8 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'account' && (
        <div className="space-y-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Ubah Kata Sandi</h2>
                <p className="text-sm text-on-surface-variant">Pastikan kata sandi Anda kuat dan unik untuk menjaga keamanan akun.</p>
              </div>
            </div>
            
            <form onSubmit={handlePasswordChange} className="max-w-md space-y-5">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Kata Sandi Saat Ini</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Konfirmasi Kata Sandi Baru</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-medium pr-12"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-outline hover:text-on-surface transition-colors"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-8 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {saving ? 'Memperbarui...' : 'Perbarui Kata Sandi'}
                </button>
              </div>
            </form>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Perangkat Aktif</h2>
                <p className="text-sm text-on-surface-variant">Kelola perangkat yang saat ini terhubung ke akun Anda.</p>
              </div>
            </div>
            
            {devices.length === 0 ? (
              <div className="text-center py-10 bg-surface rounded-xl border border-dashed border-outline-variant">
                <p className="text-sm text-on-surface-variant">Tidak ada perangkat aktif lainnya.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-5 bg-surface border border-outline-variant rounded-xl hover:border-primary/30 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-primary/5 rounded-lg flex items-center justify-center shrink-0">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-on-surface">Device {device.device_id.substring(0, 8)}...</p>
                        <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">
                          {device.is_active ? 'Aktif' : 'Tidak Aktif'}
                        </p>
                      </div>
                    </div>
                    {device.is_active && (
                      <button
                        onClick={() => handleRemoveDevice(device.id)}
                        className="p-2.5 text-error hover:bg-error/10 rounded-xl transition-all"
                        title="Hapus Perangkat"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'notifications' && (
        <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-on-surface">Pengaturan Notifikasi</h2>
              <p className="text-sm text-on-surface-variant">Tentukan bagaimana Anda ingin menerima pembaruan dari sistem.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {[
              { key: 'notif_academic' as const, title: 'Notifikasi Akademik', desc: 'Pengumuman jadwal, tugas, dan nilai.' },
              { key: 'notif_messages' as const, title: 'Pesan & Obrolan', desc: 'Notifikasi pesan baru dari guru atau admin.' },
              { key: 'notif_payments' as const, title: 'Pembayaran (SPP)', desc: 'Pengingat tagihan dan konfirmasi pembayaran.' },
              { key: 'notif_email_digest' as const, title: 'Email Digest', desc: 'Ringkasan aktivitas mingguan via email.' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between p-5 bg-surface border border-outline-variant rounded-xl">
                <div>
                  <h3 className="font-bold text-on-surface">{item.title}</h3>
                  <p className="text-sm text-on-surface-variant mt-0.5">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={notifSettings[item.key]}
                    onChange={(e) => setNotifSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                  />
                  <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            ))}
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSaveNotifications}
              disabled={saving}
              className="px-8 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Preferensi'}
            </button>
          </div>
        </div>
      )}

      {activeTab === 'system' && (isAdmin || isTeacher) && (
        <div className="space-y-8">
          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Konfigurasi Akademik (Global)</h2>
                <p className="text-sm text-on-surface-variant">Atur tahun ajaran dan semester aktif untuk seluruh sistem.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Tahun Ajaran Aktif</label>
                <select
                  value={systemSettings.active_academic_year}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, active_academic_year: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                >
                  <option value="2025/2026">2025/2026</option>
                  <option value="2026/2027">2026/2027</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-bold text-on-surface-variant ml-1">Semester Aktif</label>
                <select
                  value={systemSettings.active_semester}
                  onChange={(e) => setSystemSettings(prev => ({ ...prev, active_semester: e.target.value }))}
                  className="w-full px-4 py-3 bg-surface border border-outline-variant rounded-xl text-on-surface focus:ring-2 focus:ring-primary/20 outline-none font-bold"
                >
                  <option value="1">Ganjil (1)</option>
                  <option value="2">Genap (2)</option>
                </select>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
               <button
                 onClick={handleSaveSystemSettings}
                 disabled={saving}
                 className="px-8 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
               >
                 {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
               </button>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center">
                <Lock className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-on-surface">Pengaturan Ujian Digital (CBT)</h2>
                <p className="text-sm text-on-surface-variant">Konfigurasi keamanan dan perilaku modul ujian online.</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {[
                { key: 'cbt_strict_anticheat' as const, title: 'Strict Anti-Cheat Mode', desc: 'Blokir otomatis jika siswa pindah tab atau keluar fullscreen lebih dari 3x.' },
                { key: 'cbt_show_score_auto' as const, title: 'Tampilkan Nilai Otomatis', desc: 'Siswa dapat melihat nilai PG segera setelah selesai mengerjakan.' },
                { key: 'cbt_random_questions' as const, title: 'Acak Soal & Jawaban', desc: 'Secara default mengacak urutan soal untuk setiap siswa.' },
                { key: 'cbt_device_locking' as const, title: 'Device Locking', desc: 'Hanya izinkan satu perangkat per akun saat ujian berlangsung.' },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between p-5 bg-surface border border-outline-variant rounded-xl">
                  <div>
                    <h3 className="font-bold text-on-surface">{item.title}</h3>
                    <p className="text-sm text-on-surface-variant mt-0.5">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={systemSettings[item.key]}
                      onChange={(e) => setSystemSettings(prev => ({ ...prev, [item.key]: e.target.checked }))}
                    />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end">
               <button
                 onClick={handleSaveSystemSettings}
                 disabled={saving}
                 className="px-8 py-2.5 bg-primary text-on-primary rounded-xl text-sm font-bold hover:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
               >
                 {saving ? 'Menyimpan...' : 'Simpan Pengaturan CBT'}
               </button>
            </div>
          </div>

          {isAdmin && (
            <div className="bg-surface-container-lowest rounded-2xl border border-error/20 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-error/10 rounded-xl flex items-center justify-center">
                  <Power className="w-6 h-6 text-error" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-error">Maintenance Mode</h2>
                  <p className="text-sm text-on-surface-variant">Hanya Administrator yang dapat login saat mode ini aktif.</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-5 bg-error/5 border border-error/10 rounded-xl">
                <div>
                  <h3 className="font-bold text-on-surface">Aktifkan Mode Pemeliharaan</h3>
                  <p className="text-sm text-on-surface-variant mt-0.5">Sistem akan menampilkan halaman "Under Maintenance" ke pengguna lain.</p>
                </div>
                <button
                  onClick={handleToggleMaintenanceMode}
                  disabled={saving}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg disabled:opacity-50 ${
                    systemSettings.maintenance_mode
                      ? 'bg-surface-container text-on-surface border border-outline-variant hover:bg-surface-container-high'
                      : 'bg-error text-white hover:opacity-90 shadow-error/20'
                  }`}
                >
                  {systemSettings.maintenance_mode ? 'Nonaktifkan' : 'Aktifkan Sekarang'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
