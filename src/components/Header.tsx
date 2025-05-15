import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png'; 




interface HeaderProps {
  activeSection: 'form' | 'about' | 'results';
  setActiveSection: (section: 'form' | 'about' | 'results') => void;
}

const Header: React.FC<HeaderProps> = ({ activeSection, setActiveSection }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md transition-colors duration-300">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
       <div className="flex items-center mb-4 md:mb-0">
  <motion.img
    src={logo}
    alt="UniRise Logo"
    className="w-10 h-10 mr-2"
    initial={{ rotate: 0 }}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, ease: "easeInOut" }}
  />
  <h1 className="text-2xl font-bold text-black dark:text-white">
    <span className="text-yellow-400">Uni</span>Rise
  </h1>
</div>
          
          <nav className="flex items-center space-x-8 rtl:space-x-reverse">
            <div className="flex space-x-8 rtl:space-x-reverse border-l dark:border-gray-600 pl-8 rtl:pr-8 rtl:pl-0">
              <button 
                onClick={() => setActiveSection('form')}
                className={`font-medium text-lg transition-colors duration-300 ${
                  activeSection === 'form' 
                    ? 'text-yellow-400 border-b-2 border-yellow-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400'
                }`}
              >
                الاستبيان
              </button>
              <button 
                onClick={() => setActiveSection('about')}
                className={`font-medium text-lg transition-colors duration-300 ${
                  activeSection === 'about' 
                    ? 'text-yellow-400 border-b-2 border-yellow-400' 
                    : 'text-gray-600 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400'
                }`}
              >
                حول المشروع
              </button>
            </div>
            
            <button
              onClick={toggleTheme}
              className="text-gray-600 dark:text-gray-300 hover:text-yellow-400 dark:hover:text-yellow-400 transition-colors duration-300"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;