const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  link: string | null;
  created_at: string;
}

export interface NotificationMeta {
  total: number;
  page: number;
  limit: number;
  last_page: number;
}

export interface NotificationsResponse {
  data: Notification[];
  meta: NotificationMeta;
}

export async function getNotifications(page: number = 1, limit: number = 10): Promise<NotificationsResponse> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/notifications?page=${page}&limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch notifications');
  return res.json();
}

export async function getUnreadNotifications(limit: number = 5): Promise<Notification[]> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/notifications/unread?limit=${limit}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch unread notifications');
  return res.json();
}

export async function getUnreadCount(): Promise<{ count: number }> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch unread count');
  return res.json();
}

export async function markAsRead(id: string): Promise<Notification> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/notifications/${id}/mark-as-read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark notification as read');
  return res.json();
}

export async function markAllAsRead(): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/notifications/mark-all-as-read`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to mark all as read');
}

export async function deleteNotification(id: string): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/notifications/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete notification');
}

export async function deleteAllNotifications(): Promise<void> {
  const token = localStorage.getItem('token');
  const res = await fetch(`${API_BASE_URL}/notifications`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete all notifications');
}

export function getNotificationIcon(type: string): string {
  switch (type) {
    case 'payment':
      return '💰';
    case 'exam':
      return '📝';
    case 'announcement':
      return '📢';
    case 'attendance':
      return '📅';
    case 'ppdb':
      return '🎓';
    default:
      return '🔔';
  }
}

export function getNotificationColor(type: string): string {
  switch (type) {
    case 'payment':
      return 'bg-green-100 border-green-300';
    case 'exam':
      return 'bg-blue-100 border-blue-300';
    case 'announcement':
      return 'bg-purple-100 border-purple-300';
    case 'attendance':
      return 'bg-orange-100 border-orange-300';
    case 'ppdb':
      return 'bg-pink-100 border-pink-300';
    default:
      return 'bg-gray-100 border-gray-300';
  }
}
