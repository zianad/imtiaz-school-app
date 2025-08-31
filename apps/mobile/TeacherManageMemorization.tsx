import React, { useState, useRef, useEffect } from 'react';
import { MemorizationItem } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileTeacherManageMemorizationProps {
    items: MemorizationItem[];
    onSave: (item: { title: string; contentText?: string; audioBase64?: string }) => void;
    onDelete: (id: number) => void;
    onExtractText: (image: string) => Promise<string>;
    onBack: () => void;
}

const fileToBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

const MobileTeacherManageMemorization: React.FC<MobileTeacherManageMemorizationProps> = ({ items, onSave, onDelete, onExtractText, onBack }) => {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState<'text' | 'image' | 'audio'>('text');
    
    const [title, setTitle] = useState('');
    const [contentText, setContentText] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [isRecording, setIsRecording] = useState(false);
    const [audioBase64, setAudioBase64] = useState<string | null>(null);
    const [isLoadingOcr, setIsLoadingOcr] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const mediaRecorder = useRef<MediaRecorder | null>(null);
    const audioChunks = useRef<Blob[]>([]);

    useEffect(() => {
        return () => {
            if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
                mediaRecorder.current.stop();
            }
        };
    }, []);

    const resetForm = () => {
        setTitle('');
        setContentText('');
        setImagePreview(null);
        setAudioBase64(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const handleSave = () => {
        if (!title.trim()) { alert(t('fillAllFields')); return; }
        let data: { title: string; contentText?: string; audioBase64?: string } = { title };
        if (activeTab === 'text' || activeTab === 'image') {
            if (!contentText.trim()) { alert(t('fillAllFields')); return; }
            data.contentText = contentText;
        } else if (activeTab === 'audio') {
            if (!audioBase64) { alert(t('fillAllFields')); return; }
            data.audioBase64 = audioBase64;
        }
        onSave(data);
        resetForm();
    };

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            const base64 = await fileToBase64(file);
            setImagePreview(base64);
            setIsLoadingOcr(true);
            try {
                const text = await onExtractText(base64);
                setContentText(text);
            } catch (error) {
                console.error(error);
                alert('Failed to extract text.');
            } finally {
                setIsLoadingOcr(false);
            }
        }
    };
    
    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder.current = new MediaRecorder(stream);
                mediaRecorder.current.ondataavailable = (event) => audioChunks.current.push(event.data);
                mediaRecorder.current.onstop = () => {
                    const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
                    const reader = new FileReader();
                    reader.readAsDataURL(audioBlob);
                    reader.onloadend = () => setAudioBase64(reader.result as string);
                    audioChunks.current = [];
                    stream.getTracks().forEach(track => track.stop());
                };
                mediaRecorder.current.start();
                setIsRecording(true);
            } catch (err) { console.error("Mic error:", err); }
        }
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();
            setIsRecording(false);
        }
    };
    
    const buttonStyle = (tab: 'text' | 'image' | 'audio') => ({
        flex: 1, padding: '10px', fontWeight: 600, border: 'none', background: 'none', cursor: 'pointer',
        color: activeTab === tab ? '#14b8a6' : '#6b7280',
        borderBottom: activeTab === tab ? '2px solid #14b8a6' : '2px solid transparent',
    });

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('memorizationHelper')}</h1>
            
            <div style={{ marginBottom: '24px', backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                <h2 style={{ fontWeight: '600', textAlign: 'center', marginBottom: '12px' }}>{t('addMemorizationItem')}</h2>
                
                <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', marginBottom: '12px' }}>
                    <button onClick={() => setActiveTab('text')} style={buttonStyle('text')}>{t('addByText')}</button>
                    <button onClick={() => setActiveTab('image')} style={buttonStyle('image')}>{t('addByImage')}</button>
                    <button onClick={() => setActiveTab('audio')} style={buttonStyle('audio')}>{t('addByAudio')}</button>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input type="text" placeholder={t('memorizationItemTitle')} value={title} onChange={e => setTitle(e.target.value)} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} required/>
                    {activeTab === 'text' && <textarea placeholder={t('contentText')} value={contentText} onChange={e => setContentText(e.target.value)} rows={5} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />}
                    {activeTab === 'image' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                            <button onClick={() => fileInputRef.current?.click()} style={{ padding: '10px', border: '1px dashed #d1d5db', borderRadius: '4px' }}>{t('uploadPhoto')}</button>
                            {imagePreview && <img src={imagePreview} alt="preview" style={{ maxHeight: '120px', objectFit: 'contain', alignSelf: 'center' }} />}
                            {isLoadingOcr ? <p>{t('extractingTextFromImage')}</p> : <textarea value={contentText} onChange={e => setContentText(e.target.value)} rows={5} style={{ padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }} />}
                        </div>
                    )}
                    {activeTab === 'audio' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button onClick={isRecording ? stopRecording : startRecording} style={{ padding: '10px', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px', backgroundColor: isRecording ? '#ef4444' : '#22c55e' }}>
                                {isRecording ? t('stopRecording') : t('recordAudio')}
                            </button>
                            {audioBase64 && <audio src={audioBase64} controls style={{ width: '100%' }} />}
                        </div>
                    )}
                    <button onClick={handleSave} style={{ padding: '10px', backgroundColor: '#0d9488', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: '4px' }}>{t('saveItem')}</button>
                </div>
            </div>

            <div>
                <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>{t('noMemorizationItems')}</h2>
                <div style={{ maxHeight: '20vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
                    {items.length > 0 ? (
                        items.sort((a,b) => b.id - a.id).map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '8px' }}>
                                <span>{item.title}</span>
                                <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t('delete')}</button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>لا توجد مواد للحفظ.</p>
                    )}
                </div>
            </div>

            <button onClick={onBack} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '32px', fontWeight: 'bold' }}>{t('back')}</button>
        </div>
    );
};

export default MobileTeacherManageMemorization;