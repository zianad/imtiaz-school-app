

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Project, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherAddProjectProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    projects: Project[];
    onSave: (project: Omit<Project, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => void;
    onDelete: (project: Project) => void;
    onBack: () => void;
    onLogout: () => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const TeacherAddProject: React.FC<TeacherAddProjectProps> = ({ school, toggleDarkMode, isDarkMode, projects, onSave, onDelete, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const base64 = await fileToBase64(file);
            setImage(base64);
        }
    };
    
    const openCamera = () => {
        setIsCameraOpen(true);
    };
    
    // Effect to set stream when camera is open
    useEffect(() => {
        if (isCameraOpen && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
                .then(stream => {
                    if (videoRef.current) videoRef.current.srcObject = stream;
                })
                .catch(err => {
                     console.error("Error accessing camera:", err);
                     alert("Could not access the camera.");
                     setIsCameraOpen(false);
                });
        }
         return () => { // Cleanup function
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
            }
        };
    }, [isCameraOpen]);


    const handleCapture = () => {
        const video = videoRef.current;
        if (video) {
            const canvas = document.createElement('canvas');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setImage(dataUrl);
            setIsCameraOpen(false); // Close camera after capture
        }
    };
    
    const handleSave = () => {
        if(title.trim() && description.trim() && image){
            onSave({ title, description, image });
            setTitle('');
            setDescription('');
            setImage(null);
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const handleDeleteClick = (project: Project) => {
        onDelete(project);
    };

    if (isCameraOpen) {
        return (
            <div className="bg-black fixed inset-0 z-50 flex flex-col items-center justify-center p-4">
                <video ref={videoRef} autoPlay playsInline className="w-full h-auto max-w-lg rounded-lg"></video>
                <div className="mt-4 flex gap-4">
                    <button onClick={handleCapture} className="bg-blue-500 text-white font-bold py-3 px-6 rounded-full shadow-lg">{t('capture')}</button>
                    <button onClick={() => setIsCameraOpen(false)} className="bg-gray-300 text-black font-bold py-3 px-6 rounded-full shadow-lg">{t('cancel')}</button>
                </div>
            </div>
        );
    }


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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('unitProject')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addProject')}</h2>
                 <input type="text" placeholder={t('projectTitle')} value={title} onChange={e => setTitle(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                 <textarea placeholder={t('projectDescription')} value={description} onChange={e => setDescription(e.target.value)} rows={4} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                
                {image && <div className="p-2 border-2 border-dashed dark:border-gray-600 rounded-lg"><img src={image} alt="Preview" className="max-h-48 mx-auto rounded"/></div>}
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <div className="flex gap-2">
                     <button onClick={() => fileInputRef.current?.click()} className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                        📎 {t('uploadPhoto')}
                    </button>
                    <button onClick={openCamera} className="flex-1 bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                        📸 {t('takePhoto')}
                    </button>
                </div>
                <button onClick={handleSave} disabled={!title || !description || !image} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400">
                    {t('add')}
                </button>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('unitProject')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    {projects.length > 0 ? (
                        [...projects].sort((a, b) => b.id - a.id).map(project => (
                            <div key={project.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate">{project.title}</span>
                                <button onClick={() => handleDeleteClick(project)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm flex-shrink-0">
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noProjects')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherAddProject;
