
import React from 'react';
import { Student, Subject } from '../../packages/core/types';
import { STAGE_DETAILS } from '../../packages/core/constants';
import { useTranslation } from '../../packages/core/i18n';

interface MobileGuardianDashboardProps {
    student: Student;
    onLogout: () => void;
    onSelectSubject: (subject: Subject) => void;
    onSelectMemorization: () => void;
}

const MobileGuardianDashboard: React.FC<MobileGuardianDashboardProps> = ({ student, onLogout, onSelectSubject, onSelectMemorization }) => {
    const { t } = useTranslation();
    const availableSubjects = STAGE_DETAILS[student.stage]?.subjects || [];

    return (
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{t('guardianDashboardTitle')}</h1>
            <div style={{ margin: '16px 0', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                <p style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{student.name}</p>
                <p style={{ color: '#6b7280' }}>{student.level}</p>
            </div>
            
            <h2 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '16px' }}>{t('selectSubjectToFollow')}</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {availableSubjects.map(subject => (
                    <button 
                        key={subject} 
                        onClick={() => onSelectSubject(subject)}
                        style={{
                            padding: '12px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        {t(subject as any)}
                    </button>
                ))}
            </div>
            
            <div style={{ marginTop: '16px', borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                 <button 
                    onClick={onSelectMemorization}
                    style={{
                        width: '100%',
                        padding: '12px',
                        backgroundColor: '#14b8a6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🧠 {t('memorizationHelper')}
                </button>
            </div>

            <button 
                onClick={onLogout}
                style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    marginTop: '32px'
                }}
            >
                {t('logout')}
            </button>
        </div>
    );
}

export default MobileGuardianDashboard;
