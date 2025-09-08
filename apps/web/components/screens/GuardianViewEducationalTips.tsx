import React, { useState, useEffect } from 'react';
import { EducationalTip, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewEducationalTipsProps {
    school: School;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewEducationalTips: React.FC<GuardianViewEducationalTipsProps> = ({ school, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [tips, setTips] = useState<EducationalTip[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTips = async () => {
            setIsLoading(true);
            const { data, error } = await supabase
                .from('educational_tips')
                .select('*')
                .eq('school_id', school.id)
                .order('date', { ascending: false });

            if (error) {
                console.error("Error fetching educational tips:", error);
            } else {
                setTips(snakeToCamelCase(data));
            }
            setIsLoading(false);
        };
        fetchTips();
    }, [school.id]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('educationalTips')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2">
                {isLoading ? (
                    <p className="text-center text-gray-500">{t('loading')}...</p>
                ) : tips.length > 0 ? tips.map(tip => (
                    <div key={tip.id} className="bg-gray-50 p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                        <p className="whitespace-pre-wrap">{tip.content}</p>
                        <p className="text-xs text-gray-400 mt-2 text-right">{new Date(tip.date).toLocaleDateString()}</p>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-10">{t('noTips')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewEducationalTips;