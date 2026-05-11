'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token || token === 'undefined' || token === 'null') {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  if (!isAuth) {
    return null; // Or a loading spinner
  }

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <Sidebar />
      <div className="flex-1 flex flex-col md:pl-[240px]">
        <Navbar />
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
