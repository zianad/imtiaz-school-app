import React, { useState, useEffect } from 'react';
import { LibraryItem, School, Student, Subject } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewLibraryProps {
    school: School;
    student: Student;
    subject: Subject | null;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewLibrary: React.FC<GuardianViewLibraryProps> = ({ school, student, subject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [items, setItems] = useState<LibraryItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchItems = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('library_items')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .eq('subject', subject)
                .order('date', { ascending: false });

            if (error) console.error("Error fetching library items:", error);
            else setItems(snakeToCamelCase(data));
            setIsLoading(false);
        };
        fetchItems();
    }, [school.id, student.level, subject]);

    const sortedItems = items;

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('digitalLibrary')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
                {isLoading ? <p>{t('loading')}...</p> : sortedItems.length > 0 ? (
                    sortedItems.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                           <div className="flex justify-between items-center gap-4">
                               <div className="flex-grow">
                                    <h2 className="font-bold text-lg text-blue-700">{item.title}</h2>
                                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                               </div>
                               <a 
                                    href={item.file.url} 
                                    download={item.file.name}
                                    className="bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition shadow-md flex-shrink-0"
                                >
                                    {t('download')}
                                </a>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noBooks')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewLibrary;