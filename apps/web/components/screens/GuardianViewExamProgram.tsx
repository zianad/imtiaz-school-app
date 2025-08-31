import React from 'react';
import { ExamProgram, School } from '../../../../packages/core/types';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface GuardianViewExamProgramProps {
    school: School;
    programs: ExamProgram[];
    isFrenchUI: boolean;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewExamProgram: React.FC<GuardianViewExamProgramProps> = ({ school, programs, isFrenchUI, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const title = isFrenchUI ? "Programme des Devoirs" : "برنامج الفروض";
    const noContentMsg = isFrenchUI ? "Aucun programme de devoirs n'est disponible pour le moment." : "لا يوجد برنامج فروض لعرضه حاليا.";
    const downloadLabel = isFrenchUI ? "Télécharger le Programme" : "تحميل برنامج الفروض";

    const sortedPrograms = programs.sort((a, b) => b.date.getTime() - a.date.getTime());

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in w-full relative">
             <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h1>

            <div className="w-full min-h-[400px] max-h-[60vh] overflow-y-auto bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4">
                {sortedPrograms.length > 0 ? (
                    <div className="space-y-4">
                        {sortedPrograms.map((program) => (
                            <div key={program.id} className="bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-400">
                                <p className="text-md text-gray-600 mb-2 font-semibold">{program.date.toLocaleDateString(isFrenchUI ? 'fr-FR' : 'ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                {program.image && (
                                    <img src={program.image} alt="Program" className="w-full h-auto rounded-md shadow" />
                                )}
                                {program.pdf && (
                                    <a
                                        href={program.pdf.url}
                                        download={program.pdf.name}
                                        className="inline-block w-full text-center mt-3 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
                                    >
                                        {downloadLabel} ({program.pdf.name})
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500 text-lg">{noContentMsg}</p>
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

export default GuardianViewExamProgram;