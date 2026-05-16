const getBaseUrl = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  // If we're in the browser, try to be smart about the host
  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    
    // If the env variable says localhost but the browser is on an IP, 
    // we MUST use the IP so the phone can talk to the backend.
    if (hostname !== 'localhost' && hostname !== '127.0.0.1') {
      return `${window.location.protocol}//${hostname}:3001/api/v1`;
    }
  }

  if (envUrl) return envUrl;
  return 'http://localhost:3001/api/v1';
};

const BASE_URL = getBaseUrl();

export const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token') || sessionStorage.getItem('token');
};

export async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getToken();
  
  const headers: any = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (response.status === 401) {
    if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    throw new Error(data?.message || 'Username atau password salah');
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
}
