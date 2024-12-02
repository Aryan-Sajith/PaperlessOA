// frontend/src/app/page.tsx
"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/util/path';

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/current_user`, {
      credentials: 'include',
      mode: 'cors'
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Not authenticated');
        }
        return res.json();
      })
      .then(() => {
        setIsAuthenticated(true);
      })
      .catch(() => {
        router.push('/login');
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Don't show anything while redirecting
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Home Page</h1>
      <div className="space-y-4">
        <p><Link href="/hierarchy" className="text-blue-400 underline">Hierarchy page</Link></p>
        <p><Link href="/tasks" className="text-blue-400 underline">Tasks page</Link></p>
        <p><Link href="/workflows" className="text-blue-400 underline">Workflow page</Link></p>
        <p><Link href="/profile" className="text-blue-400 underline">Profile Page</Link></p>
      </div>
    </div>
  );
}