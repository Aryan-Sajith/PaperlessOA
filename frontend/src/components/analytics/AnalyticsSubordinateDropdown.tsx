"use client";

import React, { useState, useEffect } from "react";
import { API_BASE } from "@/util/api-path";

interface Subordinate {
  employee_id: number;
  name: string;
}

interface SubordinateDropdownProps {
  managerId: number;
  onChange?: (selectedSubordinate: Subordinate | null) => void;
}

export default function SubordinateDropdown({ managerId, onChange }: SubordinateDropdownProps) {
  const [subordinates, setSubordinates] = useState<Subordinate[]>([]);
  const [selectedSubordinate, setSelectedSubordinate] = useState<Subordinate | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch subordinates for the given manager
    const fetchSubordinates = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/manager/${managerId}/subordinates`);
        if (!response.ok) {
          throw new Error("Failed to fetch subordinates");
        }
        const data = await response.json();
        setSubordinates(data.length ? data : []); // Ensure subordinates is an empty array if no results
      } catch {
        setSubordinates([]); // Set to empty array if fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchSubordinates();
  }, [managerId]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (subordinate: Subordinate | null) => {
    setSelectedSubordinate(subordinate);
    setIsOpen(false);
    if (onChange) {
      onChange(subordinate); // Notify parent component of selection
    }
  };

  return (
    <div className="relative inline-block text-left">
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {/* Dropdown Button */}
          <button
            onClick={toggleDropdown}
            className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300 flex items-center"
          >
            {selectedSubordinate ? selectedSubordinate.name : "All Subordinates"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`ml-2 h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Dropdown Options */}
          {isOpen && (
            <div className="absolute mt-2 w-40 bg-white rounded-md shadow-lg">
              <ul className="py-1">
                <li
                  key="all"
                  onClick={() => handleOptionClick(null)}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700"
                >
                  All Subordinates
                </li>
                {subordinates.map((subordinate) => (
                  <li
                    key={subordinate.employee_id}
                    onClick={() => handleOptionClick(subordinate)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700"
                  >
                    {subordinate.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
