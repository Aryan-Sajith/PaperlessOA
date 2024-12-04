// Top navbar component

import React, { useState } from 'react'
import ProtectedRoute from './ProtectedRoute'
import Link from 'next/link'
import { API_BASE } from '@/util/path';
import { useRouter } from 'next/navigation';
import { classNames } from 'react-select/dist/declarations/src/utils';

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

  const [isOpen, setIsOpen] = useState<boolean>(false);
  function handleClick() {
    setIsOpen(val => !val);
  }

  return (
    <header className='bg-[#73B7EE] px-[20px] py-[12px] flex justify-between items-center text-[12px] sticky top-0 mx-auto z-40 shadow-lg'>
      <div className=' flex space-x-[10px]'>
        <Link href='/' className='text-xl hover:cursor-pointer'>PaperLess CO.</Link>
      </div>

      <ProtectedRoute>
        {(user) => (
          <button className={isOpen ? 'rounded-lg p-2 shadow-lg text-sm bg-blue-400' : 'p-2 text-sm'} onClick={handleClick}>{user.name}</button>
        )}
      </ProtectedRoute>

      {/* Dropdown Menu */}
      {isOpen && <div className='absolute right-0 top-[60px] bg-white py-4 px-[20px] mr-[20px] shadow-lg text-right rounded-b-md text-base z-30 space-y-1'>
        <Link href='/profile'>Profile</Link>
        <button onClick={handleLogOut} className='flex text-red-500 '>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
          </svg>
        Logout
      </button>
      </div>}
    </header>
  )
}

/**
 * <button onClick={handleLogOut}  className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7"/>
        </svg>
        Logout
      </button>
 */