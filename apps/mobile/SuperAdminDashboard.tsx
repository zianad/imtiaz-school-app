import React from 'react';
import { School } from '../../packages/core/types';
import { useTranslation } from '../../packages/core/i18n';

interface MobileSuperAdminDashboardProps {
    schools: School[];
    onManageSchool: (school: School) => void;
    onLogout: () => void;
}

const MobileSuperAdminDashboard: React.FC<MobileSuperAdminDashboardProps> = ({ schools, onManageSchool, onLogout }) => {
    const { t } = useTranslation();

    return (
        <div style={{ padding: '16px', backgroundColor: 'white', borderRadius: '16px', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '24px' }}>{t('superAdminDashboardTitle')}</h1>
            
            <div style={{ maxHeight: '70vh', overflowY: 'auto', backgroundColor: '#f9fafb', padding: '8px', borderRadius: '8px' }}>
                {schools.length > 0 ? (
                    schools.map(school => (
                        <div key={school.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: 'white', borderRadius: '8px', marginBottom: '8px', boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: school.isActive ? '#22c55e' : '#ef4444' }}></span>
                                <span style={{ fontWeight: '600' }}>{school.name}</span>
                            </div>
                            <button onClick={() => onManageSchool(school)} style={{ padding: '6px 12px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                                {t('manage')}
                            </button>
                        </div>
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: '#6b7280' }}>{t('noSchoolsAdded')}</p>
                )}
            </div>

            <button
                onClick={onLogout}
                style={{ width: '100%', padding: '12px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '24px', fontWeight: 'bold' }}
            >
                {t('logout')}
            </button>
        </div>
    );
};

export default MobileSuperAdminDashboard;