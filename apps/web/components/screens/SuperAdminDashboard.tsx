import React, { useState, useRef, useEffect } from 'react';
import { School, Page } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import { compressImage } from '../../../../packages/core/utils';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import { supabase, isSupabaseConfigured } from '../../../../packages/core/supabaseClient';

interface SupabaseSettingsStatus {
    allowNewUsers: boolean | 'loading' | 'error';
    disableEmailConfirm: boolean | 'loading' | 'error';
}

interface SuperAdminDashboardProps {
    schools: School[];
    onAddSchool: (name: string, principalCode: string, logoUrl: string) => void;
    onDeleteSchool: (schoolId: string, schoolName: string) => void;
    onManageSchool: (schoolId: string) => void;
    onNavigate: (page: Page) => void;
    onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ schools, onAddSchool, onDeleteSchool, onManageSchool, onNavigate, onLogout }) => {
    const [schoolName, setSchoolName] = useState('');
    const [principalCode, setPrincipalCode] = useState('');
    const [logoUrl, setLogoUrl] = useState('');
    const { t } = useTranslation();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [settingsStatus, setSettingsStatus] = useState<SupabaseSettingsStatus>({
        allowNewUsers: 'loading',
        disableEmailConfirm: 'loading',
    });

    useEffect(() => {
        const checkSupabaseSettings = async () => {
             if (!isSupabaseConfigured) {
                setSettingsStatus({ allowNewUsers: true, disableEmailConfirm: true }); // Assume correct for mock
                return;
            }
            try {
                // This is a simplified check. A real implementation would require a Supabase Edge Function
                // to read config, as it's not exposed to the client. We'll simulate a check.
                // For now, we assume the user needs to check manually and we can't verify automatically.
                // Let's change the state to 'error' to prompt manual check.
                 setSettingsStatus({ allowNewUsers: 'error', disableEmailConfirm: 'error' });
            } catch (error) {
                console.error("Could not check Supabase settings:", error);
                setSettingsStatus({ allowNewUsers: 'error', disableEmailConfirm: 'error' });
            }
        };
        checkSupabaseSettings();
    }, []);


    const handleAdd = (e: React.FormEvent) => {
        e.preventDefault();
        if (schoolName.trim() && principalCode.trim()) {
            onAddSchool(schoolName, principalCode, logoUrl);
            setSchoolName('');
            setPrincipalCode('');
            setLogoUrl('');
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } else {
            alert(t('enterSchoolNameAndCode'));
        }
    };
    
    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            try {
                const compressedImage = await compressImage(file);
                setLogoUrl(compressedImage);
            } catch (error) {
                console.error("Image compression failed:", error);
                alert("Failed to process image.");
            }
        } else {
            setLogoUrl('');
        }
    };

    const handleDelete = (schoolId: string, name: string) => {
        onDeleteSchool(schoolId, name);
    }
    
    const renderStatusIcon = (status: boolean | 'loading' | 'error') => {
        if (status === 'loading') return <span className="animate-spin text-sm">⏳</span>;
        if (status === 'error') return <span className="text-red-500 font-bold">❌</span>;
        return status ? <span className="text-green-500 font-bold">✔️</span> : <span className="text-red-500 font-bold">❌</span>;
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('superAdminDashboardTitle')}</h1>

            <div className="mb-6">
                <button
                    onClick={() => onNavigate(Page.SuperAdminFeedbackAnalysis)}
                    className="w-full bg-teal-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-600 transition shadow-lg flex items-center justify-center gap-2"
                >
                    📊 {t('feedbackAnalysis')}
                </button>
            </div>

            <form onSubmit={handleAdd} className="mb-8 p-4 bg-gray-100 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-3">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addSchoolSectionTitle')}</h2>
                <input
                    type="text"
                    placeholder={t('newSchoolNamePlaceholder')}
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-blue-50 dark:text-gray-900 dark:border-blue-200"
                />
                <input
                    type="text"
                    placeholder={t('principalSecretCodePlaceholder')}
                    value={principalCode}
                    onChange={(e) => setPrincipalCode(e.target.value)}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-gray-900 dark:bg-blue-50 dark:text-gray-900 dark:border-blue-200"
                />
                <div className="flex flex-col items-center space-y-2 pt-2">
                    <label className="text-gray-700 dark:text-gray-200">شعار المدرسة (اختياري)</label>
                    {logoUrl && <img src={logoUrl} alt="Logo Preview" className="w-20 h-20 rounded-full object-contain mb-2 bg-gray-200" />}
                    <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/png, image/jpeg, image/gif"
                        onChange={handleLogoChange}
                        className="w-full text-sm text-slate-500 dark:text-slate-300
                                    file:mr-4 file:py-2 file:px-4
                                    file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                                    file:bg-blue-100 file:text-blue-700
                                    hover:file:bg-blue-200
                                    dark:file:bg-blue-800 dark:file:text-blue-200 dark:hover:file:bg-blue-700"
                    />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg !mt-4">
                    {t('addSchool')}
                </button>
            </form>
            
            <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-400 dark:border-orange-500 rounded-r-lg">
                <h3 className="font-bold text-orange-800 dark:text-orange-200">{t('supabaseSettingsChecklistTitle')}</h3>
                <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">{t('supabaseSettingsInstructions')}</p>
                <ul className="list-inside space-y-2 mt-3 text-gray-700 dark:text-gray-300">
                     <li className="flex items-center gap-2">
                        {renderStatusIcon(settingsStatus.allowNewUsers)}
                        <span>{t('supabaseAllowSignups')}</span>
                        {settingsStatus.allowNewUsers === 'error' && <span className="text-xs text-orange-600 dark:text-orange-400">(تحقق يدوي مطلوب)</span>}
                    </li>
                     <li className="flex items-center gap-2">
                        {renderStatusIcon(settingsStatus.disableEmailConfirm)}
                        <span>{t('supabaseDisableEmailConfirm')}</span>
                         {settingsStatus.disableEmailConfirm === 'error' && <span className="text-xs text-orange-600 dark:text-orange-400">(تحقق يدوي مطلوب)</span>}
                    </li>
                </ul>
                <p className="text-xs text-gray-500 dark:text-gray-400 pl-4 mt-2">
                    بالإضافة إلى ذلك، تأكد من أن سياسات الأمان (RLS) على جداول `principals`, `teachers`, `students` تسمح بالقراءة (SELECT) لدور `anon`.
                </p>
            </div>

            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4 mt-8">{t('currentSchools')}</h2>
                <div className="max-h-64 overflow-y-auto space-y-2 p-2">
                    {schools.length > 0 ? (
                        schools.map(school => (
                            <div key={school.id} className="flex items-center justify-between bg-white dark:bg-gray-800/50 p-3 rounded-lg shadow-sm">
                                <button onClick={() => onManageSchool(school.id)} className="flex-grow text-right hover:bg-gray-50 dark:hover:bg-gray-700 p-2 rounded-md transition">
                                    <div className="flex items-center gap-3">
                                         {school.logoUrl ? (
                                            <img src={school.logoUrl} alt={`${school.name} logo`} className="w-10 h-10 rounded-full object-contain bg-gray-100 dark:bg-gray-700" />
                                        ) : (
                                            <span className={`h-10 w-10 rounded-full flex items-center justify-center text-xl ${school.isActive ? 'bg-green-100 dark:bg-green-900/20' : 'bg-red-100 dark:bg-red-900/20'}`}>🏫</span>
                                        )}
                                        <div>
                                            <p className="text-gray-800 dark:text-gray-100 font-medium">{school.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">{t('principalCodeLabel')}: {Object.values(school.principals).flat().map(p => p.loginCode).join(', ')}</p>
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
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('noSchoolsAdded')}</p>
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