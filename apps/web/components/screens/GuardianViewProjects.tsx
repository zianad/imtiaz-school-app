import React, { useState, useEffect } from 'react';
import { Project, School, Student, Subject } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';

interface GuardianViewProjectsProps {
    school: School;
    student: Student;
    subject: Subject | null;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewProjects: React.FC<GuardianViewProjectsProps> = ({ school, student, subject, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [projects, setProjects] = useState<Project[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!subject) return;
            setIsLoading(true);
            const { data, error } = await supabase
                .from('projects')
                .select('*')
                .eq('school_id', school.id)
                .eq('level', student.level)
                .eq('subject', subject)
                .order('date', { ascending: false });

            if (error) console.error("Error fetching projects:", error);
            else setProjects(snakeToCamelCase(data));
            setIsLoading(false);
        };
        fetchProjects();
    }, [school.id, student.level, subject]);

    const sortedProjects = projects;

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
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('unitProject')}</h1>
            
            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2 bg-gray-50 rounded-lg">
                {isLoading ? <p>{t('loading')}...</p> : sortedProjects.length > 0 ? (
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