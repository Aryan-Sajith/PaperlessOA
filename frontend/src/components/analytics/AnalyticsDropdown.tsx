"use client";

import React, { useState } from 'react';

type Option = "All" | "Administrative" |"Finance" |"HR" |"IT" |"Communication" |"Facitilies" |"Projects" |"Legal" |"Other" | "Past Day"| "Past Week"| "Past Month"| "Next Day"| "Next Week"| "Next Month";

interface DropdownMenuProps {
  type: "task" | "time"; // Accept either "task" or "time"
  onChange?: (selectedOption: Option) => void; // Optional callback for changes
}

export default function DropdownMenu({type, onChange}: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const options: Option[] = type === "task" ? ["All", "Administrative", "Finance", "HR", "IT", "Communication", "Facitilies", "Projects", "Legal", "Other"] 
  : ["Past Month", "Past Week", "Past Day", "Next Month", "Next Week", "Next Day"];

  const [selectedOption, setSelectedOption] = useState<Option>(options[0]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: Option) => {
    setSelectedOption(option);
    setIsOpen(false);
    if (onChange) {
      onChange(option); // Notify parent component
    }
  };

  return (
    <div className="relative inline-block text-left">
      {/* Dropdown Button */}
      <button
        data-testid="analytics-toggle"
        onClick={toggleDropdown}
        className="bg-gray-200 px-4 py-2 rounded-md text-gray-700 hover:bg-gray-300 flex items-center"
      >
        {selectedOption}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`ml-2 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute mt-2 w-40 bg-white rounded-md shadow-lg">
          <ul data-testid="analytics-select" className="py-1">
            {options.map((option) => (
              <li
                key={option}
                onClick={() => handleOptionClick(option)}
                className="cursor-pointer px-4 py-2 hover:bg-gray-100 text-gray-700"
              >
                {option}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
