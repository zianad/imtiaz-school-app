
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MemorizationItem, Student, School, Subject } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewMemorizationProps {
    student: Student;
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewMemorization: React.FC<GuardianViewMemorizationProps> = ({ student, school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
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
                .eq('class', student.class)
                .order('date', { ascending: false });

            if (error) console.error("Error fetching items:", error);
            else setItems(snakeToCamelCase(data));
            setIsLoading(false);
        };
        fetchItems();
    }, [school.id, student.level, student.class]);

    const itemsByDomain = useMemo(() => {
        const groups: Record<string, MemorizationItem[]> = {};
        for (const item of items) {
            const domainKey = item.domain || t('miscellaneous');
            if (!groups[domainKey]) groups[domainKey] = [];
            groups[domainKey].push(item);
        }
        return groups;
    }, [items, t]);

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
        if (repeatCount === 0) { // Infinite
            playCurrent();
            return;
        }
        if (currentPlayCount < repeatCount) {
            setCurrentPlayCount(prev => prev + 1);
            playCurrent();
        } else {
            setCurrentPlayCount(0);
        }
    };
    
    const playCurrent = () => {
        if (selectedItem?.audioBase64 && audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
        } else if (selectedItem?.contentText && utteranceRef.current) {
            speechSynthesis.speak(utteranceRef.current);
        }
    }

    useEffect(() => {
        const audioEl = audioRef.current;
        if (audioEl) audioEl.addEventListener('ended', handlePlaybackEnd);
        return () => {
            if (audioEl) audioEl.removeEventListener('ended', handlePlaybackEnd);
            speechSynthesis.cancel();
        };
    }, [selectedItem, repeatCount, currentPlayCount]);

    if (selectedItem) {
        return (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl w-full max-w-lg mx-auto">
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2 text-center">{selectedItem.title}</h1>
                <p className="text-center text-gray-500 dark:text-gray-400 mb-4">{t('subject')}: {t(selectedItem.subject as any)}</p>
                {selectedItem.contentText && (
                    <div className="max-h-48 overflow-y-auto p-4 bg-gray-100 dark:bg-gray-700 rounded-lg mb-4 text-right whitespace-pre-wrap text-lg">
                        {selectedItem.contentText}
                    </div>
                )}
                {selectedItem.audioBase64 && <audio ref={audioRef} src={selectedItem.audioBase64} className="w-full mb-4" />}
                <div className="flex items-center justify-center gap-4 mb-4">
                    <label htmlFor="repeat-count" className="font-semibold text-gray-700 dark:text-gray-300">{t('repeat')}:</label>
                    <select id="repeat-count" value={repeatCount} onChange={e => setRepeatCount(Number(e.target.value))} className="p-2 border-2 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                        <option value={1}>1</option><option value={3}>3</option><option value={5}>5</option><option value={10}>10</option><option value={0}>{t('infiniteRepeat')}</option>
                    </select>
                </div>
                <button onClick={playAudio} className="w-full bg-teal-500 text-white font-bold py-3 text-2xl rounded-lg hover:bg-teal-600 transition">▶️ {t('listen')}</button>
                <div className="mt-6"><BackButton onClick={() => setSelectedItem(null)} /></div>
            </div>
        );
    }


    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-teal-500 w-full relative">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('memorizationHelper')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 dark:bg-gray-700/50 border-2 border-dashed border-gray-200 dark:border-gray-600 rounded-lg p-4">
                 {isLoading ? <p>{t('loading')}...</p> : items.length > 0 ? (
                    Object.entries(itemsByDomain).map(([domain, domainItems]) => (
                        <div key={domain} className="mb-6">
                             <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200 mb-3 border-b-2 pb-2">{domain}</h2>
                             <div className="space-y-3">
                                {domainItems.map(item => (
                                    <button key={item.id} onClick={() => setSelectedItem(item)} className="w-full text-right bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:bg-teal-50 dark:hover:bg-gray-700 transition">
                                        <p className="font-semibold text-teal-600 dark:text-teal-400">{item.title}</p>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{t(item.subject as any)}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noMemorizationItems')}</p>
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

export default GuardianViewMemorization;
