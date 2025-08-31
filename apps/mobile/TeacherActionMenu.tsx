import React from 'react';
import { useTranslation } from '../../packages/core/i18n';

export type MobileTeacherAction = 'manageSummaries' | 'manageExercises' | 'manageNotes' | 'manageGrades' | 'manageMemorization';

interface MobileTeacherActionMenuProps {
    onSelectAction: (action: MobileTeacherAction) => void;
    onBack: () => void;
}

const MobileTeacherActionMenu: React.FC<MobileTeacherActionMenuProps> = ({ onSelectAction, onBack }) => {
    const { t } = useTranslation();

    const actions: { label: string, action: MobileTeacherAction, icon: string }[] = [
        { label: t('summaries'), action: 'manageSummaries', icon: '📝' },
        { label: t('exercises'), action: 'manageExercises', icon: '🏋️' },
        { label: t('notesAndAbsences'), action: 'manageNotes', icon: '🗒️' },
        { label: t('studentGrades'), action: 'manageGrades', icon: '📊' },
        { label: t('memorizationHelper'), action: 'manageMemorization', icon: '🧠' },
    ];

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '24px' }}>اختر الإجراء المطلوب</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {actions.map(({ label, action, icon }) => (
                    <button
                        key={action}
                        onClick={() => onSelectAction(action)}
                        style={{
                            padding: '16px',
                            backgroundColor: '#3b82f6',
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

export default MobileTeacherActionMenu;