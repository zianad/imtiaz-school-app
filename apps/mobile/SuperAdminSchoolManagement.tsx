import React, { useState } from 'react';
import { School, EducationalStage, Principal } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileSuperAdminSchoolManagementProps {
    school: School;
    onToggleStatus: () => void;
    onAddPrincipal: (schoolId: string, stage: EducationalStage, name: string, loginCode: string) => void;
    onDeletePrincipal: (schoolId: string, stage: EducationalStage, principalId: string) => void;
    onBack: () => void;
}

const MobileSuperAdminSchoolManagement: React.FC<MobileSuperAdminSchoolManagementProps> = ({ school, onToggleStatus, onAddPrincipal, onDeletePrincipal, onBack }) => {
    const { t } = useTranslation();
    const [newPrincipalInputs, setNewPrincipalInputs] = useState<Partial<Record<EducationalStage, { name: string; code: string }>>>({});

    const handleInputChange = (stage: EducationalStage, field: 'name' | 'code', value: string) => {
        setNewPrincipalInputs(prev => ({
            ...prev,
            [stage]: {
                ...prev[stage],
                name: prev[stage]?.name || '',
                code: prev[stage]?.code || '',
                [field]: value,
            },
        }));
    };
    
    const handleAddClick = (stage: EducationalStage) => {
        const name = newPrincipalInputs[stage]?.name || '';
        const code = newPrincipalInputs[stage]?.code || '';
        if (name.trim() && code.trim()) {
            onAddPrincipal(school.id, stage, name, code);
            handleInputChange(stage, 'name', '');
            handleInputChange(stage, 'code', '');
        }
    };

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '8px' }}>{school.name}</h1>
            <p style={{ textAlign: 'center', color: '#6b7280', marginBottom: '16px' }}>{t('schoolManagementMobile' as any)}</p>
            
            <div style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: '600' }}>{t('schoolStatus')}</span>
                    <button onClick={onToggleStatus} style={{ padding: '6px 12px', border: 'none', borderRadius: '16px', fontWeight: 'bold', color: 'white', backgroundColor: school.isActive ? '#22c55e' : '#ef4444' }}>
                        {school.isActive ? t('active') : t('inactive')}
                    </button>
                </div>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {school.stages.map(stage => (
                    <div key={stage} style={{ padding: '12px', backgroundColor: '#f9fafb', borderRadius: '8px' }}>
                        <h3 style={{ fontWeight: 'bold', color: '#3b82f6', textAlign: 'center', marginBottom: '12px' }}>{t(`${stage.toLowerCase()}Stage` as any)}</h3>
                        {(school.principals[stage] || []).map(p => (
                            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', backgroundColor: 'white', borderRadius: '4px', marginBottom: '4px' }}>
                                <span>{p.name} ({p.loginCode})</span>
                                <button onClick={() => onDeletePrincipal(school.id, stage, p.id)} style={{ color: '#ef4444', border: 'none', background: 'none', fontWeight: 'bold' }}>{t('delete')}</button>
                            </div>
                        ))}
                         <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                            <input type="text" placeholder={t('principalName')} value={newPrincipalInputs[stage]?.name || ''} onChange={e => handleInputChange(stage, 'name', e.target.value)} style={{ flex: 1, padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                            <input type="text" placeholder={t('loginCode')} value={newPrincipalInputs[stage]?.code || ''} onChange={e => handleInputChange(stage, 'code', e.target.value)} style={{ flex: 1, padding: '6px', border: '1px solid #d1d5db', borderRadius: '4px' }} />
                            <button onClick={() => handleAddClick(stage)} style={{ padding: '6px 10px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px' }}>{t('add')}</button>
                        </div>
                    </div>
                ))}
            </div>

            <button onClick={onBack} style={{ width: '100%', padding: '12px', backgroundColor: '#e5e7eb', color: '#1f2937', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '24px', fontWeight: 'bold' }}>{t('back')}</button>
        </div>
    );
};

export default MobileSuperAdminSchoolManagement;
