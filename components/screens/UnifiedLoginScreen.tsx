
import React, { useState, useRef, useEffect } from 'react';
import { HELP_PHONE_NUMBER } from '../../constants';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import ThemeSwitcher from '../ThemeSwitcher';

interface UnifiedLoginScreenProps {
    onLogin: (code: string) => Promise<boolean>;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const UnifiedLoginScreen: React.FC<UnifiedLoginScreenProps> = ({ onLogin, toggleDarkMode, isDarkMode }) => {
    const [code, setCode] = useState('');
    const { t } = useTranslation();
    const [status, setStatus] = useState<'idle' | 'checking' | 'correct' | 'incorrect'>('idle');
    const [inputType, setInputType] = useState<'password' | 'text'>('password');
    const visibilityTimeout = useRef<number | null>(null);

    useEffect(() => {
        return () => {
            if (visibilityTimeout.current) {
                clearTimeout(visibilityTimeout.current);
            }
        };
    }, []);

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        if (status !== 'idle') {
            setStatus('idle');
        }

        setInputType('text');

        if (visibilityTimeout.current) {
            clearTimeout(visibilityTimeout.current);
        }

        visibilityTimeout.current = window.setTimeout(() => {
            setInputType('password');
        }, 250);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!code.trim() || status === 'checking' || status === 'correct') return;

        setStatus('checking');
        const success = await onLogin(code.trim());

        if (success) {
            setStatus('correct');
        } else {
            setStatus('incorrect');
            setCode('');
            setInputType('password');
            setTimeout(() => {
                setStatus('idle');
            }, 800);
        }
    };
    
    const inputClasses = {
        idle: 'border-gray-300 focus:ring-blue-500 focus:border-transparent dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-blue-400',
        checking: 'border-blue-300 ring-blue-300 dark:border-blue-500 dark:ring-blue-500',
        correct: 'bg-green-50 border-green-500 text-green-700 ring-green-500 dark:bg-green-900/20 dark:border-green-500 dark:text-green-300',
        incorrect: 'bg-orange-50 border-orange-400 text-orange-700 ring-orange-400 animate-shake dark:bg-orange-900/20 dark:border-orange-500 dark:text-orange-300',
    }[status];

    return (
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600 dark:border-blue-500 w-full max-w-md mx-auto relative">
            <div className="absolute top-4 start-4 z-10 flex gap-2">
                <LanguageSwitcher />
                <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            </div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('unifiedLoginWelcome')}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">by appshark.solution</p>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t('unifiedLoginPrompt')}</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <input
                    type={inputType}
                    value={code}
                    onChange={handleCodeChange}
                    placeholder={t('loginCodePlaceholder')}
                    className={`w-full p-4 border-2 rounded-lg text-center text-xl tracking-widest focus:ring-2 transition-colors duration-300 text-gray-700 dark:text-gray-200 ${inputClasses}`}
                    aria-label={t('loginCodePlaceholder')}
                    disabled={status === 'checking' || status === 'correct'}
                />
                <button
                    type="submit"
                    disabled={!code.trim() || status === 'checking' || status === 'correct'}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:transform-none dark:hover:bg-blue-500"
                >
                    {status === 'checking' || status === 'correct' ? '...' : t('login')}
                </button>
            </form>

            <div className="mt-8">
                <a
                    href={`tel:${HELP_PHONE_NUMBER}`}
                    className="text-blue-600 hover:underline dark:text-blue-400 font-semibold"
                >
                    {t('requestHelp')}
                </a>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {t('helpNote')}
                </p>
            </div>
        </div>
    );
};

export default UnifiedLoginScreen;
