
import React, { useState, useRef } from 'react';
import { School, Page, SchoolFeature, EducationalStage, Principal } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import { compressImage } from '../../../../packages/core/utils';

interface SuperAdminSchoolManagementProps {
    school: School;
    onUpdateSchoolDetails: (schoolId: string, name: string, logoUrl: string) => void;
    onToggleStatus: () => void;
    onToggleStage: (stage: EducationalStage) => void;
    onToggleFeatureFlag: (feature: SchoolFeature) => void;
    onEnterFeaturePage: (page: Page, stage: EducationalStage) => void;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    onAddPrincipal: (stage: EducationalStage, name: string, loginCode: string) => void;
    onDeletePrincipal: (stage: EducationalStage, principalId: string, principalName: string) => void;
    onUpdatePrincipalCode: (stage: EducationalStage, principalId: string, newCode: string) => void;
}

const SuperAdminSchoolManagement: React.FC<SuperAdminSchoolManagementProps> = ({
    school,
    onUpdateSchoolDetails,
    onToggleStatus,
    onToggleStage,
    onToggleFeatureFlag,
    onEnterFeaturePage,
    onBack,
    onLogout,
    toggleDarkMode,
    isDarkMode,
    onAddPrincipal,
    onDeletePrincipal,
    onUpdatePrincipalCode,
}) => {
    const { t } = useTranslation();
    const [editingPrincipal, setEditingPrincipal] = useState<{ stage: EducationalStage; principal: Principal } | null>(null);
    const [newPrincipalInputs, setNewPrincipalInputs] = useState<Partial<Record<EducationalStage, { name: string; code: string }>>>({});
    const [newPassword, setNewPassword] = useState('');
    
    const [isEditingSchool, setIsEditingSchool] = useState(false);
    const [editedName, setEditedName] = useState(school.name);
    const [editedLogoUrl, setEditedLogoUrl] = useState(school.logoUrl || '');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const principalFeatures: { key: SchoolFeature; page: Page; icon: string }[] = [
        { key: 'statisticsDashboard', page: Page.PrincipalPerformanceTracking, icon: "📊" },
        { key: 'educationalTips', page: Page.PrincipalEducationalTips, icon: "💡" },
        { key: 'announcements', page: Page.PrincipalAnnouncements, icon: "📢" },
        { key: 'complaintsAndSuggestions', page: Page.PrincipalComplaints, icon: "✍️" },
        { key: 'reviewNotes', page: Page.PrincipalReviewNotes, icon: "🗒️" },
        { key: 'reviewAlbumPhotos', page: Page.PrincipalReviewAlbum, icon: "🖼️" },
        { key: 'monthlyFees', page: Page.PrincipalMonthlyFees, icon: "💰" },
        { key: 'interviewRequests', page: Page.PrincipalInterviewRequests, icon: "🤝" },
        { key: 'schoolManagement', page: Page.PrincipalManagementMenu, icon: "🏫" },
        { key: 'browseAsTeacher', page: Page.PrincipalBrowseAsTeacherSelection, icon: "👨‍🏫" },
        { key: 'financialManagement', page: Page.PrincipalFinancialDashboard, icon: "💼" },
    ];
    
    const teacherFeatures: SchoolFeature[] = [
        'teacherManageSummaries', 'teacherManageExercises', 'teacherManageNotesAndAbsences', 
        'teacherManageGrades', 'teacherManageExamProgram', 'teacherGenerateAiNotes', 
        'teacherLessonPlanner', 'teacherPersonalizedExercises', 'teacherManageSupplementaryLessons',
        'teacherManageUnifiedAssessments', 'teacherManageTimetable', 'teacherManageQuizzes',
        'teacherManageProjects', 'teacherManageLibrary', 'teacherManageAlbum', 'teacherManageTalkingCards',
        'teacherManageMemorization', 'teacherViewAnnouncements'
    ];
    
    const guardianFeatures: SchoolFeature[] = [
        'guardianViewSummaries', 'guardianViewExercises', 'guardianViewNotesAndAbsences',
        'guardianViewGrades', 'guardianViewExamProgram', 'guardianViewPersonalizedExercises',
        'guardianViewSupplementaryLessons', 'guardianViewUnifiedAssessments', 'guardianViewTimetable',
        'guardianViewQuizzes', 'guardianViewProjects', 'guardianViewLibrary',
        'guardianViewAlbum', 'guardianPayFees', 'guardianSubmitComplaints', 'guardianRequestInterview', 'guardianViewTalkingCards',
        'guardianViewMemorization'
    ];


    const allStages = [EducationalStage.PRE_SCHOOL, EducationalStage.PRIMARY, EducationalStage.MIDDLE, EducationalStage.HIGH];

    const handleInputChange = (stage: EducationalStage, field: 'name' | 'code', value: string) => {
        setNewPrincipalInputs(prev => ({
            ...prev,
            [stage]: {
                name: prev[stage]?.name || '',
                code: prev[stage]?.code || '',
                [field]: value,
            },
        }));
    };
    
    const handleAddPrincipalClick = (stage: EducationalStage) => {
        const name = newPrincipalInputs[stage]?.name || '';
        const code = newPrincipalInputs[stage]?.code || '';

        if (name.trim() && code.trim()) {
            onAddPrincipal(stage, name, code);
            setNewPrincipalInputs(prev => ({
                ...prev,
                [stage]: { name: '', code: '' }
            }));
        }
    };
    
    const handleDeletePrincipalClick = (stage: EducationalStage, principal: Principal) => {
        onDeletePrincipal(stage, principal.id, principal.name);
    };

    const handleUpdatePasswordClick = () => {
        if (editingPrincipal && newPassword.trim()) {
            onUpdatePrincipalCode(editingPrincipal.stage, editingPrincipal.principal.id, newPassword);
            setEditingPrincipal(null);
            setNewPassword('');
        }
    };
    
    const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            try {
                const compressedImage = await compressImage(file);
                setEditedLogoUrl(compressedImage);
            } catch (error) {
                console.error("Image compression failed:", error);
                alert("Failed to process image.");
            }
        }
    };
    
    const handleSaveChanges = () => {
        if (editedName.trim()) {
            onUpdateSchoolDetails(school.id, editedName, editedLogoUrl);
            setIsEditingSchool(false);
        }
    };

    const handleCancelEdit = () => {
        setIsEditingSchool(false);
        setEditedName(school.name);
        setEditedLogoUrl(school.logoUrl || '');
    };

    const FeatureToggle: React.FC<{ feature: SchoolFeature; children?: React.ReactNode }> = ({ feature, children }) => (
         <div className={`p-3 rounded-lg flex items-center justify-between transition-opacity ${school.featureFlags[feature] !== false ? 'bg-green-50 dark:bg-green-900/20' : 'bg-gray-200 dark:bg-gray-700 opacity-60'}`}>
            <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={school.featureFlags[feature] !== false} onChange={() => onToggleFeatureFlag(feature)} className="sr-only peer" />
                     <div className="w-11 h-6 bg-gray-300 dark:bg-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
                <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{t(`${feature}_feature` as any)}</span>
            </div>
            {children}
        </div>
    );

    return (
        <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-2xl shadow-xl border-t-8 border-gray-700 dark:border-gray-600 w-full space-y-6 relative">
            <div className="absolute top-4 start-4 z-10 flex gap-2">
                <LanguageSwitcher />
                <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
            </div>
            <div className="flex justify-center items-center gap-2">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{school.name}</h1>
                <button onClick={() => setIsEditingSchool(true)} className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                </button>
            </div>


            {/* School Activation Toggle */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center justify-between">
                <span className="font-semibold text-lg text-gray-700 dark:text-gray-200">{t('schoolStatus')}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={school.isActive} onChange={onToggleStatus} className="sr-only peer" />
                    <div className="w-14 h-7 bg-gray-200 dark:bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
                    <span className={`mx-3 font-medium ${school.isActive ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                        {school.isActive ? t('active') : t('inactive')}
                    </span>
                </label>
            </div>
            
            {/* School Stages Toggle */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">المراحل التعليمية المفعلة</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {allStages.map(stage => (
                        <div key={stage} className={`p-3 rounded-lg flex items-center justify-center transition-all ${school.stages.includes(stage) ? 'bg-blue-100 dark:bg-blue-900/50' : 'bg-gray-100 dark:bg-gray-700'}`}>
                             <label className="flex items-center gap-3 cursor-pointer">
                                <input type="checkbox" checked={school.stages.includes(stage)} onChange={() => onToggleStage(stage)} className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                                <span className="font-semibold text-gray-700 dark:text-gray-200 text-sm">{t(`${stage.toLowerCase()}Stage` as any)}</span>
                            </label>
                        </div>
                    ))}
                 </div>
            </div>
            
            {/* Enter as Principal */}
             <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">{t('enterAsPrincipal')}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {school.stages.map(stage => (
                        <button
                            key={stage}
                            onClick={() => onEnterFeaturePage(Page.PrincipalDashboard, stage)}
                            className="bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-md w-full"
                        >
                            {t('enterPrincipalDashboard', { stageName: t(`${stage.toLowerCase()}Stage` as any) })}
                        </button>
                    ))}
                </div>
            </div>


            {/* Principal Management */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">{t('managePrincipals')}</h2>
                <div className="space-y-4 max-h-[40vh] overflow-y-auto p-2">
                    {allStages.map(stage => (
                        <div key={stage} className={`p-3 rounded-lg ${school.stages.includes(stage) ? 'bg-gray-50 dark:bg-gray-700/50' : 'bg-gray-200 dark:bg-gray-700 opacity-50'}`}>
                            <h3 className="font-semibold text-lg text-center mb-3 text-blue-600 dark:text-blue-400">{t('principalManagementForStage', { stageName: t(`${stage.toLowerCase()}Stage` as any) })}</h3>
                            
                            <div className="space-y-2 mb-4">
                                {(school.principals[stage] || []).map(principal => (
                                    <div key={principal.id} className="flex justify-between items-center bg-white dark:bg-gray-800 p-2 rounded shadow-sm">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-gray-200">{principal.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Code: {principal.loginCode}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button onClick={() => setEditingPrincipal({ stage, principal })} className="text-xs font-bold text-blue-600 dark:text-blue-400">{t('changePassword')}</button>
                                            <button onClick={() => handleDeletePrincipalClick(stage, principal)} className="text-xs font-bold text-red-500 dark:text-red-400">{t('delete')}</button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-2 items-end border-t dark:border-gray-600 pt-3">
                                <input type="text" placeholder={t('principalName')} value={newPrincipalInputs[stage]?.name || ''} onChange={e => handleInputChange(stage, 'name', e.target.value)} className="flex-1 p-2 border-2 border-gray-300 rounded text-sm bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" disabled={!school.stages.includes(stage)} />
                                <input type="text" placeholder={t('loginCode')} value={newPrincipalInputs[stage]?.code || ''} onChange={e => handleInputChange(stage, 'code', e.target.value)} className="flex-1 p-2 border-2 border-gray-300 rounded text-sm bg-white text-gray-900 dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" disabled={!school.stages.includes(stage)}/>
                                <button onClick={() => handleAddPrincipalClick(stage)} className="bg-blue-500 text-white font-bold p-2 rounded hover:bg-blue-600 text-sm" disabled={!school.stages.includes(stage)}>{t('add')}</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md">
                <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center mb-4">{t('featureToggleTitle')}</h2>
                <div className="space-y-6 max-h-[40vh] overflow-y-auto p-1">
                    {/* Principal Features */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">{t('principalFeaturesSection')}</h3>
                        <div className="space-y-3 p-2">
                             {principalFeatures.map(({ key }) => (
                                <FeatureToggle key={key} feature={key} />
                            ))}
                        </div>
                    </div>
                     {/* Teacher Features */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">{t('teacherFeaturesSection')}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 p-2">
                            {teacherFeatures.map(key => <FeatureToggle key={key} feature={key} />)}
                        </div>
                    </div>
                     {/* Guardian Features */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2 border-b pb-1">{t('guardianFeaturesSection')}</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3 p-2">
                            {guardianFeatures.map(key => <FeatureToggle key={key} feature={key} />)}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>

            {isEditingSchool && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md p-6 space-y-4">
                        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-100">تعديل معلومات المدرسة</h2>
                        <input type="text" value={editedName} onChange={e => setEditedName(e.target.value)} className="w-full p-3 border-2 border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                        <div className="flex flex-col items-center space-y-2">
                            <label className="text-gray-700 dark:text-gray-200">شعار المدرسة</label>
                            {editedLogoUrl && <img src={editedLogoUrl} alt="Logo Preview" className="w-20 h-20 rounded-full object-contain mb-2 bg-gray-200" />}
                            <input type="file" ref={fileInputRef} accept="image/*" onChange={handleLogoChange} className="w-full text-sm text-slate-500 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 dark:file:bg-blue-800 dark:file:text-blue-200 dark:hover:file:bg-blue-700" />
                        </div>
                        <div className="flex gap-4">
                            <button onClick={handleCancelEdit} className="flex-1 bg-gray-300 dark:bg-gray-600 py-2 rounded-lg">{t('cancel')}</button>
                            <button onClick={handleSaveChanges} className="flex-1 bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">{t('saveChanges')}</button>
                        </div>
                    </div>
                </div>
            )}

            {editingPrincipal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl space-y-4">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">{t('changePassword')} for {editingPrincipal.principal.name}</h3>
                        <input type="text" placeholder={t('newPassword')} value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border-2 rounded bg-white text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                        <div className="flex gap-2">
                            <button onClick={handleUpdatePasswordClick} className="flex-1 bg-green-500 text-white font-bold py-2 rounded">{t('savePassword')}</button>
                            <button onClick={() => setEditingPrincipal(null)} className="flex-1 bg-gray-300 dark:bg-gray-600 py-2 rounded">{t('cancel')}</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SuperAdminSchoolManagement;