
import React, { useState, useEffect } from 'react';
import { TalkingCard, Hotspot, Student, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewTalkingCardsProps {
    student: Student;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewTalkingCards: React.FC<GuardianViewTalkingCardsProps> = ({ student, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t, i18n } = useTranslation();
    const [cards, setCards] = useState<TalkingCard[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCard, setSelectedCard] = useState<TalkingCard | null>(null);

    useEffect(() => {
        const fetchCards = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('talking_cards')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .eq('class', student.class)
                .order('date', { ascending: false });

            if (error) {
                console.error("Error fetching cards:", error);
            } else {
                setCards(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchCards();
    }, [school.id, student.level, student.class]);

    const handleHotspotClick = (label: string) => {
        const utterance = new SpeechSynthesisUtterance(label);
        utterance.lang = i18n.language === 'fr' ? 'fr-FR' : 'ar-SA';
        speechSynthesis.speak(utterance);
    };

    if (selectedCard) {
        return (
            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl w-full relative">
                <div className="relative w-full max-w-2xl mx-auto">
                    <img src={selectedCard.image} alt="Talking Card" className="w-full h-auto rounded-lg" />
                    {selectedCard.hotspots.map((hotspot, index) => (
                        <button
                            key={index}
                            onClick={() => handleHotspotClick(hotspot.label)}
                            className="absolute bg-blue-500/50 border-2 border-white rounded-full animate-pulse focus:animate-none hover:animate-none"
                            style={{
                                left: `${hotspot.box.x * 100}%`,
                                top: `${hotspot.box.y * 100}%`,
                                width: `${hotspot.box.width * 100}%`,
                                height: `${hotspot.box.height * 100}%`,
                            }}
                            aria-label={hotspot.label}
                        />
                    ))}
                </div>
                <div className="mt-4">
                    <BackButton onClick={() => setSelectedCard(null)} />
                </div>
            </div>
        );
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

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                {isLoading ? <p>{t('loading')}...</p> : cards.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {cards.map(card => (
                            <button key={card.id} onClick={() => setSelectedCard(card)} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden transform hover:scale-105 transition-transform">
                                <img src={card.image} alt={`Card ${card.id}`} className="w-full h-32 object-cover" />
                                <p className="p-2 text-center text-sm font-semibold text-gray-700 dark:text-gray-200">
                                    {t('card')} {new Date(card.date).toLocaleDateString()}
                                </p>
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noTalkingCards')}</p>
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

export default GuardianViewTalkingCards;
