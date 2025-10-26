
import React, { useState, useRef } from 'react';
import { AlbumPhoto, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { compressImage } from '../../../../packages/core/utils';

interface TeacherManageAlbumProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    photos: AlbumPhoto[];
    onSave: (image: string, caption: string) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherManageAlbum: React.FC<TeacherManageAlbumProps> = ({ school, toggleDarkMode, isDarkMode, photos, onSave, onDelete, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [caption, setCaption] = useState('');
    const [image, setImage] = useState<string | null>(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            try {
                const compressed = await compressImage(file);
                setImage(compressed);
                setError('');
            } catch (err) {
                setError('Failed to process image.');
                console.error(err);
            }
        }
    };

    const handleSave = () => {
        if (!image || !caption.trim()) {
            alert(t('fillAllFields'));
            return;
        }
        onSave(image, caption);
        setCaption('');
        setImage(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-purple-600 dark:border-purple-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('classAlbum')}</h1>

            <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addPhoto')}</h2>
                {image && (
                    <div className="p-2 border-2 border-dashed dark:border-gray-600 rounded-lg">
                        <img src={image} alt="Preview" className="max-h-60 mx-auto rounded"/>
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    📎 {t('uploadPhoto')}
                </button>
                <textarea
                    placeholder={t('photoCaption')}
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    rows={3}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                />
                <button onClick={handleSave} disabled={!image || !caption.trim()} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg disabled:bg-gray-400">
                    {t('savePhoto')}
                </button>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">الصور المرسلة</h2>
                <div className="max-h-80 overflow-y-auto space-y-2 p-2">
                    {photos.length > 0 ? (
                        [...photos].sort((a, b) => b.id - a.id).map(photo => (
                            <div key={photo.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <img src={photo.image} alt={photo.caption} className="w-12 h-12 object-cover rounded-md"/>
                                    <p className="text-gray-800 dark:text-gray-200 truncate">{photo.caption}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${photo.status === 'approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {t(photo.status as any)}
                                    </span>
                                    <button onClick={() => onDelete(photo.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm">
                                        {t('delete')}
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noPhotos')}</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherManageAlbum;
