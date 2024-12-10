// Top navbar component

import React from 'react'
import ProtectedRoute from '../user-auth/ProtectedRoute'
import Link from 'next/link'
import { API_BASE } from '@/util/api-path';
import { useRouter } from 'next/navigation';

export default function Navbar() {

  const router = useRouter();

  async function handleLogOut() {
    try {
      fetch(`${API_BASE}/logout`, { method: 'POST', credentials: 'include' })
        .then((res) => {
          if (res.ok) { // Successfuly logged out
            router.push('/login');
          }
          else {
            console.error(`Logout error: ${res.status}`);
          }
        })
    } catch (error) {
      console.error(`Logout error: ${error}`);
    }
  }
  return (
    <header className='bg-[#73B7EE] px-[20px] py-[12px] flex justify-between items-center text-[12px] sticky top-0 mx-auto z-40'>
      <div className=' flex space-x-[10px]'>
        <h1 className='text-xl cursor-pointer'>PaperLess CO.</h1>
      </div>

      <ProtectedRoute>
        {(user) => (
          <Link href={'/profile'} className='hover:text-slate-600'>{user.name}</Link>
        )}
      </ProtectedRoute>
      <button
        data-testid="logout"
        onClick={handleLogOut}
        className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17 16l4-4m0 0l-4-4m4 4H7"
          />
        </svg>
        Logout
      </button>


    </header>
  )
}