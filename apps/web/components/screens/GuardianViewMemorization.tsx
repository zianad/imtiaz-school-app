import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MemorizationItem, Subject, School, Student } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewMemorizationProps {
    school: School;
    student: Student;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewMemorization: React.FC<GuardianViewMemorizationProps> = ({ school, student, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    // FIX: Destructure i18n from useTranslation to correctly access the language property.
    const { t, i18n } = useTranslation();
    const [items, setItems] = useState<MemorizationItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedItem, setSelectedItem] = useState<MemorizationItem | null>(null);
    const [repeatCount, setRepeatCount] = useState<number>(1);
    const [currentPlayCount, setCurrentPlayCount] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const fetchItems = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('memorization_items')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .order('date', { ascending: false });

            if (error) console.error("Error fetching items:", error);
            else setItems(snakeToCamelCase(data));
            setIsLoading(false);
        };
        fetchItems();
    }, [school.id, student.level]);

    const sortedItems = items;

    const isArabicContent = items.length > 0 && items.some(i => i.subject === Subject.Arabic);

    const itemsByDomain = useMemo(() => {
        if (!isArabicContent) return null;
        const groups: Record<string, typeof items> = {};
        for (const item of sortedItems) {
            const domainKey = item.domain || t('miscellaneous');
            if (!groups[domainKey]) {
                groups[domainKey] = [];
            }
            groups[domainKey].push(item);
        }
        return groups;
    }, [sortedItems, t, isArabicContent]);

    const playAudio = () => {
        if (!selectedItem) return;
        
        setCurrentPlayCount(1);
        speechSynthesis.cancel();

        if (selectedItem.audioBase64 && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (selectedItem.contentText) {
            const utterance = new SpeechSynthesisUtterance(selectedItem.contentText);
            utterance.lang = i18n.language === 'fr' ? 'fr-FR' : 'ar-SA';
            utterance.onend = handlePlaybackEnd;
            utteranceRef.current = utterance;
            speechSynthesis.speak(utterance);
        }
    };
    
    const handlePlaybackEnd = () => {
        if (repeatCount === 0) { // Infinite repeat
            // Re-trigger playback
            if (selectedItem?.audioBase64 && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            } else if (selectedItem?.contentText && utteranceRef.current) {
                speechSynthesis.speak(utteranceRef.current);
            }
            return;
        }

        if (currentPlayCount < repeatCount) {
             setCurrentPlayCount(prev => prev + 1);
             // Re-trigger playback
            if (selectedItem?.audioBase64 && audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play();
            } else if (selectedItem?.contentText && utteranceRef.current) {
                speechSynthesis.speak(utteranceRef.current);
            }
        } else {
             setCurrentPlayCount(0);
        }
    };

    useEffect(() => {
        const audioEl = audioRef.current;
        if (audioEl) {
            audioEl.addEventListener('ended', handlePlaybackEnd);
        }
        return () => {
            if (audioEl) {
                audioEl.removeEventListener('ended', handlePlaybackEnd);
            }
            speechSynthesis.cancel();
        };
    }, [selectedItem, repeatCount, currentPlayCount]);

     const renderItemButton = (item: MemorizationItem) => (
        <button 
            key={item.id} 
            onClick={() => setSelectedItem(item)}
            className="w-full text-right bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow border-r-4 border-teal-500"
        >
            <div className="flex justify-between items-center">
                <p className="font-semibold text-lg text-teal-700">{item.title}</p>
                {!itemsByDomain && item.domain && (
                     <span className="bg-teal-100 text-teal-800 text-xs font-semibold px-2.5 py-0.5 rounded dark:bg-teal-900 dark:text-teal-300">{item.domain}</span>
                )}
            </div>
            <p className="text-sm text-gray-500 mt-1">{t('subject')}: {item.subject}</p>
        </button>
    );
    
    if (selectedItem) {
        return (
             <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-teal-500 w-full relative">
                 <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                    </div>
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher />
                        <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                    </div>
                </div>
                 <div className="flex justify-center items-center mb-2">
                    <h1 className="text-2xl font-bold text-gray-800 text-center">{selectedItem.title}</h1>
                    {selectedItem.domain && (
                        <span className="bg-teal-100 text-teal-800 text-xs font-semibold ms-3 px-2.5 py-0.5 rounded dark:bg-teal-900 dark:text-teal-300">{selectedItem.domain}</span>
                    )}
                 </div>
                 <p className="text-sm text-gray-500 text-center mb-4">{t('subject')}: {selectedItem.subject}</p>
                 
                 {selectedItem.contentText && (
                    <div className="max-h-56 overflow-y-auto p-4 bg-gray-100 rounded-lg mb-4 text-lg whitespace-pre-wrap">
                        {selectedItem.contentText}
                    </div>
                 )}
                 
                 {selectedItem.audioBase64 && <audio ref={audioRef} src={selectedItem.audioBase64} className="w-full mb-4" />}
                 
                 <div className="flex items-center justify-center gap-4 mb-4">
                    <label htmlFor="repeat-count" className="font-semibold">{t('repeat')}:</label>
                    <select id="repeat-count" value={repeatCount} onChange={(e) => setRepeatCount(Number(e.target.value))} className="p-2 border-2 rounded-lg">
                        <option value={1}>1</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={0}>{t('infiniteRepeat')}</option>
                    </select>
                 </div>

                 <button onClick={playAudio} className="w-full bg-teal-500 text-white font-bold py-4 rounded-lg shadow-lg text-2xl">
                    ▶️ {t('listen')}
                 </button>

                 <div className="mt-8">
                     <button onClick={() => setSelectedItem(null)} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition">
                         {t('back')}
                    </button>
                 </div>
            </div>
        )
    }

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-teal-500 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('memorizationHelper')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-3 p-2 bg-gray-50 rounded-lg">
                {isLoading ? <p>{t('loading')}...</p> : sortedItems.length > 0 ? (
                    itemsByDomain ? (
                         <div className="space-y-6">
                            {Object.entries(itemsByDomain).map(([domain, domainItems]) => (
                                <div key={domain}>
                                    <h2 className="text-xl font-bold text-gray-700 mb-3 border-b-2 pb-2">{domain}</h2>
                                    <div className="space-y-3">
                                        {domainItems.map(renderItemButton)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {sortedItems.map(renderItemButton)}
                        </div>
                    )
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noMemorizationItems')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewMemorization;