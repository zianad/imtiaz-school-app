import React, { useState, useEffect } from 'react';
import { Note, Absence, Student, School, Subject } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewNotesProps {
    student: Student;
    school: School;
    subject: Subject | null;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewNotes: React.FC<GuardianViewNotesProps> = ({ student, school, subject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [notes, setNotes] = useState<Note[]>([]);
    const [absences, setAbsences] = useState<Absence[]>([]);
    const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
        const fetchNotesAndAbsences = async () => {
            if (!subject) return;
            setIsLoading(true);

            const { data: notesData, error: notesError } = await supabase
                .from('notes')
                .select('*')
                .eq('school_id', school.id)
                .eq('subject', subject)
                .eq('level', student.level)
                .eq('status', 'approved')
                .contains('student_ids', [student.id])
                .order('date', { ascending: false });

            if (notesError) console.error("Error fetching notes:", notesError);
            else setNotes(snakeToCamelCase(notesData));

            const { data: absencesData, error: absencesError } = await supabase
                .from('absences')
                .select('*')
                .eq('school_id', school.id)
                .eq('subject', subject)
                .eq('student_id', student.id)
                .order('date', { ascending: false });
            
            if (absencesError) console.error("Error fetching absences:", absencesError);
            else setAbsences(snakeToCamelCase(absencesData));

            setIsLoading(false);
        };

        fetchNotesAndAbsences();
    }, [school.id, student.id, student.level, subject]);

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
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('guardianNotesTitle')}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto">
                 {isLoading ? (
                    <div className="md:col-span-2 text-center p-10">{t('loading' as any)}...</div>
                 ): (
                    <>
                        {/* Notes Column */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 text-center mb-3">{t('notes')}</h2>
                            <div className="space-y-3">
                                {notes.length > 0 ? notes.map(note => (
                                    <div key={note.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm border-r-4 border-yellow-400 dark:border-yellow-500">
                                        {note.type === 'ai_report' && <p className="text-xs font-bold text-blue-600 dark:text-blue-400">{t('aiGeneratedNote')}</p>}
                                        <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{note.observation}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-left">{new Date(note.date).toLocaleString()}</p>
                                    </div>
                                )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">لا توجد ملاحظات.</p>}
                            </div>
                        </div>

                        {/* Absences Column */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg">
                            <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 text-center mb-3">الغيابات</h2>
                            <div className="space-y-2">
                                {absences.length > 0 ? absences.map(absence => (
                                    <div key={absence.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center text-sm">
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">{t(absence.subject as any)}</span>
                                        <span className="text-gray-500 dark:text-gray-400">{new Date(absence.date).toLocaleDateString()}</span>
                                    </div>
                                )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">لا توجد غيابات مسجلة.</p>}
                            </div>
                        </div>
                    </>
                 )}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewNotes;