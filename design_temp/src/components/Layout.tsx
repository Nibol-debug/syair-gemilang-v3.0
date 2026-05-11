import React from 'react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { motion } from 'motion/react';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-surface">
      <Sidebar />
      <Navbar />
      <main className="ml-[240px] p-10">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
