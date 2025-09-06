import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Student, EducationalStage, School, Grade, Subject } from '../../../../packages/core/types';
import { STAGE_DETAILS, CLASSES, getBlankGrades } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import { supabase } from '../../../../packages/core/supabaseClient';
import { camelToSnakeCase, snakeToCamelCase } from '../../../../packages/core/utils';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import ConfirmationModal from '../common/ConfirmationModal';

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
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

    // Form state
    const [name, setName] = useState('');
    const [guardianCode, setGuardianCode] = useState('');
    const [level, setLevel] = useState<string>(STAGE_DETAILS[stage].levels[0]);
    const [studentClass, setStudentClass] = useState<string>(CLASSES[0]);

    // Filter state
    const [filterLevel, setFilterLevel] = useState<string>(STAGE_DETAILS[stage].levels[0]);
    const [filterClass, setFilterClass] = useState<string>('all');

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('school_id', school.id)
            .eq('stage', stage);
        
        if (error) {
            console.error("Error fetching students:", error);
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
        setLevel(STAGE_DETAILS[stage].levels[0]);
        setStudentClass(CLASSES[0]);
    };

    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim() || !guardianCode.trim()) {
            alert(t('fillAllFields'));
            return;
        }

        const grades: { [key in Subject]?: Grade[] } = {};
        STAGE_DETAILS[stage].subjects.forEach(subject => {
            grades[subject] = getBlankGrades(subject);
        });

        const newStudentData = {
            school_id: school.id,
            name,
            guardian_code: guardianCode,
            stage,
            level,
            class: studentClass,
            grades,
        };
        
        const { error } = await supabase.from('students').insert(newStudentData);

        if (error) {
            alert('Failed to add student: ' + error.message);
        } else {
            await fetchStudents();
            resetForm();
            setIsFormVisible(false);
        }
    };
    
    const handleDelete = async () => {
        if (!studentToDelete) return;

        const { error } = await supabase
            .from('students')
            .delete()
            .match({ id: studentToDelete.id });
        
        if (error) {
            alert('Failed to delete student: ' + error.message);
        } else {
            setStudents(prev => prev.filter(s => s.id !== studentToDelete.id));
        }
        setStudentToDelete(null);
    };

    const filteredStudents = useMemo(() => {
        return students
            .filter(s => s.level === filterLevel && (filterClass === 'all' || s.class === filterClass))
            .sort((a, b) => a.name.localeCompare(b.name));
    }, [students, filterLevel, filterClass]);

    return (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-slate-700 w-full relative">
            <ConfirmationModal
                isOpen={!!studentToDelete}
                title={`${t('delete')} ${studentToDelete?.name}`}
                message={`هل أنت متأكد من رغبتك في حذف التلميذ؟ لا يمكن التراجع عن هذا الإجراء.`}
                onConfirm={handleDelete}
                onCancel={() => setStudentToDelete(null)}
            />
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('manageStudents')}</h1>
            
            {!isFormVisible && (
                <button 
                    onClick={() => setIsFormVisible(true)}
                    className="w-full bg-blue-600 text-white font-bold py-3 mb-6 rounded-lg hover:bg-blue-700 transition"
                >
                    + {t('addStudent')}
                </button>
            )}

            {isFormVisible && (
                <form onSubmit={handleAddStudent} className="mb-6 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-3">
                    <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-gray-200">{t('addStudent')}</h2>
                    <input type="text" placeholder={t('studentName')} value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded" />
                    <input type="text" placeholder={t('guardianCode')} value={guardianCode} onChange={e => setGuardianCode(e.target.value)} required className="w-full p-2 border rounded" />
                    <div className="flex gap-2">
                         <select value={level} onChange={e => setLevel(e.target.value)} className="w-1/2 p-2 border rounded">
                            {STAGE_DETAILS[stage].levels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="w-1/2 p-2 border rounded">
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-2">
                        <button type="submit" className="flex-1 bg-green-500 text-white font-bold py-2 rounded-lg hover:bg-green-600">{t('save')}</button>
                        <button type="button" onClick={() => setIsFormVisible(false)} className="flex-1 bg-gray-300 font-bold py-2 rounded-lg hover:bg-gray-400">{t('cancel')}</button>
                    </div>
                </form>
            )}

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex gap-2 mb-4">
                     <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)} className="flex-1 p-2 border rounded">
                        {STAGE_DETAILS[stage].levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={filterClass} onChange={e => setFilterClass(e.target.value)} className="flex-1 p-2 border rounded">
                        <option value="all">{t('all')}</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                 <div className="max-h-80 overflow-y-auto space-y-2">
                    {isLoading ? <p>Loading...</p> : filteredStudents.length > 0 ? filteredStudents.map(student => (
                        <div key={student.id} className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm flex justify-between items-center">
                            <div>
                                <p className="font-semibold text-gray-800 dark:text-gray-200">{student.name}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Code: {student.guardianCode}</p>
                            </div>
                            <button onClick={() => setStudentToDelete(student)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 text-sm">{t('delete')}</button>
                        </div>
                    )) : <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noStudents')}</p>}
                </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
                <div className="w-1/2">
                    <BackButton onClick={onBack} />
                </div>
                <div className="w-1/2">
                    <LogoutButton onClick={onLogout} />
                </div>
            </div>
        </div>
    );
};

export default PrincipalManageStudents;
