
import React from 'react';
import { AlbumPhoto } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

interface GuardianViewAlbumProps {
    photos: AlbumPhoto[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewAlbum: React.FC<GuardianViewAlbumProps> = ({ photos, onBack, onLogout }) => {
    const { t } = useTranslation();
    const sortedPhotos = [...photos].sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
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
