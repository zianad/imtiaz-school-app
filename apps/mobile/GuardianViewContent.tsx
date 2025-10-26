
import React from 'react';
import { useTranslation } from '../../packages/core/i18n';

interface MobileGuardianViewContentProps {
    title: string;
    items: {
        id: number;
        title?: string;
        content: string;
        date?: Date;
    }[];
    onBack: () => void;
}

const MobileGuardianViewContent: React.FC<MobileGuardianViewContentProps> = ({ title, items, onBack }) => {
    const { t } = useTranslation();

    return (
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>{title}</h1>
            
            <div style={{ maxHeight: '60vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '16px', borderRadius: '8px', textAlign: 'right' }}>
                {items.length > 0 ? (
                    items.map(item => (
                        <div key={item.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', marginBottom: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)' }}>
                            <h2 style={{ fontWeight: 'bold', color: '#1f2937' }}>{item.title || `${t('exercises')} - ${item.date?.toLocaleDateString()}`}</h2>
                            <p style={{ color: '#4b5563', marginTop: '8px', whiteSpace: 'pre-wrap' }}>{item.content}</p>
                        </div>
                    ))
                ) : (
                    <p style={{ color: '#6b7280', textAlign: 'center', padding: '32px 0' }}>لا يوجد محتوى لعرضه حاليا.</p>
                )}
            </div>

            <button
                onClick={onBack}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#e5e7eb',
                    color: '#1f2937',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '32px',
                    fontWeight: 'bold'
                }}
            >
                {t('back')}
            </button>
        </div>
    );
};

export default MobileGuardianViewContent;
