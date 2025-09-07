
import React, { useState, useEffect } from 'react';
import { AlbumPhoto, Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewAlbumProps {
    student: Student;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewAlbum: React.FC<GuardianViewAlbumProps> = ({ student, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [photos, setPhotos] = useState<AlbumPhoto[]>([]);
    const [isLoading, setIsLoading] = useState(true);

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

            if (error) {
                console.error("Error fetching photos:", error);
            } else {
                setPhotos(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchPhotos();
    }, [school.id, student.level, student.class]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-purple-600 dark:border-purple-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('classAlbum')}</h1>
            
            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? <p>{t('loading')}...</p> : photos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {photos.map(photo => (
                            <div key={photo.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                <img src={photo.image} alt={photo.caption} className="w-full h-auto rounded-lg shadow-md mb-2" />
                                <p className="text-gray-700 dark:text-gray-300 italic text-center">"{photo.caption}"</p>
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
