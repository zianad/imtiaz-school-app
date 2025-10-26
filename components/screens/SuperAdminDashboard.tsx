import React, { useState } from 'react';
import { School } from '../../types';
import LogoutButton from '../LogoutButton';
import { useTranslation } from '../../i18n';
import LanguageSwitcher from '../LanguageSwitcher';

interface SuperAdminDashboardProps {
    schools: School[];
    onAddSchool: (name: string, principalCode: string, logoUrl: string) => void;
    onDeleteSchool: (schoolId: string) => void;
    onManageSchool: (schoolId: string) => void;
    onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ schools, onAddSchool, onDeleteSchool, onManageSchool, onLogout }) => {
    const [schoolName, setSchoolName] = useState('');
    const [principalCode, setPrincipalCode] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const { t } = useTranslation();

    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (schoolName.trim() && principalCode.trim()) {
            onAddSchool(schoolName, principalCode, logoUrl);
            setSchoolName('');
            setPrincipalCode('');
            setLogoUrl('');
        } else {
            alert(t('enterSchoolNameAndCode'));
        }
    };

    const handleDelete = (schoolId: string, name: string) => {
        if (window.confirm(t('confirmDeleteSchool', { schoolName: name }))) {
            onDeleteSchool(schoolId);
        }
    }

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 text-center mb-6">{t('superAdminDashboardTitle')}</h1>

            <form onSubmit={handleAdd} className="mb-8 p-4 bg-gray-100 rounded-lg shadow-inner space-y-3">
                <h2 className="text-xl font-semibold text-gray-700 text-center">{t('addSchoolSectionTitle')}</h2>
                <input
                    type="text"
                    placeholder={t('newSchoolNamePlaceholder')}
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="text"
                    placeholder={t('principalSecretCodePlaceholder')}
                    value={principalCode}
                    onChange={(e) => setPrincipalCode(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                 <input
                    type="url"
                    placeholder="رابط شعار المدرسة (اختياري)"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">
                    {t('addSchool')}
                </button>
            </form>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 mb-3 text-center border-t pt-4">{t('currentSchools')}</h2>
                <div className="max-h-64 overflow-y-auto space-y-2 p-2">
                    {schools.length > 0 ? (
                        schools.map(school => (
                            <div key={school.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <button onClick={() => onManageSchool(school.id)} className="flex-grow text-right hover:bg-gray-50 p-2 rounded-md transition">
                                    <div className="flex items-center gap-3">
                                         {school.logoUrl ? (
                                            <img src={school.logoUrl} alt={`${school.name} logo`} className="w-10 h-10 rounded-full object-contain bg-gray-100" />
                                        ) : (
                                            <span className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${school.isActive ? 'bg-green-100' : 'bg-red-100'}`}>🏫</span>
                                        )}
                                        <div>
                                            <p className="text-gray-800 font-medium">{school.name}</p>
                                            <p className="text-xs text-gray-500">{t('principalCodeLabel')}: {Object.values(school.principals).flat().map(p => p.loginCode).join(', ')}</p>
                                        </div>
                                    </div>
                                </button>
                                <button
                                    onClick={() => handleDelete(school.id, school.name)}
                                    className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-md hover:bg-red-100 transition flex-shrink-0"
                                >
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">{t('noSchoolsAdded')}</p>
                    )}
                </div>
            </div>

            <div className="mt-8">
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default SuperAdminDashboard;