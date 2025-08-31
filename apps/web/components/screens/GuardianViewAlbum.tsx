import React from 'react';
import { AlbumPhoto, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewAlbumProps {
    school: School;
    photos: AlbumPhoto[];
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewAlbum: React.FC<GuardianViewAlbumProps> = ({ school, photos, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const sortedPhotos = [...photos].sort((a, b) => b.date.getTime() - a.date.getTime());

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
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('classAlbum')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-6 p-2 bg-gray-50 rounded-lg">
                {sortedPhotos.length > 0 ? (
                    sortedPhotos.map(photo => (
                        <div key={photo.id} className="bg-white p-3 rounded-lg shadow-md overflow-hidden">
                            <img src={photo.image} alt={photo.caption} className="w-full h-auto object-cover rounded-lg shadow-sm mb-3" />
                            <p className="text-gray-800 text-center font-semibold">{photo.caption}</p>
                             <p className="text-xs text-gray-400 mt-1 text-center">{new Date(photo.date).toLocaleDateString()}</p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noPhotos')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewAlbum;