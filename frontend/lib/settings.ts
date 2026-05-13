const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

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
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data: any): Promise<UserProfile> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/users/me`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/users/me/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Failed to change password');
  }
}

export async function getDevices(): Promise<Device[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/users/me/devices`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch devices');
  return res.json();
}

export async function removeDevice(deviceId: string): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/users/me/devices/${deviceId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to remove device');
}
