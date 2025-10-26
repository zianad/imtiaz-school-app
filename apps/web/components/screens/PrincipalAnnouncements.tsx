import React, { useState, useRef, useEffect } from 'react';
import { Announcement, Teacher, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalAnnouncementsProps {
    school: School;
    announcements: Announcement[];
    teachers: Teacher[];
    onAddAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const PrincipalAnnouncements: React.FC<PrincipalAnnouncementsProps> = ({ school, announcements, teachers, onAddAnnouncement, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [targetAudience, setTargetAudience] = useState<'guardians' | 'teachers'>('guardians');
    const [selectedTeacherIds, setSelectedTeacherIds] = useState<string[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (targetAudience === 'guardians') {
            setSelectedTeacherIds([]);
        }
    }, [targetAudience]);

    const handleSelectAllTeachers = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            setSelectedTeacherIds(teachers.map(t => t.id));
        } else {
            setSelectedTeacherIds([]);
        }
    };
    
    const handleTeacherSelect = (teacherId: string) => {
        setSelectedTeacherIds(prev =>
            prev.includes(teacherId)
                ? prev.filter(id => id !== teacherId)
                : [...prev, teacherId]
        );
    };

    const handleSave = async () => {
        if (!content.trim()) {
            alert(t('fillAllFields'));
            return;
        }
        if (targetAudience === 'teachers' && selectedTeacherIds.length === 0) {
            alert('الرجاء اختيار أستاذ واحد على الأقل أو تحديد الجميع.');
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
        
        const announcementData: Omit<Announcement, 'id' | 'date'> = {
            content,
            targetAudience,
            ...fileData,
        };
        
        if (targetAudience === 'teachers') {
            announcementData.teacherIds = selectedTeacherIds;
        }

        onAddAnnouncement(announcementData);
        setContent('');
        setFile(null);
        setSelectedTeacherIds([]);
        if (fileInputRef.current) fileInputRef.current.value = '';
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('announcements')}</h1>
            
            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <textarea value={content} onChange={e => setContent(e.target.value)} placeholder={t('announcementContent')} rows={5} className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    {file ? `✔️ ${file.name}` : `📎 ${t('attachFile')}`}
                </button>
                <input type="file" ref={fileInputRef} onChange={e => setFile(e.target.files?.[0] || null)} accept="image/*,.pdf" className="hidden" />
                
                <div className="space-y-2">
                    <label className="font-semibold block text-gray-700 dark:text-gray-300">{t('targetAudience')}:</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input type="radio" value="guardians" checked={targetAudience === 'guardians'} onChange={() => setTargetAudience('guardians')} className="w-5 h-5 text-blue-600" />
                            {t('guardians')}
                        </label>
                        <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                            <input type="radio" value="teachers" checked={targetAudience === 'teachers'} onChange={() => setTargetAudience('teachers')} className="w-5 h-5 text-blue-600" />
                            {t('teachers')}
                        </label>
                    </div>
                </div>

                {targetAudience === 'teachers' && (
                    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed dark:border-gray-600">
                        <h3 className="font-semibold mb-2 text-gray-700 dark:text-gray-200">{t('selectTeachers')}:</h3>
                        <div className="flex items-center mb-2 pb-2 border-b dark:border-gray-600">
                            <input
                                type="checkbox"
                                id="select-all-teachers"
                                checked={teachers.length > 0 && selectedTeacherIds.length === teachers.length}
                                onChange={handleSelectAllTeachers}
                                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                            />
                            <label htmlFor="select-all-teachers" className="mr-2 font-bold text-gray-800 dark:text-gray-200">{t('all')}</label>
                        </div>
                        <div className="max-h-32 overflow-y-auto grid grid-cols-2 gap-2">
                            {teachers.map(teacher => (
                                <div key={teacher.id} className="flex items-center p-1 bg-white dark:bg-gray-600 rounded-md">
                                     <input
                                        type="checkbox"
                                        id={`teacher-${teacher.id}`}
                                        checked={selectedTeacherIds.includes(teacher.id)}
                                        onChange={() => handleTeacherSelect(teacher.id)}
                                        className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                    />
                                    <label htmlFor={`teacher-${teacher.id}`} className="mr-2 text-sm text-gray-700 dark:text-gray-200">{teacher.name}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                <button onClick={handleSave} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">{t('sendAnnouncement')}</button>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('sentAnnouncements')}</h2>
                <div className="max-h-60 overflow-y-auto space-y-2 p-2">
                    {announcements.length > 0 ? announcements.map(ann => (
                        <div key={ann.id} className="bg-white dark:bg-gray-700 p-3 rounded-lg shadow-sm">
                            <p className="truncate text-gray-800 dark:text-gray-200">{ann.content}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">To: {t(ann.targetAudience)}</p>
                        </div>
                    )) : <p className="text-center text-gray-500 dark:text-gray-400">{t('noAnnouncements')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <div className="w-1/2">
                    <BackButton onClick={onBack} />
                </div>
                <div className="w-1/2">
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default PrincipalAnnouncements;