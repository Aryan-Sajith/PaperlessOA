// Sidebar component
"use client";

import React from 'react';
import Link from 'next/link';
import { SidebarData } from './sidebarData';
import { API_BASE } from '@/util/path';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
    

    return (
        <aside id='sidebar' className='h-full'>
            <ul className="bg-white border-r-[1px] border-black h-full space-y-5 pt-6 px-3 shadow-lg">
                {SidebarData.map((item, index) => {
                    return <li key={index} className="flex">
                        <Link href={item.path}>{item.title}</Link>
                    </li>
                })}
                {/* Logout */}
                
            </ul>
        </aside>
    )
}