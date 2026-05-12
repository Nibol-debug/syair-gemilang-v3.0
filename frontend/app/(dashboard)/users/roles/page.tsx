'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  CheckSquare, 
  Square,
  Loader2,
  ArrowLeft,
  Settings,
  Lock,
  Save,
  X
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/api';

export default function RolesPage() {
  const [roles, setRoles] = useState<any[]>([]);
  const [permissions, setPermissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  const [isEditingPermissions, setIsEditingPermissions] = useState(false);
  const [rolePermissions, setRolePermissions] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rolesRes, permsRes] = await Promise.all([
        apiRequest('/roles'),
        apiRequest('/permissions')
      ]);
      setRoles(rolesRes);
      setPermissions(permsRes);
    } catch (err) {
      console.error('Failed to fetch roles/permissions', err);
    } finally {
      setIsLoading(true); // Wait, I should set it to false
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleEditPermissions = (role: any) => {
    setSelectedRole(role);
    setRolePermissions(role.permissions.map((p: any) => p.permission_id));
    setIsEditingPermissions(true);
  };

  const togglePermission = (permId: string) => {
    setRolePermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(id => id !== permId) 
        : [...prev, permId]
    );
  };

  const savePermissions = async () => {
    setIsSaving(true);
    try {
      await apiRequest(`/roles/${selectedRole.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ permissionIds: rolePermissions })
      });
      setIsEditingPermissions(false);
      fetchData();
    } catch (err: any) {
      alert('Gagal menyimpan izin: ' + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const createRole = async () => {
    const name = prompt('Nama Peran Baru:');
    if (name) {
      try {
        await apiRequest('/roles', { method: 'POST', body: JSON.stringify({ name }) });
        fetchData();
      } catch (err: any) { alert(err.message); }
    }
  };

  const createPermission = async () => {
    const name = prompt('Nama Izin Baru (format: resource:action, contoh: users:read):');
    if (name) {
      try {
        await apiRequest('/permissions', { method: 'POST', body: JSON.stringify({ name }) });
        fetchData();
      } catch (err: any) { alert(err.message); }
    }
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div className="space-y-1">
          <Link href="/users" className="text-xs font-bold text-primary flex items-center gap-1 hover:underline mb-2">
            <ArrowLeft className="w-3 h-3" />
            Kembali ke Pengguna
          </Link>
          <h2 className="text-3xl font-bold text-on-surface tracking-tight flex items-center gap-3">
            <Shield className="w-8 h-8 text-primary" />
            Peran & Hak Akses
          </h2>
          <p className="text-on-surface-variant font-medium">Kelola Role-Based Access Control (RBAC) untuk seluruh fitur sistem.</p>
        </div>
        <div className="flex gap-3">
           <button 
            onClick={createPermission}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-outline text-on-surface font-bold text-sm hover:bg-surface-container transition-all"
          >
            <Lock className="w-4 h-4 text-outline" />
            Tambah Izin
          </button>
          <button 
            onClick={createRole}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Tambah Peran
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Roles List */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] px-2">Daftar Peran</h3>
          {isLoading ? (
            <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
          ) : (
            <div className="space-y-3">
              {roles.map((role) => (
                <div 
                  key={role.id} 
                  onClick={() => handleEditPermissions(role)}
                  className={cn(
                    "p-5 rounded-2xl border transition-all cursor-pointer group flex items-center justify-between",
                    selectedRole?.id === role.id 
                      ? "bg-primary/5 border-primary shadow-sm" 
                      : "bg-surface-container-lowest border-outline-variant hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      selectedRole?.id === role.id ? "bg-primary text-on-primary" : "bg-surface-container text-outline group-hover:text-primary"
                    )}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{role.name}</p>
                      <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">
                        {role.permissions?.length || 0} Izin Aktif
                      </p>
                    </div>
                  </div>
                  <Settings className={cn(
                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity",
                    selectedRole?.id === role.id ? "text-primary opacity-100" : "text-outline"
                  )} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Permissions Editor */}
        <div className="lg:col-span-2">
          {isEditingPermissions ? (
            <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl p-8 shadow-sm space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
               <div className="flex justify-between items-center pb-6 border-b border-outline-variant">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                      <Lock className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-on-surface">Hak Akses: {selectedRole.name}</h4>
                      <p className="text-sm font-medium text-on-surface-variant italic">Pilih fitur yang dapat diakses oleh peran ini.</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setIsEditingPermissions(false)}
                      className="px-5 py-2 rounded-xl border border-outline text-on-surface font-bold text-sm hover:bg-surface-container transition-all"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={savePermissions}
                      disabled={isSaving}
                      className="flex items-center gap-2 px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20 active:scale-95"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Simpan Perubahan
                    </button>
                  </div>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {permissions.map((perm) => {
                    const isActive = rolePermissions.includes(perm.id);
                    return (
                      <div 
                        key={perm.id} 
                        onClick={() => togglePermission(perm.id)}
                        className={cn(
                          "p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 group",
                          isActive ? "bg-primary/5 border-primary/30" : "bg-surface border-outline-variant hover:bg-surface-container"
                        )}
                      >
                        {isActive ? <CheckSquare className="w-5 h-5 text-primary" /> : <Square className="w-5 h-5 text-outline group-hover:text-primary/50" />}
                        <div>
                          <p className="text-sm font-bold text-on-surface">{perm.name}</p>
                          <p className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">{perm.name.split(':')[0]} module</p>
                        </div>
                      </div>
                    );
                  })}
               </div>
            </div>
          ) : (
            <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-3xl p-20 flex flex-col items-center justify-center text-center opacity-60">
               <Shield className="w-16 h-16 text-outline mb-6" />
               <h4 className="text-xl font-bold text-on-surface mb-2">Pilih Peran untuk Mengelola Izin</h4>
               <p className="max-w-xs text-sm font-medium text-on-surface-variant">Klik salah satu peran di sebelah kiri untuk melihat dan mengubah hak akses fiturnya.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
