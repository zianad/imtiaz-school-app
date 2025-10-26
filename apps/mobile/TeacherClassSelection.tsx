import React from 'react';
import { Teacher } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileTeacherClassSelectionProps {
    teacher: Teacher;
    selectedLevel: string;
    onSelectClass: (className: string) => void;
    onBack: () => void;
}

const MobileTeacherClassSelection: React.FC<MobileTeacherClassSelectionProps> = ({ teacher, selectedLevel, onSelectClass, onBack }) => {
    const { t } = useTranslation();
    const classesForLevel = teacher.assignments[selectedLevel] || [];

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '16px' }}>{t('selectClassPrompt')}</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {classesForLevel.map(className => (
                    <button 
                        key={className} 
                        onClick={() => onSelectClass(className)}
                        style={{ padding: '16px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}
                    >
                        {className}
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

export default MobileTeacherClassSelection;
