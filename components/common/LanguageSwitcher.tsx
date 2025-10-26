
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../core/i18n';
import { Language } from '../../core/types';

const LanguageSwitcher: React.FC = () => {
    const { language, setLanguage } = useTranslation();
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    const languages: { code: Language; symbol: string; color: string; }[] = [
        { code: 'ar', symbol: 'ع', color: 'bg-green-500 hover:bg-green-600' },
        { code: 'fr', symbol: 'fr', color: 'bg-blue-500 hover:bg-blue-600' },
        { code: 'en', symbol: 'en', color: 'bg-red-500 hover:bg-red-600' },
    ];

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [wrapperRef]);

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform transform hover:scale-110 ${currentLang.color}`}
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-label="Change language"
            >
                {currentLang.symbol}
            </button>
            
            {isOpen && (
                <div 
                    className="absolute top-full right-0 mt-2 bg-white rounded-xl shadow-lg border z-20 p-2 flex flex-col items-center space-y-2"
                    role="menu"
                >
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            role="menuitem"
                            onClick={() => {
                                setLanguage(lang.code);
                                setIsOpen(false);
                            }}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md transition-transform transform hover:scale-110 ${lang.color}`}
                        >
                            {lang.symbol}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LanguageSwitcher;