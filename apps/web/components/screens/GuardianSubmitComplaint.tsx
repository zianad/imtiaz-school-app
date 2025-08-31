import React, { useState, useRef } from 'react';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import { useTranslation } from '../../../../packages/core/i18n';
import { School } from '../../../../packages/core/types';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianSubmitComplaintProps {
    school: School;
    onSubmit: (content: string, file?: { image?: string; pdf?: { name: string; url: string; } }) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const GuardianSubmitComplaint: React.FC<GuardianSubmitComplaintProps> = ({ school, onSubmit, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSubmit = async () => {
        if (!content.trim()) {
            alert(t('fillAllFields'));
            return;
        }
        let fileData: { image?: string; pdf?: { name: string; url: string; } } = {};
        if (file) {
            if (file.type.startsWith('image/')) {
                fileData.image = await fileToBase64(file);
            } else if (file.type === 'application/pdf') {
                fileData.pdf = { name: file.name, url: URL.createObjectURL(file) };
            }
        }
        onSubmit(content, fileData);
    };

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
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('submitComplaintOrSuggestion')}</h1>
            
            <div className="space-y-4">
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('complaintContent')} rows={8} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300">
                    {file ? `✔️ ${file.name}` : `📎 ${t('attachFile')}`}
                </button>
                <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files?.[0] || null)} accept="image/*,.pdf" className="hidden" />
                <button onClick={handleSubmit} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">{t('submit')}</button>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianSubmitComplaint;