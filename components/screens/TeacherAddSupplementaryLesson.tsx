
import React, { useState } from 'react';
import { SupplementaryLesson } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface TeacherAddSupplementaryLessonProps {
    lessons: SupplementaryLesson[];
    onSave: (title: string, externalLink: string) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherAddSupplementaryLesson: React.FC<TeacherAddSupplementaryLessonProps> = ({ lessons, onSave, onDelete, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [externalLink, setExternalLink] = useState('');

    const handleSave = () => {
        if (title.trim() && externalLink.trim()) {
            try {
                // Basic URL validation
                new URL(externalLink);
                onSave(title, externalLink);
                setTitle('');
                setExternalLink('');
            } catch (_) {
                alert('الرجاء إدخال رابط صحيح.');
            }
        } else {
            alert(t('fillAllFields'));
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('supplementaryLessons')}</h1>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 text-center">{t('addSupplementaryLesson')}</h2>
                <input
                    type="text"
                    placeholder={t('lessonTitle')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                />
                <input
                    type="url"
                    placeholder={t('externalLink')}
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg"
                />
                <button onClick={handleSave} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                    {t('addLink')}
                </button>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center border-t pt-4">{t('supplementaryLessons')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {lessons.length > 0 ? (
                        [...lessons].sort((a, b) => b.id - a.id).map(lesson => (
                            <div key={lesson.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <a href={lesson.externalLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex-grow truncate">
                                    {lesson.title}
                                </a>
                                <button onClick={() => onDelete(lesson.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm flex-shrink-0">
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-4">{t('noLessons')}</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherAddSupplementaryLesson;
