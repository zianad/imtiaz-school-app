
import React from 'react';
import { Project } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface GuardianViewProjectsProps {
    projects: Project[];
    onBack: () => void;
    onLogout: () => void;
}

const GuardianViewProjects: React.FC<GuardianViewProjectsProps> = ({ projects, onBack, onLogout }) => {
    const { t } = useTranslation();
    const sortedProjects = [...projects].sort((a,b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('unitProject')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2 bg-gray-50 rounded-lg">
                {sortedProjects.length > 0 ? (
                    sortedProjects.map(project => (
                        <div key={project.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-500">
                            <h2 className="font-bold text-xl text-blue-700 mb-2">{project.title}</h2>
                            <p className="text-gray-700 whitespace-pre-wrap mb-3">{project.description}</p>
                            <img src={project.image} alt={project.title} className="w-full h-auto rounded-md shadow-md"/>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500 py-10">{t('noProjects')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default GuardianViewProjects;
