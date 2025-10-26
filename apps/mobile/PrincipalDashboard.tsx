import React from 'react';
import { useTranslation } from '../../packages/core/i18n';

export type PrincipalAction = 'reviewNotes' | 'manageTeachers' | 'manageStudents';

interface MobilePrincipalDashboardProps {
    onSelectAction: (action: PrincipalAction) => void;
    onBack: () => void;
}

const MobilePrincipalDashboard: React.FC<MobilePrincipalDashboardProps> = ({ onSelectAction, onBack }) => {
    const { t } = useTranslation();

    const actions: { label: string, action: PrincipalAction, icon: string }[] = [
        { label: t('reviewNotes'), action: 'reviewNotes', icon: '🗒️' },
        { label: t('manageTeachers'), action: 'manageTeachers', icon: '👨‍🏫' },
        { label: t('manageStudents'), action: 'manageStudents', icon: '🎓' },
        // Add more actions here in the future
    ];

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>{t('principalDashboardTitle')}</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {actions.map(({ label, action, icon }) => (
                    <button
                        key={action}
                        onClick={() => onSelectAction(action)}
                        style={{
                            padding: '16px',
                            backgroundColor: '#4f46e5', // Indigo
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}
                    >
                        <span style={{ fontSize: '2.5rem' }}>{icon}</span>
                        <span style={{ fontWeight: '600', fontSize: '0.875rem' }}>{label}</span>
                    </button>
                ))}
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

export default MobilePrincipalDashboard;