"use client";
import Link from 'next/link'
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_BASE } from '@/util/api-path';

export default function HomePage() {
  const router = useRouter(); // Router instance to redirect user based on authentication status
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/current_user`, { // Retrieve the current user via cookies
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
        router.push('/profile')
      });
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!isAuthenticated) {
    return null; // Don't show anything while redirecting
  }

  // Since user is authenticated and loading is complete, render the home page

}