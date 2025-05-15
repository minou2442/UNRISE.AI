import React, { useState, useRef, useEffect } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MultiSelectProps {
  options: string[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
}

const MultiSelect: React.FC<MultiSelectProps> = ({ 
  options, 
  selected, 
  onChange, 
  placeholder = 'اختر...' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onChange(selected.filter(item => item !== option));
    } else {
      onChange([...selected, option]);
    }
  };

  const removeOption = (option: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(item => item !== option));
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <div
        className={`flex flex-wrap min-h-[50px] items-center p-2 border ${
          isOpen ? 'border-yellow-400' : 'border-gray-300 dark:border-gray-600'
        } rounded-lg bg-white dark:bg-gray-700 cursor-pointer transition-all duration-300`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selected.length === 0 ? (
          <span className="text-gray-500 dark:text-gray-400 px-2">{placeholder}</span>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selected.map(option => (
              <div 
                key={option}
                className="flex items-center bg-yellow-100 dark:bg-yellow-900/30 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-md"
              >
                <span className="mr-1">{option}</span>
                <button 
                  onClick={(e) => removeOption(option, e)}
                  className="text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="ml-auto">
          <ChevronDown 
            size={20} 
            className={`text-gray-500 dark:text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </div>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {options.map(option => (
              <div
                key={option}
                className={`flex items-center px-4 py-2 cursor-pointer ${
                  selected.includes(option)
                    ? 'bg-yellow-50 dark:bg-yellow-900/20 text-gray-900 dark:text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }`}
                onClick={() => toggleOption(option)}
              >
                <div className={`w-5 h-5 mr-3 flex-shrink-0 border rounded ${
                  selected.includes(option) 
                    ? 'bg-yellow-400 border-yellow-400'
                    : 'border-gray-300 dark:border-gray-600'
                }`}>
                  {selected.includes(option) && (
                    <Check size={18} className="text-black" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MultiSelect;