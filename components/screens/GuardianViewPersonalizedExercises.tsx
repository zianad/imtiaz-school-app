
import React from 'react';
import { PersonalizedExercise } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';
import ReactMarkdown from 'https://esm.sh/react-markdown@9';

interface GuardianViewPersonalizedExercisesProps {
    exercises: PersonalizedExercise[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewPersonalizedExercises: React.FC<GuardianViewPersonalizedExercisesProps> = ({ exercises, onBack, onLogout }) => {
    const { t } = useTranslation();
    const sortedExercises = [...exercises].sort((a,b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('personalizedExercises')}</h1>
            
            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 border-2 border-dashed rounded-lg p-4 space-y-4">
                {sortedExercises.length > 0 ? (
                    sortedExercises.map(exercise => (
                        <div key={exercise.id} className="bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-400">
                             <p className="text-sm text-gray-500 mb-2">{new Date(exercise.date).toLocaleDateString()}</p>
                             <div className="prose prose-sm max-w-none">
                                <ReactMarkdown>{exercise.content}</ReactMarkdown>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">{t('noPersonalizedExercises')}</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewPersonalizedExercises;
