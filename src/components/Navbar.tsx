// Top navbar component

import React from 'react'

export default function Navbar() {
  return (
    <div className='bg-[#73B7EE] px-[20px] py-[12px] flex justify-between items-center text-[12px]'>
      <div className='bg-white py-[4px] pl-[8px] pr-[50px] rounded-sm flex space-x-[10px]'>
        <img src='/icons/search.svg' height={20} width={20}></img>
        <input type='text' placeholder='Search' className='placeholder-black'></input>
      </div>

      <div>
        <p>William Saulnier</p>
      </div>
    </div>
  )
}
