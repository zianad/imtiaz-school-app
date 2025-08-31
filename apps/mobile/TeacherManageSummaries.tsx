import React, { useState } from 'react';
import { Summary } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileTeacherManageSummariesProps {
    items: Summary[];
    onSave: (title: string, content: string) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
}

const MobileTeacherManageSummaries: React.FC<MobileTeacherManageSummariesProps> = ({ items, onSave, onDelete, onBack }) => {
    const { t } = useTranslation();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleSave = () => {
        if (title.trim() && content.trim()) {
            onSave(title, content);
            setTitle('');
            setContent('');
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('summaries')}</h1>
            
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>{t('add')}</h2>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <input 
                        type="text"
                        placeholder={t('lessonTitle')}
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <textarea 
                        placeholder={t('contentText')}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={4}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <button onClick={handleSave} style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t('saveItem')}
                    </button>
                </div>
            </div>

            <div>
                <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>الملخصات الحالية</h2>
                <div style={{ maxHeight: '30vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
                    {items.length > 0 ? (
                        items.sort((a,b) => b.id - a.id).map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '8px' }}>
                                <span>{item.title}</span>
                                <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>{t('delete')}</button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>لا توجد ملخصات.</p>
                    )}
                </div>
            </div>

            <button
                onClick={onBack}
                style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '32px', fontWeight: 'bold' }}
            >
                {t('back')}
            </button>
        </div>
    );
};

export default MobileTeacherManageSummaries;