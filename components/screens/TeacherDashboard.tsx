
import React, { useState } from 'react';
import { Subject, Teacher, School } from '../../core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { useTranslation } from '../../core/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { SUBJECT_ICONS } from '../../core/constants';

interface TeacherDashboardProps {
    school: School;
    onSelectionComplete: (level: string, subject: Subject) => void;
    onBack: () => void;
    onLogout: () => void;
    teacher: Teacher;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const TeacherDashboard: React.FC<TeacherDashboardProps> = ({ school, onSelectionComplete, onBack, onLogout, teacher }) => {
    const { t } = useTranslation();
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
        teacher.subjects.length === 1 ? teacher.subjects[0] : null
    );

    const teacherLevels = Object.keys(teacher.assignments);
    const isSelectionComplete = selectedLevel && selectedSubject;

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600 animate-fade-in relative">
             <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-20 h-20 rounded-full object-contain mb-4 mx-auto shadow-sm" />}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t('teacherDashboardTitle')}</h1>
            <h2 className="text-xl text-gray-600 mb-8">{t('teacherSelectLevelAndSubject')}</h2>

            <div className="space-y-8">
                {/* Level Selection */}
                <div>
                    <h3 className="font-bold text-xl text-gray-800 mb-4">{t('level')}</h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {teacherLevels.map(level => (
                            <button
                                key={level}
                                onClick={() => setSelectedLevel(level)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md transform hover:scale-105
                                    ${selectedLevel === level ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                `}
                            >
                                {level}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Subject Selection */}
                {teacher.subjects.length > 1 ? (
                    <div>
                        <h3 className="font-bold text-xl text-gray-800 mb-4">{t('subject')}</h3>
                        <div className="flex flex-wrap justify-center gap-3">
                            {teacher.subjects.map(subject => (
                                <button
                                    key={subject}
                                    onClick={() => setSelectedSubject(subject)}
                                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-200 shadow-md transform hover:scale-105 flex items-center gap-2
                                        ${selectedSubject === subject ? 'bg-blue-600 text-white ring-2 ring-offset-2 ring-blue-500' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                                    `}
                                >
                                    <span>{SUBJECT_ICONS[subject]}</span>
                                    {t(subject as any)}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                     <div>
                        <h3 className="font-bold text-xl text-gray-800 mb-4">{t('subject')}</h3>
                        <div className="p-4 rounded-lg font-bold text-lg bg-blue-100 text-blue-800">
                           {t(teacher.subjects[0] as any)}
                        </div>
                    </div>
                )}
            </div>

            <button
                onClick={() => onSelectionComplete(selectedLevel, selectedSubject!)}
                disabled={!isSelectionComplete}
                className="w-full mt-10 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg disabled:bg-blue-300 disabled:cursor-not-allowed disabled:transform-none transform hover:scale-105"
            >
                {t('next')}
            </button>
            
            <div className="mt-6 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherDashboard;