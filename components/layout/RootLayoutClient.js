'use client';
import Navbar from '@/components/layout/Navbar';

export default function RootLayoutClient({ children }) {
  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-900">
        {children}
      </main>
    </>
  );
} 