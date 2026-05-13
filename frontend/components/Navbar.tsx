'use client';

import React, { useState, useEffect } from 'react';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (e) {
        console.error('Invalid token:', e);
      }
    }
  }, []);

  return (
    <header className="h-16 bg-surface-container-lowest border-b border-outline-variant flex items-center justify-end px-8 sticky top-0 z-30 ml-[240px]">
      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileDropdown user={user} />
      </div>
    </header>
  );
}
