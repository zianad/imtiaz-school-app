
import React from 'react';
import { Subject } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

// Simplified version of Page enum for mobile navigation
export type MobileGuardianPage = 
    'summaries' | 'exercises' | 'notes' | 'grades' | 'exam_program' | 
    'personalized_exercises' | 'supplementary_lessons' | 'unified_assessments' |
    'timetable' | 'quizzes' | 'projects' | 'library' | 'memorization';


interface MobileGuardianSubjectMenuProps {
    subject: Subject;
    onSelectAction: (page: MobileGuardianPage) => void;
    onBack: () => void;
}

const MobileGuardianSubjectMenu: React.FC<MobileGuardianSubjectMenuProps> = ({ subject, onSelectAction, onBack }) => {
    const { t } = useTranslation();

    const actions: { label: string, page: MobileGuardianPage, icon: string }[] = [
        { label: t('summaries'), page: 'summaries', icon: '📝' },
        { label: t('exercises'), page: 'exercises', icon: '🏋️' },
        { label: t('notes'), page: 'notes', icon: '🗒️' },
        { label: t('studentGrades'), page: 'grades', icon: '📊' },
        { label: t('examProgram'), page: 'exam_program', icon: '🗓️' },
    ];
    
    return (
        <div style={{ padding: '16px', border: '1px solid #e5e7eb', backgroundColor: 'white', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{subject}</h1>
            <p style={{ color: '#6b7280', marginBottom: '24px' }}>اختر الإجراء المطلوب</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                {actions.map(action => (
                    <button
                        key={action.page}
                        onClick={() => onSelectAction(action.page)}
                        style={{
                            padding: '16px',
                            backgroundColor: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px'
                        }}
                    >
                        <span style={{ fontSize: '2rem' }}>{action.icon}</span>
                        <span style={{ fontWeight: '600' }}>{action.label}</span>
                    </button>
                ))}
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
}

export default MobileGuardianSubjectMenu;
