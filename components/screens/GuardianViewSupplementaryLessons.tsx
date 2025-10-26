
import React from 'react';
import { SupplementaryLesson } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewSupplementaryLessonsProps {
    lessons: SupplementaryLesson[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewSupplementaryLessons: React.FC<GuardianViewSupplementaryLessonsProps> = ({ lessons, onBack, onLogout }) => {
    const { t } = useTranslation();

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('supplementaryLessons')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
                {lessons.length > 0 ? (
                    [...lessons].sort((a,b) => b.id - a.id).map(lesson => (
                        <a 
                            key={lesson.id} 
                            href={lesson.externalLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
                        >
                            <p className="font-semibold text-lg text-blue-700">{lesson.title}</p>
                            <p className="text-sm text-gray-500 truncate">{lesson.externalLink}</p>
                        </a>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noLessons')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewSupplementaryLessons;
