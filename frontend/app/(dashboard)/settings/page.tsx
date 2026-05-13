'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { User, Shield, Settings as SettingsIcon, Save, X, Eye, EyeOff, Smartphone, Trash2, Info } from 'lucide-react';
import {
  getProfile,
  updateProfile,
  changePassword,
  getDevices,
  removeDevice,
  UserProfile,
  Device,
} from '@/lib/settings';

type TabType = 'profile' | 'account' | 'system';

export default function SettingsPage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>((searchParams.get('tab') as TabType) || 'profile');
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [devices, setDevices] = useState<Device[]>([]);

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
      setMessage({ type: 'error', text: 'Failed to load profile' });
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

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setSaving(true);
      await updateProfile({
        username: formData.username,
        student: {
          email: formData.email,
          phone: formData.phone,
          full_name: formData.full_name,
          gender: formData.gender,
          birth_place: formData.birth_place,
          birth_date: formData.birth_date,
          address: formData.address,
        },
      });
      setMessage({ type: 'success', text: 'Profile updated successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password must be at least 6 characters' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setSaving(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setMessage({ type: 'success', text: 'Password changed successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Failed to change password' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveDevice = async (deviceId: string) => {
    if (!confirm('Remove this device? You will be logged out from this device.')) return;
    
    try {
      await removeDevice(deviceId);
      loadDevices();
      setMessage({ type: 'success', text: 'Device removed successfully' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to remove device' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const tabs = [
    { id: 'profile' as TabType, label: 'Profile', icon: User },
    { id: 'account' as TabType, label: 'Account', icon: Shield },
    { id: 'system' as TabType, label: 'System', icon: SettingsIcon },
  ];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-on-surface mb-2">Settings</h1>
        <p className="text-sm text-on-surface-variant">Manage your account settings and preferences</p>
      </div>

      {/* Toast Message */}
      {message && (
        <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          <span>{message.text}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-outline-variant">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-semibold transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-on-surface-variant hover:text-on-surface'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6">
          <h2 className="text-lg font-bold text-on-surface mb-6">Profile Information</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-on-surface-variant mb-1">Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              />
            </div>

            {profile?.student && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Full Name</label>
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Gender</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    >
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Birth Place</label>
                    <input
                      type="text"
                      name="birth_place"
                      value={formData.birth_place}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-on-surface-variant mb-1">Birth Date</label>
                    <input
                      type="date"
                      name="birth_date"
                      value={formData.birth_date}
                      onChange={handleProfileChange}
                      className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleProfileChange}
                    rows={3}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-none"
                  />
                </div>
              </>
            )}

            {profile?.employee && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-on-surface-variant mb-1">Full Name</label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleProfileChange}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-outline-variant">
            <button
              onClick={() => loadProfile()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-on-surface-variant hover:bg-surface-container rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      )}

      {/* Account Tab */}
      {activeTab === 'account' && (
        <div className="space-y-6">
          {/* Change Password */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6">
            <h2 className="text-lg font-bold text-on-surface mb-6">Change Password</h2>
            
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Current Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, currentPassword: e.target.value }))}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, current: !prev.current }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, newPassword: e.target.value }))}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, new: !prev.new }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface-variant mb-1">Confirm New Password</label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData((prev) => ({ ...prev, confirmPassword: e.target.value }))}
                    className="w-full px-4 py-2 bg-surface border border-outline-variant rounded-lg text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none pr-10"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords((prev) => ({ ...prev, confirm: !prev.confirm }))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          </div>

          {/* Active Devices */}
          <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6">
            <h2 className="text-lg font-bold text-on-surface mb-6">Active Devices</h2>
            
            {devices.length === 0 ? (
              <p className="text-sm text-on-surface-variant">No active devices found</p>
            ) : (
              <div className="space-y-3">
                {devices.map((device) => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 bg-surface border border-outline-variant rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Smartphone className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-on-surface">Device {device.device_id.substring(0, 8)}...</p>
                        <p className="text-xs text-on-surface-variant">
                          Status: {device.is_active ? 'Active' : 'Inactive'}
                        </p>
                      </div>
                    </div>
                    {device.is_active && (
                      <button
                        onClick={() => handleRemoveDevice(device.id)}
                        className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* System Tab */}
      {activeTab === 'system' && (
        <div className="bg-surface-container-lowest rounded-lg border border-outline-variant p-6">
          <h2 className="text-lg font-bold text-on-surface mb-6">System Information</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-surface border border-outline-variant rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-on-surface">Application Version</h3>
              </div>
              <p className="text-sm text-on-surface-variant ml-8">Syiar Gemilang ERP v3.0</p>
              <p className="text-xs text-outline-variant ml-8 mt-1">Build: 2026.05.13</p>
            </div>

            <div className="p-4 bg-surface border border-outline-variant rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-secondary" />
                <h3 className="font-semibold text-on-surface">System Status</h3>
              </div>
              <div className="ml-8 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Backend API</span>
                  <span className="text-green-600 font-semibold">● Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Database</span>
                  <span className="text-green-600 font-semibold">● Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-on-surface-variant">Notifications</span>
                  <span className="text-green-600 font-semibold">● Active</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-surface border border-outline-variant rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <Info className="w-5 h-5 text-error" />
                <h3 className="font-semibold text-on-surface">Danger Zone</h3>
              </div>
              <p className="text-sm text-on-surface-variant ml-8 mb-3">
                Irreversible actions related to your account
              </p>
              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete all your notifications? This cannot be undone.')) {
                    // Future: implement delete all notifications
                  }
                }}
                className="ml-8 px-4 py-2 bg-error/10 text-error hover:bg-error/20 rounded-lg text-sm font-semibold transition-colors"
              >
                Clear All Notifications
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
