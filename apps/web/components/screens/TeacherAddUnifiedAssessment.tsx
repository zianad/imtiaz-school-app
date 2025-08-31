


import React, { useState, useRef } from 'react';
// Fix: Add School import
import { UnifiedAssessment, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
// Fix: Add ThemeSwitcher import
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherAddUnifiedAssessmentProps {
    // Fix: Add school, toggleDarkMode, isDarkMode props
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    assessments: UnifiedAssessment[];
    onSave: (title: string, data: { image?: string; pdf?: { name: string; url: string } }) => void;
    onDelete: (assessment: UnifiedAssessment) => void;
    onBack: () => void;
    onLogout: () => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const TeacherAddUnifiedAssessment: React.FC<TeacherAddUnifiedAssessmentProps> = ({ school, toggleDarkMode, isDarkMode, assessments, onSave, onDelete, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setTitle('');
        setSelectedFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result as string);
                reader.readAsDataURL(file);
            } else {
                setPreview(file.name);
            }
        }
    };

    const handleSave = async () => {
        if (!title.trim() || !selectedFile) {
            alert(t('fillAllFields'));
            return;
        }

        let data: { image?: string; pdf?: { name: string; url: string } } = {};
        if (selectedFile.type.startsWith('image/')) {
            data.image = await fileToBase64(selectedFile);
        } else if (selectedFile.type === 'application/pdf') {
            data.pdf = { name: selectedFile.name, url: URL.createObjectURL(selectedFile) };
        }
        
        onSave(title, data);
        resetForm();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleDeleteClick = (assessment: UnifiedAssessment) => {
        onDelete(assessment);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('unifiedAssessments')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                 <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addUnifiedAssessment')}</h2>
                <input
                    type="text"
                    placeholder={t('assessmentTitle')}
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                {preview && (
                    <div className="w-full p-2 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                        {selectedFile?.type.startsWith('image/') ? (
                            <img src={preview} alt="Preview" className="max-h-60 mx-auto rounded-lg" />
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 font-semibold p-4">{preview}</p>
                        )}
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    📎 {t('attachFile')}
                </button>
                <button onClick={handleSave} disabled={!title || !selectedFile} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-lg disabled:bg-gray-400">
                    {t('add')}
                </button>
                {saveSuccess && <p className="text-green-600 dark:text-green-400 text-center font-semibold animate-pulse">{t('saveSuccess')}</p>}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('unifiedAssessments')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {assessments.length > 0 ? (
                        [...assessments].sort((a,b) => b.id-a.id).map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</span>
                                <button onClick={() => handleDeleteClick(item)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm flex-shrink-0">
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noAssessments')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherAddUnifiedAssessment;
