
import React, { useState, useRef } from 'react';
import { LibraryItem } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface TeacherAddLibraryProps {
    libraryItems: LibraryItem[];
    onSave: (item: Omit<LibraryItem, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherAddLibrary: React.FC<TeacherAddLibraryProps> = ({ libraryItems, onSave, onDelete, onBack, onLogout }) => {
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
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('digitalLibrary')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 text-center">{t('addBook')}</h2>
                <input type="text" placeholder={t('bookTitle')} value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border-2 rounded-lg" required/>
                <textarea placeholder={t('bookDescription')} value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-3 border-2 rounded-lg" />
                
                <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files?.[0] || null)} accept=".pdf" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition">
                    {file ? `✔️ ${file.name}` : `📚 ${t('uploadBook')}`}
                </button>
                
                <button onClick={handleSave} disabled={!title || !file} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400">
                    {t('addBook')}
                </button>
            </div>
            
             <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center border-t pt-4">{t('digitalLibrary')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {libraryItems.length > 0 ? (
                        [...libraryItems].sort((a,b) => b.id-a.id).map(item => (
                             <div key={item.id} className="bg-white p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <span className="font-semibold text-gray-800 truncate">{item.title}</span>
                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm flex-shrink-0">
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : <p className="text-center text-gray-500 py-4">{t('noBooks')}</p>}
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