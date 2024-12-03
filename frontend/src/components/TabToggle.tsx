// TabToggle.tsx
"use client";

import React, { useState } from 'react';

interface TabToggleProps {
    onToggle: (view: 'personal' | 'employees') => void;
}

const TabToggle: React.FC<TabToggleProps> = ({ onToggle }) => {
    const [activeTab, setActiveTab] = useState<'personal' | 'employees'>('personal');

    const handleTabChange = (tab: 'personal' | 'employees') => {
        setActiveTab(tab);
        onToggle(tab);
    };

    return (
        <div
            style={{
                display: 'flex',
                backgroundColor: '#f0f0f0',
                padding: '4px',
                borderRadius: '8px',
                gap: '4px',
                width: 'fit-content',
                margin: '10px 0'
            }}
        >
            <button
                onClick={() => handleTabChange('personal')}
                style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: activeTab === 'personal' ? '#2596be' : 'transparent',
                    color: activeTab === 'personal' ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                }}
            >
                Personal Tasks
            </button>
            <button
                onClick={() => handleTabChange('employees')}
                style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: activeTab === 'employees' ? '#2596be' : 'transparent',
                    color: activeTab === 'employees' ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                }}
            >
                Employee Tasks
            </button>
        </div>
    );
};

export default TabToggle;