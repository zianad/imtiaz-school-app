
import React, { useState, useRef, useEffect } from 'react';
import { MemorizationItem, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherManageMemorizationProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    items: MemorizationItem[];
    onSave: (item: { title: string; contentText?: string; audioBase64?: string; domain: string; }) => void;
    onDelete: (id: number) => void;
    onExtractText: (image: string) => Promise<string>;
    onBack: () => void;
    onLogout: () => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});


const TeacherManageMemorization: React.FC<TeacherManageMemorizationProps> = ({ school, toggleDarkMode, isDarkMode, items, onSave, onDelete, onExtractText, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'text' | 'image' | 'audio'>('text');
    
    const [title, setTitle] = useState('');
    const [contentText, setContentText] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [isRecording, setIsRecording] = useState(false);
    const [audioBase64, setAudioBase64] = useState<string | null>(null);
    const [domain, setDomain] = useState('');

    const [isLoadingOcr, setIsLoadingOcr] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    useEffect(() => {
        // Cleanup media recorder resources if component unmounts
        return () => {
            if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                mediaRecorder.current.stop();
            }
        };
    }, []);

    const resetForm = () => {
        setTitle('');
        setContentText('');
        setImageFile(null);
        setImagePreview(null);
        setAudioBase64(null);
        setDomain('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = () => {
        if (!title.trim()) {
            alert(t('fillAllFields'));
            return;
        }

        if (activeTab === 'text' && !contentText.trim()) {
             alert(t('fillAllFields'));
            return;
        }
        if (activeTab === 'image' && !contentText.trim()) {
             alert(t('fillAllFields'));
            return;
        }
        if (activeTab === 'audio' && !audioBase64) {
             alert(t('fillAllFields'));
            return;
        }

        onSave({ title, contentText: contentText || undefined, audioBase64: audioBase64 || undefined, domain });
        resetForm();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const base64 = await fileToBase64(file);
            setImagePreview(base64);
            setIsLoadingOcr(true);
            try {
                const text = await onExtractText(base64);
                setContentText(text);
            } catch (error) {
                console.error(error);
                alert('Failed to extract text from image.');
            } finally {
                setIsLoadingOcr(false);
            }
        }
    };
    
    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);
                mediaRecorder.current.ondataavailable = (event) => audioChunks.current.push(event.data);
                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => {
                        setAudioBase64(reader.result as string);
                    };
                    audioChunks.current = [];
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.current.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error accessing microphone:", err);
                alert("Could not access the microphone. Please check permissions.");
            }
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-teal-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('memorizationHelper')}</h1>

            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addMemorizationItem')}</h2>
                
                <div className="flex justify-center border-b-2 dark:border-gray-600">
                    <button onClick={() => setActiveTab('text')} className={`px-4 py-2 font-semibold ${activeTab === 'text' ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>{t('addByText')}</button>
                    <button onClick={() => setActiveTab('image')} className={`px-4 py-2 font-semibold ${activeTab === 'image' ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>{t('addByImage')}</button>
                    <button onClick={() => setActiveTab('audio')} className={`px-4 py-2 font-semibold ${activeTab === 'audio' ? 'border-b-2 border-teal-500 text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'}`}>{t('addByAudio')}</button>
                </div>

                <input type="text" placeholder={t('memorizationItemTitle')} value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" required/>
                 <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder={t('contentDomainOptional')}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />

                {activeTab === 'text' && (
                    <textarea placeholder={t('contentText')} value={contentText} onChange={e => setContentText(e.target.value)} rows={5} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                )}

                {activeTab === 'image' && (
                    <div className="space-y-3 text-center">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 p-3 rounded-lg dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">📎 {t('uploadPhoto')}</button>
                        {imagePreview && <img src={imagePreview} alt="preview" className="max-h-40 mx-auto rounded-lg" />}
                        {isLoadingOcr ? <p className="dark:text-gray-300">{t('extractingTextFromImage')}</p> : <textarea value={contentText} onChange={e => setContentText(e.target.value)} rows={5} className="w-full p-3 border-2 border-gray-300 rounded-lg mt-2 bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />}
                    </div>
                )}
                
                {activeTab === 'audio' && (
                    <div className="space-y-3 text-center">
                        <button onClick={isRecording ? stopRecording : startRecording} className={`w-full p-3 rounded-lg font-bold text-white ${isRecording ? 'bg-red-500' : 'bg-green-500'}`}>
                            {isRecording ? t('stopRecording') : t('recordAudio')}
                        </button>
                        {audioBase64 && (
                            <div>
                                <p className="text-sm font-semibold mb-2 dark:text-gray-300">{t('listenToRecording')}</p>
                                <audio src={audioBase64} controls className="w-full" />
                            </div>
                        )}
                    </div>
                )}

                <button onClick={handleSave} className="w-full bg-teal-600 text-white font-bold py-3 rounded-lg hover:bg-teal-700 shadow-lg">{t('saveItem')}</button>
                {saveSuccess && <p className="text-green-600 dark:text-green-400 text-center font-semibold animate-pulse">{t('itemSaved')}</p>}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('memorizationHelper')}</h2>
                 <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {items.length > 0 ? (
                        [...items].sort((a,b) => b.id - a.id).map(item => (
                            <div key={item.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{item.title}</span>
                                <button onClick={() => onDelete(item.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm">{t('delete')}</button>
                            </div>
                        ))
                    ) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noMemorizationItems')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherManageMemorization;
