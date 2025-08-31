import React from 'react';
import { AlbumPhoto, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalReviewAlbumProps {
    school: School;
    pendingPhotos: AlbumPhoto[];
    onApprove: (photoId: number) => void;
    onReject: (photoId: number) => void;
    onBack: () => void;
    onLogout: () => void;
    isDesktop?: boolean;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalReviewAlbum: React.FC<PrincipalReviewAlbumProps> = ({ school, pendingPhotos, onApprove, onReject, onBack, onLogout, isDesktop = false, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    
    const sortedPhotos = [...pendingPhotos].sort((a,b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-fuchsia-600 dark:border-fuchsia-500 animate-fade-in w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('reviewAlbumPhotos')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-100 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {sortedPhotos.length > 0 ? (
                    <div className="space-y-4">
                        {sortedPhotos.map((photo) => (
                            <div key={photo.id} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border-r-4 border-yellow-400">
                                <div className="mb-3 border-b dark:border-gray-700 pb-2">
                                     <p className="text-sm text-gray-500 dark:text-gray-400">{new Date(photo.date).toLocaleString('ar-DZ')}</p>
                                     <p className="font-semibold text-gray-700 dark:text-gray-300">القسم: <span className="font-normal">{photo.level} - {photo.class}</span></p>
                                </div>
                               
                               <img src={photo.image} alt={photo.caption} className="mb-3 rounded-lg max-w-full h-auto shadow-sm" />
                               <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap mb-4 text-center italic">"{photo.caption}"</p>
                                

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t dark:border-gray-700">
                                    <button 
                                        onClick={() => onApprove(photo.id)}
                                        className="flex-1 bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition shadow-md"
                                    >
                                        {t('approve')}
                                    </button>
                                    <button 
                                        onClick={() => onReject(photo.id)}
                                        className="flex-1 bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition shadow-md"
                                    >
                                        {t('reject')}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noPhotosToReview')}</p>
                    </div>
                )}
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

export default PrincipalReviewAlbum;