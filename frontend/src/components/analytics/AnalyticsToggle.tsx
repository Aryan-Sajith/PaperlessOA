"use client";

import React, { useState } from 'react';

export type analyticsViewType = 'My' | 'Employees';

interface AnalyticsToggleProps {
    onToggle: (view: analyticsViewType) => void;
}

// Component to toggle between My Analytics and Employee Analytics
const AnalyticsToggle: React.FC<AnalyticsToggleProps> = ({ onToggle }) => {
    const [activeTab, setActiveTab] = useState<'My' | 'Employees'>('My');

    // Function to handle tab change
    const handleTabChange = (tab: 'My' | 'Employees') => {
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
                onClick={() => handleTabChange('My')}
                style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: activeTab === 'My' ? '#2596be' : 'transparent',
                    color: activeTab === 'My' ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                }}
            >
                My Analytics
            </button>
            <button
                onClick={() => handleTabChange('Employees')}
                style={{
                    padding: '8px 16px',
                    border: 'none',
                    borderRadius: '6px',
                    backgroundColor: activeTab === 'Employees' ? '#2596be' : 'transparent',
                    color: activeTab === 'Employees' ? 'white' : '#333',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    fontSize: '14px',
                }}
            >
                Employee Analytics
            </button>
        </div>
    );
};

export default AnalyticsToggle;