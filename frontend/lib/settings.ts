import { apiRequest } from './api';

export interface UserProfile {
  id: string;
  username: string;
  role: {
    id: string;
    name: string;
  };
  student?: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    profile_picture: string | null;
    gender: string;
    birth_place: string;
    birth_date: string;
    address: string;
  };
  employee?: {
    id: string;
    full_name: string;
    education: string;
    position: string;
    join_date: string;
    status: string;
  };
}

export interface Device {
  id: string;
  user_id: string;
  device_id: string;
  is_active: boolean;
}

export async function getProfile(): Promise<UserProfile> {
  return apiRequest('/users/me');
}

export async function updateProfile(data: any): Promise<UserProfile> {
  return apiRequest('/users/me', {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  return apiRequest('/users/me/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
}

export async function getDevices(): Promise<Device[]> {
  return apiRequest('/users/me/devices');
}

export async function removeDevice(deviceId: string): Promise<void> {
  return apiRequest(`/users/me/devices/${deviceId}`, {
    method: 'DELETE',
  });
}
