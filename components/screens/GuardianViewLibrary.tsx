
import React from 'react';
import { LibraryItem } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewLibraryProps {
    items: LibraryItem[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewLibrary: React.FC<GuardianViewLibraryProps> = ({ items, onBack, onLogout }) => {
    const { t } = useTranslation();
    const sortedItems = [...items].sort((a,b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('digitalLibrary')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
                {sortedItems.length > 0 ? (
                    sortedItems.map(item => (
                        <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                           <div className="flex justify-between items-center gap-4">
                               <div className="flex-grow">
                                    <h2 className="font-bold text-lg text-blue-700">{item.title}</h2>
                                    {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                               </div>
                               <a 
                                    href={item.file.url} 
                                    download={item.file.name}
                                    className="bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition shadow-md flex-shrink-0"
                                >
                                    {t('download')}
                                </a>
                           </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noBooks')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewLibrary;
