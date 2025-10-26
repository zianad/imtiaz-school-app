
import React, { useState, useRef } from 'react';
import { TalkingCard, Hotspot } from '../../core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { useTranslation } from '../../core/i18n';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface TeacherManageTalkingCardsProps {
    cards: TalkingCard[];
    onAnalyze: (image: string) => Promise<Hotspot[]>;
    onSave: (image: string, hotspots: Hotspot[]) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const TeacherManageTalkingCards: React.FC<TeacherManageTalkingCardsProps> = ({ cards, onAnalyze, onSave, onDelete, onBack, onLogout }) => {
    const { t } = useTranslation();
    const [image, setImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState<Hotspot[] | null>(null);
    const [error, setError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetState = () => {
        setImage(null);
        setIsLoading(false);
        setAnalysisResult(null);
        setError('');
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result as string);
                setAnalysisResult(null);
                setError('');
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleAnalyze = async () => {
        if (!image) return;
        setIsLoading(true);
        setError('');
        try {
            const result = await onAnalyze(image);
            setAnalysisResult(result);
        } catch (e: any) {
            setError(e.message || 'Failed to analyze image.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHotspotChange = (index: number, newLabel: string) => {
        if (!analysisResult) return;
        const newResult = [...analysisResult];
        newResult[index].label = newLabel;
        setAnalysisResult(newResult);
    };

    const handleHotspotDelete = (index: number) => {
        if (!analysisResult) return;
        setAnalysisResult(analysisResult.filter((_, i) => i !== index));
    };
    
    const handleListen = (text: string) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ar-SA';
        speechSynthesis.speak(utterance);
    };

    const handleSave = () => {
        if (image && analysisResult) {
            onSave(image, analysisResult);
            resetState();
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-purple-600 w-full relative">
            <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('talkingCards')}</h1>

            <div className="mb-8 p-4 bg-gray-50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 text-center">{t('addTalkingCard')}</h2>
                
                {image && <div className="p-2 border-2 border-dashed rounded-lg"><img src={image} alt="Preview" className="max-h-60 mx-auto rounded"/></div>}
                
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300">
                    📎 {t('uploadPhoto')}
                </button>

                {image && !analysisResult && (
                    <button onClick={handleAnalyze} disabled={isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400">
                        {isLoading ? '...' : '✨'} {isLoading ? t('analyzing') : t('analyzeWithAI')}
                    </button>
                )}
                 {error && <p className="text-red-500 text-center text-sm">{error}</p>}
                 {saveSuccess && <p className="text-green-600 text-center font-semibold animate-pulse">{t('cardSaved')}</p>}
            </div>

            {analysisResult && (
                <div className="my-6 p-4 bg-blue-50 rounded-lg shadow-inner space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-blue-800 text-center">{t('reviewAIDetections')}</h3>
                    <p className="text-sm text-center text-gray-600">{t('editAIDetections_desc')}</p>
                    <div className="space-y-3 max-h-60 overflow-y-auto p-2">
                        {analysisResult.map((hotspot, index) => (
                            <div key={index} className="flex items-center gap-2 bg-white p-2 rounded shadow-sm">
                                <input 
                                    type="text"
                                    value={hotspot.label}
                                    onChange={(e) => handleHotspotChange(index, e.target.value)}
                                    className="flex-grow p-2 border-2 rounded"
                                />
                                <button onClick={() => handleListen(hotspot.label)} className="p-2 bg-gray-200 rounded">🔊</button>
                                <button onClick={() => handleHotspotDelete(index)} className="p-2 bg-red-200 text-red-700 rounded font-bold">X</button>
                            </div>
                        ))}
                    </div>
                     <button onClick={handleSave} className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 shadow-lg">{t('saveCard')}</button>
                </div>
            )}

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherManageTalkingCards;
