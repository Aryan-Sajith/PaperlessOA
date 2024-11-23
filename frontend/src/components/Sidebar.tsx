// Sidebar component
"use client";

import React from 'react'

import Link from 'next/link'
import { SidebarData } from './sidebarData';


export default function Sidebar() {
    return (
        <aside id='sidebar' className='h-full'>
            <ul className="bg-white border-r-[1px] border-black h-full space-y-5 pt-6 px-3">
                {SidebarData.map((item, index) => {
                    return <li key={index} className="flex">
                        <Link href={item.path}>{item.title}</Link>
                    </li>
                })}
            </ul>
        </aside>
    )
}