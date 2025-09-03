
import React, { useState, useRef, useEffect } from 'react';
import { HELP_PHONE_NUMBER } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface UnifiedLoginScreenProps {
    onLogin: (code: string) => Promise<void>;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const EventHorizonLogo = () => (
    <div className="mb-6">
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
			 viewBox="0 0 595.3 841.9" xmlSpace="preserve" className="w-56 h-auto mx-auto">
            <path style={{fill:'#E30613'}} d="M357.4,167.9c-33.2,68.8-67.6,125.4-108.1,120.9c-5.4-0.6-10.8-0.8-16.2,0c-40.9,5.6-31.6,35.1-64.7,114 l49-73.5l2.5,42.3c0.7,11.5-0.7,23-4.2,34l-8,25.2c29.4-23.5,52.8-48.5,75.1-83.2l3.1-28.9c0-2.2,0.5-4.3,1.4-6.3L357.4,167.9z"/>
            <path style={{fill:'#006633'}} d="M367.1,163.3c-38.3,139.9-102.4,274.6-299.7,361c49-13.5,89.4-33.2,127.7-59.2l-26,96l60.8-120.5l32.7-31.7	l59.7,152.7l-34.2-181.3C333.3,324.4,362.5,250.1,367.1,163.3z"/>
            <circle style={{fill:'#E30613'}} cx="250.9" cy="254.5" r="24.3"/>
            <g>
                <path style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeMiterlimit:10}} d="M361.1,131.8l-10.7,13.1c5.6,11.2,14.3,16.9,25.7,18.1l10.2-15.7L361.1,131.8z"/>
                <polygon style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeMiterlimit:10}} points="381.8,134 396,157.1 366.8,147.7 353.4,122.2 	"/>
                <polyline style={{fill:'none',stroke:'#006633',strokeWidth:2,strokeMiterlimit:10}} points="380.3,168.4 383.5,149.7 375.9,139.9 	"/>
                <ellipse transform="matrix(0.2247 -0.9744 0.9744 0.2247 154.9655 472.7437)" style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeMiterlimit:10}} cx="374.6" cy="139" rx="1.7" ry="2.6"/>
                <line style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}} x1="377.9" y1="167.6" x2="372.9" y2="172"/>
                <line style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}} x1="378.9" y1="167.5" x2="376.2" y2="173.5"/>
                <line style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}} x1="380.9" y1="168.1" x2="379.6" y2="174.6"/>
                <line style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeLinecap:'round',strokeLinejoin:'round',strokeMiterlimit:10}} x1="382.5" y1="168.3" x2="384.2" y2="174.7"/>
                <ellipse style={{fill:'#E30613',stroke:'#006633',strokeWidth:2,strokeMiterlimit:10}} cx="380.3" cy="167.4" rx="2.6" ry="1.2"/>
            </g>
        </svg>
    </div>
);


const UnifiedLoginScreen: React.FC<UnifiedLoginScreenProps> = ({ onLogin, toggleDarkMode, isDarkMode }) => {
    const [code, setCode] = useState('');
    const { t } = useTranslation();
    const [status, setStatus] = useState<'idle' | 'checking' | 'correct' | 'incorrect'>('idle');
    const [error, setError] = useState('');
    const [inputType, setInputType] = useState<'password' | 'text'>('password');
    const visibilityTimeout = useRef<number | null>(null);
    const synthesisUnlocked = useRef(false);

    const unlockSpeechSynthesis = () => {
        if (synthesisUnlocked.current || typeof window.speechSynthesis === 'undefined') return;
        const synth = window.speechSynthesis;
        setTimeout(() => {
            const utterance = new SpeechSynthesisUtterance('');
            utterance.volume = 0;
            synth.speak(utterance);
            synthesisUnlocked.current = true;
        }, 100);
    };

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
            setError('');
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
        unlockSpeechSynthesis();
        if (!code.trim() || status === 'checking' || status === 'correct') return;

        setStatus('checking');
        setError('');
        
        try {
            await onLogin(code.trim());
            setStatus('correct');
        } catch (err: any) {
            setStatus('incorrect');
             if (err.message.includes('Invalid login credentials')) {
                setError(t('invalidCode'));
            } else {
                setError(err.message);
            }
        }
    };
    
    const inputClasses = {
        idle: 'border-gray-300 focus:ring-blue-500 focus:border-transparent dark:border-blue-200 dark:bg-blue-50 dark:focus:ring-blue-400',
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
            
            <EventHorizonLogo />

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-1">{t('unifiedLoginWelcome')}</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">{t('unifiedLoginPrompt')}</p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type={inputType}
                    value={code}
                    onChange={handleCodeChange}
                    placeholder={t('loginCodePlaceholder')}
                    className={`w-full p-4 border-2 rounded-lg text-center text-xl tracking-widest focus:ring-2 transition-colors duration-300 text-gray-700 dark:text-gray-900 ${inputClasses}`}
                    aria-label={t('loginCodePlaceholder')}
                    disabled={status === 'checking' || status === 'correct'}
                />
                <button
                    type="submit"
                    disabled={!code.trim() || status === 'checking' || status === 'correct'}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed disabled:transform-none !mt-6"
                >
                    {status === 'checking' || status === 'correct' ? '...' : t('login')}
                </button>
                {status === 'incorrect' && error && (
                    <p className="text-red-500 text-sm mt-2">{error}</p>
                )}
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
