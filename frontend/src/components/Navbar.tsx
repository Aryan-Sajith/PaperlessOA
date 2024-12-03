// Top navbar component

import React from 'react'
import ProtectedRoute from './ProtectedRoute'

export default function Navbar() {
  return (
    <header className='bg-[#73B7EE] px-[20px] py-[12px] flex justify-between items-center text-[12px] sticky top-0 mx-auto z-40'>
      <div className='bg-white py-[4px] pl-[8px] pr-[50px] rounded-sm flex space-x-[10px]'>
        <img src='/icons/search.svg' height={20} width={20}></img>
        <input type='text' placeholder='Search' className='placeholder-black'></input>
      </div>

      <ProtectedRoute>
        {(user) => (
            <p>{user.name}</p>
        )}
      </ProtectedRoute>
    </header>
  )
}
