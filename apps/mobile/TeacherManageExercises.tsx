import React, { useState } from 'react';
import { Exercise } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileTeacherManageExercisesProps {
    items: Exercise[];
    onSave: (content: string) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
}

const MobileTeacherManageExercises: React.FC<MobileTeacherManageExercisesProps> = ({ items, onSave, onDelete, onBack }) => {
    const { t } = useTranslation();
    const [content, setContent] = useState('');

    const handleSave = () => {
        if (content.trim()) {
            onSave(content);
            setContent('');
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('exercises')}</h1>
            
            <div style={{ marginBottom: '24px' }}>
                <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>{t('add')} {t('exercises')}</h2>
                <div style={{ backgroundColor: '#f9fafb', padding: '12px', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <textarea 
                        placeholder={t('contentText')}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={5}
                        style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                    <button onClick={handleSave} style={{ padding: '10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                        {t('saveItem')}
                    </button>
                </div>
            </div>

            <div>
                <h2 style={{ fontWeight: '600', marginBottom: '8px' }}>{t('exercises')} الحالية</h2>
                <div style={{ maxHeight: '30vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
                    {items.length > 0 ? (
                        items.sort((a,b) => b.id - a.id).map(item => (
                            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '8px' }}>
                                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.content}</span>
                                <button onClick={() => onDelete(item.id)} style={{ color: '#ef4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold', flexShrink: 0, marginLeft: '8px' }}>{t('delete')}</button>
                            </div>
                        ))
                    ) : (
                        <p style={{ textAlign: 'center', color: '#6b7280' }}>لا توجد تمارين.</p>
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

export default MobileTeacherManageExercises;