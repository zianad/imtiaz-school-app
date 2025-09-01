import React from 'react';
import { Note, Absence, Student, Subject, Grade, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


interface GuardianViewNotesProps {
    school: School;
    notes: Note[];
    absences: Absence[];
    student: Student;
    title: string;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewNotes: React.FC<GuardianViewNotesProps> = ({ school, notes, absences, student, title, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    
    const { t, language } = useTranslation();
    const isFrenchUI = language === 'fr';

    const studentNotes = notes
        .filter(note => note.studentIds.includes(student.id))
        .sort((a, b) => (b.date?.getTime() || 0) - (a.date?.getTime() || 0));

    const studentAbsences = absences
        .filter(absence => absence.studentId === student.id)
        .sort((a, b) => b.date.getTime() - a.date.getTime());

    const processGradesForChart = (gradesForSubject: Grade[] | undefined) => {
        const scoreLabel = isFrenchUI ? "Moyenne" : "المعدل";
        const assignments = [
            { semester: 1, assignment: 1, name: isFrenchUI ? 'DS 1 (S1)' : 'ف 1 (س1)' },
            { semester: 1, assignment: 2, name: isFrenchUI ? 'DS 2 (S1)' : 'ف 2 (س1)' },
            { semester: 2, assignment: 1, name: isFrenchUI ? 'DS 1 (S2)' : 'ف 1 (س2)' },
            { semester: 2, assignment: 2, name: isFrenchUI ? 'DS 2 (S2)' : 'ف 2 (س2)' },
        ];

        return assignments.map(point => {
            const relevantGrades = gradesForSubject?.filter(g => g.semester === point.semester && g.assignment === point.assignment && g.score !== null) || [];
            let average = null;
            if (relevantGrades.length > 0) {
                const sum = relevantGrades.reduce((acc, curr) => acc + (curr.score ?? 0), 0);
                average = parseFloat((sum / relevantGrades.length).toFixed(2));
            }
            return { name: point.name, [scoreLabel]: average };
        });
    };
    
    const relevantSubject = notes.length > 0 ? notes[0].subject : undefined;
    const chartData = relevantSubject ? processGradesForChart(student.grades[relevantSubject]) : [];
    const hasData = chartData.some(d => d[isFrenchUI ? "Moyenne" : "المعدل"] !== null);

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
            
            <div className="p-3 mb-6 bg-blue-50 text-blue-800 border-r-4 border-blue-500 rounded-lg text-center">
                ملاحظة: تظهر هنا فقط الملاحظات التي تمت مراجعتها والموافقة عليها من طرف الإدارة.
            </div>

            {hasData && (
                 <div className="mb-6 bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4">
                     <h2 className="font-semibold text-gray-700 mb-2 text-center text-lg">{isFrenchUI ? "Tendance des Notes" : "مبيان تطور النقط"}</h2>
                     <div className="w-full h-48">
                         <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" stroke="#4B5563" fontSize={12} />
                                <YAxis type="number" domain={[0, 10]} stroke="#4B5563" />
                                <Tooltip />
                                <Line connectNulls type="monotone" dataKey={isFrenchUI ? "Moyenne" : "المعدل"} stroke="#3B82F6" strokeWidth={3} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}
            
            <div className="space-y-6">
                <div className="bg-yellow-50 border-2 border-dashed border-yellow-400 rounded-lg p-4">
                    <h2 className="font-semibold text-yellow-800 mb-2 text-center text-lg">الغيابات المسجلة</h2>
                     {studentAbsences.length > 0 ? (
                        <ul className="list-none space-y-1 text-center">
                            {studentAbsences.map(absence => (
                                <li key={absence.id} className="text-gray-700 font-medium">
                                    {new Date(absence.date).toLocaleDateString('ar-DZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-center py-2">لا توجد غيابات مسجلة.</p>
                    )}
                </div>

                <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-lg p-4 min-h-[250px] max-h-[50vh] overflow-y-auto">
                    <h2 className="font-semibold text-gray-700 mb-3 text-center text-lg">ملاحظات الأستاذ</h2>
                    {studentNotes.length > 0 ? (
                        <div className="space-y-4">
                        {studentNotes.map(note => (
                            <div key={note.id} className="bg-white p-4 rounded-lg shadow-md border-r-4 border-blue-400">
                                {note.date && (
                                    <p className="text-sm text-gray-500 mb-1">
                                        {new Date(note.date).toLocaleDateString('ar-DZ', { year: 'numeric', month: 'long', day: 'numeric' })}
                                    </p>
                                )}
                                <p className="text-gray-700 whitespace-pre-wrap">{note.observation}</p>
                                {note.image && (
                                    <a href={note.image} target="_blank" rel="noopener noreferrer">
                                        <img src={note.image} alt="صورة مرفقة" className="mt-3 rounded-lg max-w-full h-auto shadow-sm" />
                                    </a>
                                )}
                                {note.pdf && (
                                     <a href={note.pdf.url} download={note.pdf.name} className="block w-full text-center mt-3 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 transition">
                                        تحميل PDF: {note.pdf.name}
                                    </a>
                                )}
                                {note.externalLink && (
                                     <a href={note.externalLink} target="_blank" rel="noopener noreferrer" className="block w-full text-center mt-3 bg-teal-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-teal-600 transition">
                                        🔗 رابط شرح إضافي
                                    </a>
                                )}
                            </div>
                        ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center pt-10">لا توجد ملاحظات موافق عليها.</p>
                    )}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};
export default GuardianViewNotes;