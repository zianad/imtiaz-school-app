import React from 'react';
import { useTranslation } from '../../../../packages/core/i18n';
import { SearchResult, Student, Teacher, Announcement, Summary, Exercise } from '../../../../packages/core/types';

interface SearchResultModalProps {
    result: SearchResult;
    onClose: () => void;
    isDarkMode: boolean;
}

const DetailRow: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode }> = ({ label, value, children }) => (
    <div className="py-2 border-b border-gray-200 dark:border-gray-600">
        <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">{label}</p>
        {value && <p className="text-gray-800 dark:text-gray-100">{value}</p>}
        {children}
    </div>
);


const SearchResultModal: React.FC<SearchResultModalProps> = ({ result, onClose, isDarkMode }) => {
    const { t } = useTranslation();

    const renderContent = () => {
        const data = result.data;
        switch (result.type) {
            case 'student':
                const student = data as Student;
                return (
                    <>
                        <DetailRow label={t('studentName')} value={student.name} />
                        <DetailRow label={t('level')} value={student.level} />
                        <DetailRow label={t('class')} value={student.class} />
                        <DetailRow label={t('guardianCode')} value={student.guardianCode} />
                    </>
                );
            case 'teacher':
                const teacher = data as Teacher;
                return (
                    <>
                        <DetailRow label={t('teacherName')} value={teacher.name} />
                        <DetailRow label={t('subject')} value={teacher.subjects.map(s => t(s as any)).join(', ')} />
                        <DetailRow label={t('loginCode')} value={teacher.loginCode} />
                    </>
                );
            case 'announcement':
                const announcement = data as Announcement;
                return (
                    <>
                        <DetailRow label={t('date' as any)} value={new Date(announcement.date).toLocaleString()} />
                        <DetailRow label={t('content' as any)}>
                            <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{announcement.content}</p>
                        </DetailRow>
                    </>
                );
            case 'summary':
                const summary = data as Summary;
                return (
                     <>
                        <DetailRow label={t('subject')} value={t(summary.subject as any)} />
                        <DetailRow label={t('level')} value={`${summary.level} - ${summary.class}`} />
                        <DetailRow label={t('content' as any)}>
                            <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{summary.content}</p>
                        </DetailRow>
                    </>
                );
            case 'exercise':
                 const exercise = data as Exercise;
                return (
                     <>
                        <DetailRow label={t('subject')} value={t(exercise.subject as any)} />
                        <DetailRow label={t('level')} value={`${exercise.level} - ${exercise.class}`} />
                        <DetailRow label={t('content' as any)}>
                            <p className="text-gray-800 dark:text-gray-100 whitespace-pre-wrap">{exercise.content}</p>
                        </DetailRow>
                    </>
                );
            default:
                return <p>Details not available.</p>;
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
        >
            <div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative transform transition-all scale-95"
                style={{ animation: 'scaleUp 0.3s forwards' }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex justify-between items-center pb-3 border-b-2 border-gray-200 dark:border-gray-700">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 flex items-center gap-3">
                        <span className="text-3xl">{result.icon}</span>
                        {result.title}
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                        aria-label={t('close')}
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="mt-4 max-h-[60vh] overflow-y-auto pr-2">
                    {renderContent()}
                </div>
                 <div className="mt-6">
                    <button onClick={onClose} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition">
                        {t('close')}
                    </button>
                </div>
            </div>
             <style>{`
                @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </div>
    );
};

export default SearchResultModal;
