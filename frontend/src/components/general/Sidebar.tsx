// Sidebar component
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { SidebarData } from './sidebarData';

export default function Sidebar() {
    const [activeLink, setActiveLink] = useState<string | null>('/profile');

    const handleClick = (path: string) => {
        setActiveLink(path);
    };
    
    return (
        <aside id="sidebar" className="h-full">
            <ul className="bg-white border-r-[1px] border-black h-full space-y-5 pt-6 px-3 shadow-lg">
                {SidebarData.map((item, index) => (
                    <li key={index}>
                        <Link
                            href={item.path}
                            className={`${activeLink === item.path ? 'text-blue-500' : 'text-black'}`}
                            onClick={() => handleClick(item.path)}
                        >
                            {item.title}
                        </Link>
                    </li>
                ))}
            </ul>
        </aside>
    )
}