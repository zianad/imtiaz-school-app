import React, { useState, useEffect, useCallback } from 'react';
import { School, Student, EducationalStage } from '../../../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import { supabase } from '../../../../packages/core/supabaseClient';
import { camelToSnakeCase, snakeToCamelCase } from '../../../../packages/core/utils';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';

interface PrincipalManageStudentsProps {
    school: School;
    stage: EducationalStage;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const PrincipalManageStudents: React.FC<PrincipalManageStudentsProps> = ({ school, stage, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const stageDetails = STAGE_DETAILS[stage];
    const stageLevels = stageDetails.levels;

    // Form state
    const [name, setName] = useState('');
    const [guardianCode, setGuardianCode] = useState('');
    const [level, setLevel] = useState<string>(stageLevels[0]);
    const [studentClass, setStudentClass] = useState<string>(CLASSES[0]);

    // Filter state
    const [filterLevel, setFilterLevel] = useState<string>(stageLevels[0]);
    const [filterClass, setFilterClass] = useState<string>(CLASSES[0]);
    const [searchTerm, setSearchTerm] = useState('');

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('school_id', school.id)
            .eq('stage', stage);
        
        if (error) {
            console.error("Error fetching students", error);
        } else {
            setStudents(snakeToCamelCase(data));
        }
        setIsLoading(false);
    }, [school.id, stage]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);
    
    const resetForm = () => {
        setName('');
        setGuardianCode('');
        setLevel(stageLevels[0]);
        setStudentClass(CLASSES[0]);
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && guardianCode.trim() && level && studentClass) {
            const studentData = {
                name,
                guardian_code: guardianCode,
                stage,
                level,
                class: studentClass,
                grades: {},
                school_id: school.id,
            };
            
            const { error } = await supabase.from('students').insert([studentData]);
            
            if (error) {
                alert('Error saving student: ' + error.message);
            } else {
                resetForm();
                fetchStudents();
            }
        } else {
            alert(t('fillAllFields' as any));
        }
    };

    const handleDeleteStudent = async (studentId: string) => {
        if (window.confirm(t('confirmDeleteStudent' as any, { name: students.find(s => s.id === studentId)?.name }))) {
            const { error } = await supabase.from('students').delete().match({ id: studentId });
            if (error) {
                alert('Error deleting student: ' + error.message);
            } else {
                fetchStudents();
            }
        }
    };

    const filteredStudents = students
        .filter(s => s.level === filterLevel && s.class === filterClass)
        .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-slate-700 w-full relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('manageStudents')}</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Form Section */}
                <form onSubmit={handleAddStudent} className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                     <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addStudent')}</h2>
                    <input type="text" placeholder={t('studentName')} value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"/>
                    <input type="text" placeholder={t('guardianCode')} value={guardianCode} onChange={e => setGuardianCode(e.target.value)} required className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200"/>
                    
                    <div className="flex gap-2">
                        <select value={level} onChange={e => setLevel(e.target.value)} className="w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                            {stageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                         <select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700">{t('addStudent')}</button>
                </form>

                {/* List Section */}
                 <div className="space-y-3 p-2">
                     <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center mb-2">{t('existingStudents')}</h2>
                     <div className="flex gap-2 p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                            {stageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                         <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="w-1/2 p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200">
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                     </div>
                     <input type="text" placeholder={t('searchByName' as any)} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
                     
                    <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
                        {isLoading ? <p className="text-center dark:text-gray-300">{t('loading')}...</p> : filteredStudents.map(student => (
                            <div key={student.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{student.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Code: {student.guardianCode}</p>
                                </div>
                                <button onClick={() => handleDeleteStudent(student.id)} className="text-sm font-semibold text-red-600 hover:underline">{t('delete')}</button>
                            </div>
                        ))}
                         {!isLoading && filteredStudents.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noStudentsInClass' as any)}</p>}
                    </div>
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalManageStudents;
