import { useState, useEffect } from 'react';
import { getUserFromToken } from './utils';

// Roles from the system
const ADMIN_ROLES = ['Administrator Utama'];
const STAFF_ROLES = ['Administrator Utama', 'Kepala Sekolah'];
const TEACHER_ROLES = ['Administrator Utama', 'Guru Mata Pelajaran', 'Wali Kelas'];
const FINANCE_ROLES = ['Administrator Utama', 'Bendahara / Staf TU'];

export function useUserRole() {
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    setUser(getUserFromToken());
  }, []);

  const role = user?.role || '';

  return {
    user,
    role,
    isAdmin: ADMIN_ROLES.includes(role),
    isStaff: STAFF_ROLES.includes(role),
    isTeacher: TEACHER_ROLES.includes(role),
    isFinance: FINANCE_ROLES.includes(role),
    isStudent: role === 'Siswa',
    isParent: role === 'Orang Tua',

    // Permission helpers
    canManageStudents: ['Administrator Utama', 'Kepala Sekolah'].includes(role),
    canManageEmployees: ADMIN_ROLES.includes(role),
    canManageExams: TEACHER_ROLES.includes(role),
    canManageGrades: TEACHER_ROLES.includes(role),
    canManageFinance: FINANCE_ROLES.includes(role),
    canManageAssets: ['Administrator Utama', 'Staf Sarpras'].includes(role),
    canManageUsers: ADMIN_ROLES.includes(role),
    canManageAcademic: ADMIN_ROLES.includes(role),
    canViewOnly: ['Siswa', 'Orang Tua', 'Kepala Sekolah'].includes(role),
  };
}
