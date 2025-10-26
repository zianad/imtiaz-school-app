import React from 'react';
import { UnifiedAssessment } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewUnifiedAssessmentsProps {
    assessments: UnifiedAssessment[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewUnifiedAssessments: React.FC<GuardianViewUnifiedAssessmentsProps> = ({ assessments, onBack, onLogout }) => {
    const { t } = useTranslation();

    const sortedAssessments = assessments.sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
            <div className="absolute top-4 start-4 z-10"><LanguageSwitcher /></div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{t('unifiedAssessments')}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4">
                {sortedAssessments.length > 0 ? (
                    <div className="space-y-4">
                        {sortedAssessments.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-400">
                                <h2 className="font-bold text-xl text-gray-800">{item.title}</h2>
                                <p className="text-sm text-gray-500 mb-2">{new Date(item.date).toLocaleDateString()}</p>
                                {item.image && <img src={item.image} alt={item.title} className="w-full h-auto rounded-md shadow" />}
                                {item.pdf && (
                                    <a href={item.pdf.url} download={item.pdf.name} className="inline-block w-full text-center mt-3 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600">
                                        {t('download')} PDF ({item.pdf.name})
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">{t('noAssessments')}</p>
                    </div>
                )}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewUnifiedAssessments;