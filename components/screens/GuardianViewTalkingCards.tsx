
import React, { useState } from 'react';
import { TalkingCard } from '../../core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { useTranslation } from '../../core/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface GuardianViewTalkingCardsProps {
    cards: TalkingCard[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewTalkingCards: React.FC<GuardianViewTalkingCardsProps> = ({ cards, onBack, onLogout }) => {
    const { t, language } = useTranslation();
    const [selectedCard, setSelectedCard] = useState<TalkingCard | null>(null);

    const sortedCards = [...cards].sort((a, b) => b.date.getTime() - a.date.getTime());

    const handleHotspotClick = (text: string) => {
        // This uses the Web Speech API, which works in modern browsers.
        // For a mobile app (React Native), a library like 'react-native-tts' would be used
        // to access the native Text-to-Speech engine of the device, providing a high-quality, offline-capable voice.
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language === 'fr' ? 'fr-FR' : 'ar-SA';
        speechSynthesis.speak(utterance);
    };

    if (selectedCard) {
        return (
            <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-purple-600 w-full relative">
                 <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
                 <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">{t('talkingCards')}</h1>
                 <div className="relative w-full max-w-lg mx-auto" style={{ aspectRatio: '4 / 3' }}>
                    <img src={selectedCard.image} alt="Interactive Card" className="rounded-lg shadow-lg w-full h-full object-contain" />
                    {selectedCard.hotspots.map((hotspot, index) => (
                        <button
                            key={index}
                            onClick={() => handleHotspotClick(hotspot.label)}
                            aria-label={hotspot.label}
                            className="absolute bg-black/10 hover:bg-black/20 rounded-md border-2 border-dashed border-white/50"
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
                    <button onClick={() => setSelectedCard(null)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition">
                        {t('back')}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-purple-600 w-full relative">
            <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('talkingCards')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto grid grid-cols-2 md:grid-cols-3 gap-4 p-2 bg-gray-50 rounded-lg">
                {sortedCards.length > 0 ? (
                    sortedCards.map(card => (
                        <button 
                            key={card.id} 
                            onClick={() => setSelectedCard(card)}
                            className="w-full aspect-square bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
                        >
                            <img src={card.image} alt="Card thumbnail" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </button>
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500 py-10">{t('noTalkingCards')}</p>
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
