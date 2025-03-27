import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Plus } from 'lucide-react';

interface ComboboxProps {
  value: string;
  onChange: (value: string, customer?: { 
    email?: string;
    phone?: string;
    address?: string;
  }) => void;
  options: Array<{ 
    id: string; 
    label: string;
    email?: string;
    phone?: string;
    address?: string;
  }>;
  placeholder?: string;
  className?: string;
  allowNew?: boolean;
}

export const Combobox: React.FC<ComboboxProps> = ({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  allowNew = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const [filteredOptions, setFilteredOptions] = useState(options);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Synchronize the external value with the internal state
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  useEffect(() => {
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(inputValue.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [inputValue, options]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        // Only reset if there's no value or if the input doesn't match any option
        if (!inputValue.trim() || (!allowNew && !options.find(o => o.label === inputValue.trim()))) {
          setInputValue(value);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [value, inputValue, options, allowNew]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    setIsOpen(true);
  };

  const handleOptionSelect = (option: typeof options[0]) => {
    onChange(option.label, {
      email: option.email,
      phone: option.phone,
      address: option.address
    });
    setInputValue(option.label);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && allowNew && inputValue.trim()) {
      e.preventDefault();
      onChange(inputValue.trim());
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setInputValue(value);
      inputRef.current?.blur();
    } else if (e.key === 'ArrowDown' && !isOpen) {
      setIsOpen(true);
    }
  };

  return (
    <div ref={wrapperRef} className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm"
          autoComplete="off"
        />
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute inset-y-0 right-0 flex items-center px-2 focus:outline-none"
        >
          <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {isOpen && (filteredOptions.length > 0 || (allowNew && inputValue.trim())) && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
          {filteredOptions.map((option) => (
            <li
              key={option.id}
              onClick={() => handleOptionSelect(option)}
              className={`relative cursor-pointer select-none py-2 pl-3 pr-9 hover:bg-indigo-50 ${
                value === option.label ? 'bg-indigo-50' : ''
              }`}
            >
              <div>
                <span className="block truncate font-medium">
                  {option.label}
                </span>
                {option.phone && (
                  <span className="block truncate text-xs text-gray-500">
                    {option.phone}
                  </span>
                )}
              </div>
              {value === option.label && (
                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600">
                  <Check className="h-4 w-4" />
                </span>
              )}
            </li>
          ))}
          {allowNew && inputValue.trim() && !filteredOptions.find(o => o.label.toLowerCase() === inputValue.toLowerCase()) && (
            <li
              onClick={() => {
                onChange(inputValue.trim());
                setIsOpen(false);
              }}
              className="relative cursor-pointer select-none py-2 pl-3 pr-9 text-indigo-600 hover:bg-indigo-50"
            >
              <div className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                <span>Créer "{inputValue.trim()}"</span>
              </div>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};