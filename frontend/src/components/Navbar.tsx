// Top navbar component

import React from 'react'
import ProtectedRoute from './ProtectedRoute'
import Link from 'next/link'

export default function Navbar() {
  return (
    <header className='bg-[#73B7EE] px-[20px] py-[12px] flex justify-between items-center text-[12px] sticky top-0 mx-auto z-40'>
      <div className=' flex space-x-[10px]'>
        <h1 className='text-xl'>PaperLess CO.</h1>
      </div>

      <ProtectedRoute>
        {(user) => (
            <Link href={'/profile'} className='hover:font-bold'>{user.name}</Link>
        )}
      </ProtectedRoute>
    </header>
  )
}
