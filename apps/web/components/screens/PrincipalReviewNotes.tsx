import React from 'react';
import { Note, Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface PrincipalReviewNotesProps {
    school: School;
    notes: Note[];
    students: Student[];
    onApprove: (noteId: number) => void;
    onReject: (noteId: number) => void;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalReviewNotes: React.FC<PrincipalReviewNotesProps> = ({ school, notes, students, onApprove, onReject, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();

    const getStudentNames = (studentIds: string[]): string => {
        return studentIds
            .map(id => students.find(s => s.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };
    
    const sortedNotes = [...notes].sort((a,b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in w-full relative">
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
                {sortedNotes.length > 0 ? (
                    <div className="space-y-4">
                        {sortedNotes.map((note) => (
                            <div key={note.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-r-4 border-yellow-400 dark:border-yellow-500">
                                <div className="mb-3 border-b dark:border-gray-700 pb-2">
                                     <div className="flex justify-between items-center mb-1">
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(note.date).toLocaleString('ar-DZ')}</p>
                                        {note.type === 'ai_report' && (
                                            <span className="text-xs font-bold bg-blue-100 text-blue-800 px-2 py-1 rounded-full dark:bg-blue-900 dark:text-blue-200">
                                                {t('aiGeneratedNote')}
                                            </span>
                                        )}
                                     </div>
                                     <p className="font-semibold text-gray-700 dark:text-gray-300">التلاميذ: <span className="font-normal">{getStudentNames(note.studentIds)}</span></p>
                                     <p className="font-semibold text-gray-700 dark:text-gray-300">المادة: <span className="font-normal">{note.subject}</span></p>
                                </div>
                               
                                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-4">{note.observation}</p>
                                
                                {note.image && <img src={note.image} alt="ملحق" className="mb-3 rounded-lg max-w-full h-auto shadow-sm" />}
                                {note.pdf && (
                                    <a href={note.pdf.url} download={note.pdf.name} className="block text-center mb-3 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                                        عرض المرفق PDF: {note.pdf.name}
                                    </a>
                                )}
                                {note.externalLink && (
                                     <a href={note.externalLink} target="_blank" rel="noopener noreferrer" className="block text-center mb-3 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                                        🔗 معاينة الرابط الخارجي
                                    </a>
                                )}

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                                    <button 
                                        onClick={() => onApprove(note.id)}
                                        className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition shadow-md"
                                    >
                                        قبول
                                    </button>
                                    <button 
                                        onClick={() => onReject(note.id)}
                                        className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition shadow-md"
                                    >
                                        رفض
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
