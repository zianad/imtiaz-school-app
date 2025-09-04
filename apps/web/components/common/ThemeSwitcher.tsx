
import React from 'react';

interface ThemeSwitcherProps {
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ toggleDarkMode, isDarkMode }) => {
    return (
        <button
            onClick={toggleDarkMode}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform transform hover:scale-110 bg-gray-700 hover:bg-gray-600 dark:bg-yellow-400 dark:hover:bg-yellow-500"
            aria-label="Toggle dark mode"
        >
            {isDarkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeSwitcher;
