
import React, { useState } from 'react';
import { Student } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianRequestInterviewProps {
    student: Student;
    onRequest: () => void;
    onBack: () => void;
    onLogout: () => void;
}

const GuardianRequestInterview: React.FC<GuardianRequestInterviewProps> = ({ student, onRequest, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [isSent, setIsSent] = useState(false);

    const handleRequest = () => {
        onRequest();
        setIsSent(true);
    };

    if (isSent) {
        return (
             <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-green-500 animate-fade-in">
                <div className="text-6xl mb-4">✅</div>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">{t('requestSent')}</h1>
                <p className="text-gray-600 text-lg">سيتم التواصل معكم من طرف الإدارة قريبا.</p>
                <div className="mt-8 w-1/2 mx-auto">
                   <BackButton onClick={onBack} />
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('requestInterview')}</h1>
            
            <div className="text-center p-6 bg-gray-50 rounded-lg">
                <p className="text-lg text-gray-700 mb-6">{t('requestInterviewPrompt')}</p>
                 <button 
                    onClick={handleRequest}
                    className="w-full max-w-sm mx-auto bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg text-lg"
                >
                    {t('confirmRequestInterview')}
                </button>
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianRequestInterview;
