import React from 'react';
import { Teacher, EducationalStage } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';
import { STAGE_DETAILS } from '../../packages/core/constants';

interface MobileTeacherDashboardProps {
    teacher: Teacher;
    onSelectLevel: (level: string) => void;
    onLogout: () => void;
}

const MobileTeacherDashboard: React.FC<MobileTeacherDashboardProps> = ({ teacher, onSelectLevel, onLogout }) => {
    const { t } = useTranslation();
    
    const teacherLevels = Object.keys(teacher.assignments);

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('teacherDashboardTitle')}</h1>
            <div style={{ margin: '16px 0', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{teacher.name}</p>
                <p style={{ color: '#6b7280' }}>{teacher.subjects.map(s => t(s as any)).join('، ')}</p>
            </div>
            
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>اختر المستوى الدراسي</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {teacherLevels.map(level => (
                    <button 
                        key={level} 
                        onClick={() => onSelectLevel(level)}
                        style={{ padding: '12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        {level}
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

export default MobileTeacherDashboard;