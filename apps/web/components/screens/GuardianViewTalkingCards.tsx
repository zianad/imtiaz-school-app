
import React, { useState } from 'react';
import { TalkingCard, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewTalkingCardsProps {
    school: School;
    cards: TalkingCard[];
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewTalkingCards: React.FC<GuardianViewTalkingCardsProps> = ({ school, cards, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    // FIX: Destructure i18n from useTranslation to correctly access the language property.
    const { t, i18n } = useTranslation();
    const [selectedCard, setSelectedCard] = useState<TalkingCard | null>(null);

    const sortedCards = [...cards].sort((a, b) => b.date.getTime() - a.date.getTime());

    const handleHotspotClick = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = i18n.language === 'fr' ? 'fr-FR' : 'ar-SA';
        speechSynthesis.speak(utterance);
    };

    if (selectedCard) {
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
                 <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4 text-center">{t('talkingCards')}</h1>
                 <div className="relative w-full max-w-lg mx-auto" style={{ aspectRatio: '4 / 3' }}>
                    <img src={selectedCard.image} alt="Interactive Card" className="rounded-lg shadow-lg w-full h-full object-contain" />
                    {selectedCard.hotspots.map((hotspot, index) => (
                        <button
                            key={index}
                            onClick={() => handleHotspotClick(hotspot.label)}
                            aria-label={hotspot.label}
                            className="absolute bg-black/10 hover:bg-black/20 rounded-md border-2 border-dashed border-white/50 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:border-solid"
                            style={{
                                left: `${hotspot.box.x * 100}%`,
                                top: `${hotspot.box.y * 100}%`,
                                width: `${hotspot.box.width * 100}%`,
                                height: `${hotspot.box.height * 100}%`,
                            }}
                        />
                    ))}
                 </div>
                 <div className="mt-8">
                    <button onClick={() => setSelectedCard(null)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                        {t('back')}
                    </button>
                </div>
            </div>
        )
    }

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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('talkingCards')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                {sortedCards.length > 0 ? (
                    sortedCards.map(card => (
                        <button 
                            key={card.id} 
                            onClick={() => setSelectedCard(card)}
                            className="w-full aspect-square bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                        >
                            <img src={card.image} alt="Card thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </button>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 dark:text-gray-400 py-10">{t('noTalkingCards')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewTalkingCards;