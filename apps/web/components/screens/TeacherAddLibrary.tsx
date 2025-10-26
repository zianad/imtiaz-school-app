

import React, { useState, useRef } from 'react';
import { LibraryItem, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherAddLibraryProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    libraryItems: LibraryItem[];
    onSave: (item: Omit<LibraryItem, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherAddLibrary: React.FC<TeacherAddLibraryProps> = ({ school, toggleDarkMode, isDarkMode, libraryItems, onSave, onDelete, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const resetForm = () => {
        setTitle('');
        setDescription('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    }

    const handleSave = () => {
        if (title.trim() && file) {
            const fileData = { name: file.name, url: URL.createObjectURL(file) };
            onSave({ title, description, file: fileData });
            resetForm();
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('digitalLibrary')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addBook')}</h2>
                <input type="text" placeholder={t('bookTitle')} value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required/>
                <textarea placeholder={t('bookDescription')} value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                
                <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    {file ? `✔️ ${file.name}` : `📚 ${t('uploadBook')}`}
                </button>
                
                <button onClick={handleSave} disabled={!title || !file} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400">
                    {t('addBook')}
                </button>
            </div>
            
             <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('digitalLibrary')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {libraryItems.length > 0 ? (
                        [...libraryItems].sort((a,b) => b.id-a.id).map(item => (
                             <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</span>
                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm flex-shrink-0">
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noBooks')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherAddLibrary;
