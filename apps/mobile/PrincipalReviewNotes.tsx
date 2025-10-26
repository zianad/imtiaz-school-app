import React from 'react';
import { Note, Student } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobilePrincipalReviewNotesProps {
    notes: Note[];
    students: Student[];
    onApprove: (noteId: number) => void;
    onReject: (noteId: number) => void;
    onBack: () => void;
}

const MobilePrincipalReviewNotes: React.FC<MobilePrincipalReviewNotesProps> = ({ notes, students, onApprove, onReject, onBack }) => {
    const { t } = useTranslation();

    const getStudentNames = (studentIds: string[]): string => {
        return studentIds
            .map(id => students.find(s => s.id === id)?.name)
            .filter(Boolean)
            .join(', ');
    };

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '16px' }}>{t('reviewNotes')}</h1>
            
            <div style={{ maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
                {notes.length > 0 ? (
                    notes.map(note => (
                        <div key={note.id} style={{ backgroundColor: 'white', padding: '12px', borderRadius: '8px', marginBottom: '12px', boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)', borderLeft: '4px solid #f59e0b' }}>
                            <div style={{ borderBottom: '1px solid #e5e7eb', paddingBottom: '8px', marginBottom: '8px' }}>
                                <p style={{ fontSize: '0.8rem', color: '#6b7280' }}>{new Date(note.date).toLocaleString()}</p>
                                <p><strong>{t('student' as any)}:</strong> {getStudentNames(note.studentIds)}</p>
                                <p><strong>{t('subject')}:</strong> {t(note.subject as any)}</p>
                            </div>
                            <p style={{ marginBottom: '12px', whiteSpace: 'pre-wrap' }}>{note.observation}</p>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={() => onApprove(note.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#22c55e', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                    {t('approve')}
                                </button>
                                <button onClick={() => onReject(note.id)} style={{ flex: 1, padding: '8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}>
                                    {t('reject')}
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280', padding: '40px 0' }}>{t('noPendingNotes' as any)}</p>
                )}
            </div>

            <button
                onClick={onBack}
                style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '16px', fontWeight: 'bold' }}
            >
                {t('back')}
            </button>
        </div>
    );
};

export default MobilePrincipalReviewNotes;
