import React from 'react';
import { EducationalStage } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobilePrincipalStageSelectionProps {
    accessibleStages: EducationalStage[];
    onSelectStage: (stage: EducationalStage) => void;
    onLogout: () => void;
}

const STAGE_COLORS: { [key in EducationalStage]: string } = {
    [EducationalStage.PRE_SCHOOL]: '#a855f7', // purple-500
    [EducationalStage.PRIMARY]: '#3b82f6', // blue-600
    [EducationalStage.MIDDLE]: '#14b8a6', // teal-500
    [EducationalStage.HIGH]: '#6366f1', // indigo-500
};


const MobilePrincipalStageSelection: React.FC<MobilePrincipalStageSelectionProps> = ({ accessibleStages, onSelectStage, onLogout }) => {
    const { t } = useTranslation();

    return (
        <div style={{ padding: '32px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('selectStage')}</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>{t('principalWelcome')}</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {accessibleStages.map(stage => (
                    <button
                        key={stage}
                        onClick={() => onSelectStage(stage)}
                        style={{
                            padding: '16px',
                            backgroundColor: STAGE_COLORS[stage],
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                        }}
                    >
                        {t(`${stage.toLowerCase()}Stage` as any)}
                    </button>
                ))}
            </div>

            <button
                onClick={onLogout}
                style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '32px' }}
            >
                {t('logout')}
            </button>
        </div>
    );
};

export default MobilePrincipalStageSelection;