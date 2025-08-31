import React, { useState, useRef, useEffect, useMemo } from 'react';
import { MemorizationItem, Subject, School } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

// In a real mobile app, we would use native UI components.
// Here, we simulate the look and feel with styled divs and buttons.

interface MobileGuardianViewMemorizationProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    items: MemorizationItem[];
    onBack: () => void;
    onLogout: () => void;
}

const MobileGuardianViewMemorization: React.FC<MobileGuardianViewMemorizationProps> = ({ items, onBack, onLogout }) => {
    const { t, language } = useTranslation();
    const [selectedItem, setSelectedItem] = useState<MemorizationItem | null>(null);
    const [repeatCount, setRepeatCount] = useState<number>(1);
    const [currentPlayCount, setCurrentPlayCount] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    const sortedItems = [...items].sort((a, b) => b.date.getTime() - a.date.getTime());

    const isArabicContent = items.length > 0 && items[0].subject === Subject.Arabic;

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
            utterance.lang = language === 'fr' ? 'fr-FR' : 'ar-SA';
            utterance.onend = handlePlaybackEnd;
            utteranceRef.current = utterance;
            speechSynthesis.speak(utterance);
        }
    };
    
    const handlePlaybackEnd = () => {
        if (repeatCount === 0) { // Infinite repeat
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
    
    if (selectedItem) {
        return (
             <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
                 <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{selectedItem.title}</h1>
                 <p style={{ color: '#6b7280', marginBottom: '16px' }}>{t('subject')}: {selectedItem.subject}</p>
                 
                 {selectedItem.contentText && (
                    <div style={{ maxHeight: '200px', overflowY: 'auto', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '16px', textAlign: 'right', whiteSpace: 'pre-wrap', fontSize: '1.1rem' }}>
                        {selectedItem.contentText}
                    </div>
                 )}
                 
                 {selectedItem.audioBase64 && <audio ref={audioRef} src={selectedItem.audioBase64} style={{ width: '100%', marginBottom: '16px' }} />}
                 
                 <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '16px' }}>
                    <label htmlFor="repeat-count" style={{ fontWeight: '600' }}>{t('repeat')}:</label>
                    <select id="repeat-count" value={repeatCount} onChange={(e) => setRepeatCount(Number(e.target.value))} style={{ padding: '8px', border: '2px solid #e5e7eb', borderRadius: '8px' }}>
                        <option value={1}>1</option>
                        <option value={3}>3</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={0}>{t('infiniteRepeat')}</option>
                    </select>
                 </div>

                 <button onClick={playAudio} style={{ width: '100%', backgroundColor: '#14b8a6', color: 'white', fontWeight: 'bold', padding: '16px', borderRadius: '8px', fontSize: '1.5rem', border: 'none', cursor: 'pointer' }}>
                    ▶️ {t('listen')}
                 </button>

                 <div style={{ marginTop: '24px' }}>
                     <button onClick={() => setSelectedItem(null)} style={{ width: '100%', backgroundColor: '#e5e7eb', color: '#1f2937', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>
                         {t('back')}
                    </button>
                 </div>
            </div>
        )
    }

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>{t('memorizationHelper')}</h1>
            
            <div style={{ maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#f9fafb', borderRadius: '8px', padding: '8px' }}>
                {sortedItems.length > 0 ? (
                    sortedItems.map(item => (
                        <button 
                            key={item.id} 
                            onClick={() => setSelectedItem(item)}
                            style={{ width: '100%', textAlign: 'right', backgroundColor: 'white', padding: '16px', borderRadius: '8px', marginBottom: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)', border: '1px solid #e5e7eb', cursor: 'pointer' }}
                        >
                            <p style={{ fontWeight: '600', fontSize: '1.1rem', color: '#14b8a6' }}>{item.title}</p>
                            <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{t('subject')}: {item.subject}</p>
                        </button>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>{t('noMemorizationItems')}</p>
                )}
            </div>

            <div style={{ marginTop: '24px', display: 'flex', gap: '8px' }}>
                <button onClick={onBack} style={{ flex: 1, backgroundColor: '#e5e7eb', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{t('back')}</button>
                <button onClick={onLogout} style={{ flex: 1, backgroundColor: '#ef4444', color: 'white', fontWeight: 'bold', padding: '12px', borderRadius: '8px', border: 'none', cursor: 'pointer' }}>{t('logout')}</button>
            </div>
        </div>
    );
};

export default MobileGuardianViewMemorization;
