
import React, { useState, useEffect } from 'react';
import { AlbumPhoto, School, Student } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewAlbumProps {
    school: School;
    student: Student;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewAlbum: React.FC<GuardianViewAlbumProps> = ({ school, student, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedPhoto, setSelectedPhoto] = useState<AlbumPhoto | null>(null);

    useEffect(() => {
        const fetchPhotos = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('album_photos')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .eq('class', student.class)
                .eq('status', 'approved')
                .order('date', { ascending: false });

            if (error) console.error("Error fetching album photos:", error);
            else setPhotos(snakeToCamelCase(data));
            setIsLoading(false);
        };
        fetchPhotos();
    }, [school.id, student.level, student.class]);
    
    const sortedPhotos = photos;

    const renderModal = () => {
        if (!selectedPhoto) return null;
        return (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedPhoto(null)}>
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl w-full max-w-3xl p-4 relative" onClick={e => e.stopPropagation()}>
                    <img src={selectedPhoto.image} alt={selectedPhoto.caption} className="max-h-[80vh] w-full object-contain rounded-md" />
                    <p className="text-center text-white dark:text-gray-200 mt-3 bg-black/50 p-2 rounded-md">{selectedPhoto.caption}</p>
                    <button onClick={() => setSelectedPhoto(null)} className="absolute top-2 right-2 bg-white/50 hover:bg-white rounded-full p-2 text-black">
                        &times;
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-purple-600 dark:border-purple-500 animate-fade-in w-full relative">
            {renderModal()}
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
            
            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? <p>{t('loading')}...</p> : sortedPhotos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortedPhotos.map((photo) => (
                           <div key={photo.id} className="relative group cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                                <img src={photo.image} alt={photo.caption} className="aspect-square w-full h-full object-cover rounded-lg shadow-md group-hover:opacity-75 transition-opacity" />
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end p-2 rounded-lg">
                                    <p className="text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity truncate">{photo.caption}</p>
                                </div>
                           </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noPhotos')}</p>
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

export default GuardianViewAlbum;