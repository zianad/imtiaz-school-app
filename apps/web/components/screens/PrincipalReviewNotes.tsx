
import React from 'react';
import { Note, Student, School, EducationalStage } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface PrincipalReviewNotesProps {
    school: School;
    stage: EducationalStage;
    notes: Note[];
    students: Student[];
    onApprove: (noteId: number) => void;
    onReject: (noteId: number) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalReviewNotes: React.FC<PrincipalReviewNotesProps> = ({ school, stage, notes, students, onApprove, onReject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();

    const getStudentNames = (studentIds: string[]): string => {
        return studentIds
            .map(id => students.find(s => s.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };
    
    const pendingNotes = notes
      .filter(n => n.status === 'pending' && n.stage === stage)
      .sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-emerald-600 dark:border-emerald-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('reviewNotes')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {pendingNotes.length > 0 ? (
                    <div className="space-y-4">
                        {pendingNotes.map((note) => (
                            <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-r-4 border-yellow-400">
                                <div className="mb-3 border-b dark:border-gray-700 pb-2">
                                     <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(note.date).toLocaleString()}</p>
                                     <p className="font-semibold text-gray-700 dark:text-gray-300">{t('student')}: <span className="font-normal">{getStudentNames(note.studentIds)}</span></p>
                                     <p className="font-semibold text-gray-700 dark:text-gray-300">{t('subject')}: <span className="font-normal">{t(note.subject as any)}</span></p>
                                </div>
                               
                               <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-4">{note.observation}</p>

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                                    <button 
                                        onClick={() => onApprove(note.id)}
                                        className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition shadow-md"
                                    >
                                        {t('approve')}
                                    </button>
                                    <button 
                                        onClick={() => onReject(note.id)}
                                        className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition shadow-md"
                                    >
                                        {t('reject')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">لا توجد ملاحظات في انتظار المراجعة.</p>
                    </div>
                )}
            </div>
            
             <div className="mt-8 flex items-center gap-4">
                <div className="w-1/2">
                    <BackButton onClick={onBack} />
                </div>
                <div className="w-1/2">
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default PrincipalReviewNotes;
