
import React from 'react';
import { AlbumPhoto } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

interface PrincipalReviewAlbumProps {
    pendingPhotos: AlbumPhoto[];
    onApprove: (photoId: number) => void;
    onReject: (photoId: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalReviewAlbum: React.FC<PrincipalReviewAlbumProps> = ({ pendingPhotos, onApprove, onReject, onBack, onLogout }) => {
    const { t } = useTranslation();
    
    const sortedPhotos = [...pendingPhotos].sort((a,b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-fuchsia-600 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher/>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('reviewAlbumPhotos')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-100 border-2 border-dashed border-gray-200 rounded-lg p-4">
                {sortedPhotos.length > 0 ? (
                    <div className="space-y-4">
                        {sortedPhotos.map((photo) => (
                            <div key={photo.id} className="bg-white p-4 rounded-lg shadow-md border-r-4 border-yellow-400">
                                <div className="mb-3 border-b pb-2">
                                     <p className="text-sm text-gray-500">{new Date(photo.date).toLocaleString('ar-DZ')}</p>
                                     <p className="font-semibold text-gray-700">القسم: <span className="font-normal">{photo.level} - {photo.class}</span></p>
                                </div>
                               
                               <img src={photo.image} alt={photo.caption} className="mb-3 rounded-lg max-w-full h-auto shadow-sm" />
                               <p className="text-gray-800 whitespace-pre-wrap mb-4 text-center italic">"{photo.caption}"</p>
                                

                                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
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
                        <p className="text-gray-500 text-lg">{t('noPhotosToReview')}</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalReviewAlbum;