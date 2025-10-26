
import React, { useState, useRef } from 'react';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianSubmitComplaintProps {
    onSubmit: (content: string, file?: { image?: string; pdf?: { name: string; url: string; } }) => void;
    onBack: () => void;
    onLogout: () => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const GuardianSubmitComplaint: React.FC<GuardianSubmitComplaintProps> = ({ onSubmit, onBack, onLogout }) => {
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
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('submitComplaintOrSuggestion')}</h1>
            
            <div className="space-y-4">
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('complaintContent')} rows={8} className="w-full p-3 border-2 rounded-lg" />
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