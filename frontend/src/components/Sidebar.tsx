// Sidebar component
"use client";

import React from 'react';
import Link from 'next/link';
import { SidebarData } from './sidebarData';
import { API_BASE } from '@/util/path';
import { useRouter } from 'next/navigation';

export default function Sidebar() {
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
        <aside id='sidebar' className='h-full'>
            <ul className="bg-white border-r-[1px] border-black h-full space-y-5 pt-6 px-3">
                {SidebarData.map((item, index) => {
                    return <li key={index} className="flex">
                        <Link href={item.path}>{item.title}</Link>
                    </li>
                })}
                {/* Logout */}
                <li onClick={handleLogOut} className='cursor-pointer'>Logout</li>
            </ul>
        </aside>
    )
}