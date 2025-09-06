import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';
import { Student, EducationalStage, School } from '../../../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';
import * as XLSX from 'xlsx';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase, camelToSnakeCase } from '../../../../packages/core/utils';

// EditStudentModal remains mostly the same as it's a sub-component
const EditStudentModal: React.FC<{
    student: Student;
    stageLevels: string[];
    onSave: (updatedStudent: Student) => void;
    onCancel: () => void;
    t: (key: any) => string;
}> = ({ student, stageLevels, onSave, onCancel, t }) => {
    const [formData, setFormData] = useState<Omit<Student, 'id' | 'grades' | 'stage'>>({
        name: student.name,
        guardianCode: student.guardianCode,
        level: student.level,
        class: student.class,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...student, ...formData });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">{t('edit')} {student.name}</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" name="name" placeholder={t('studentName')} value={formData.name} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg" required />
                    <input type="text" name="guardianCode" placeholder={t('guardianCode')} value={formData.guardianCode} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg" required />
                    <div className="grid grid-cols-2 gap-4">
                        <select name="level" value={formData.level} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg">
                            {stageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <select name="class" value={formData.class} onChange={handleChange} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 rounded-lg">
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={onCancel} className="w-full bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200">{t('cancel')}</button>
                        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700">{t('saveChanges')}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const PrincipalManageStudents: React.FC<{
    school: School;
    stage: EducationalStage;
    onBack: () => void;
    onLogout: () => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}> = ({ school, stage, onBack, onLogout, toggleDarkMode, isDarkMode }) => {
    const { t } = useTranslation();
    const stageLevels = STAGE_DETAILS[stage].levels;
    const [students, setStudents] = useState<Student[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [name, setName] = useState('');
    const [guardianCode, setGuardianCode] = useState('');
    const [level, setLevel] = useState<string>(stageLevels[0]);
    const [studentClass, setStudentClass] = useState<string>(CLASSES[0]);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const [importLevel, setImportLevel] = useState<string>(stageLevels[0]);
    const [importClass, setImportClass] = useState<string>(CLASSES[0]);
    const [excelFile, setExcelFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchStudents = useCallback(async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .eq('school_id', school.id)
            .eq('stage', stage);
        
        if (error) {
            console.error("Error fetching students:", error);
            setStudents([]);
        } else {
            setStudents(snakeToCamelCase(data) as Student[]);
        }
        setIsLoading(false);
    }, [school.id, stage]);

    useEffect(() => {
        fetchStudents();
    }, [fetchStudents]);

    const groupedStudents = useMemo(() => {
        const groups: { [key: string]: Student[] } = {};
        students.forEach(student => {
            const key = `${student.level} - ${student.class}`;
            if (!groups[key]) groups[key] = [];
            groups[key].push(student);
        });
        for (const key in groups) {
            groups[key].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        }
        return groups;
    }, [students]);

    const onAddStudent = async (student: Omit<Student, 'id' | 'grades'>) => {
        const { error } = await supabase.from('students').insert([camelToSnakeCase({ ...student, school_id: school.id })]);
        if (error) console.error("Error adding student", error);
    };

    const onAddMultipleStudents = async (newStudents: Omit<Student, 'id' | 'grades'>[]) => {
        const studentsToInsert = newStudents.map(s => camelToSnakeCase({ ...s, school_id: school.id }));
        const { error } = await supabase.from('students').insert(studentsToInsert);
        if (error) console.error("Error bulk adding students", error);
    };

    const onUpdateStudent = async (student: Student) => {
        const { error } = await supabase.from('students').update(camelToSnakeCase(student)).eq('id', student.id);
        if (error) console.error("Error updating student", error);
    };

    const onDeleteStudent = async (studentId: string, studentName: string) => {
        if (window.confirm(t('confirmDeleteStudent', { name: studentName }))) {
            const { error } = await supabase.from('students').delete().eq('id', studentId);
            if (error) console.error("Error deleting student", error);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && guardianCode.trim() && level && studentClass) {
            await onAddStudent({ name, guardianCode, stage, level, class: studentClass });
            setName('');
            setGuardianCode('');
            await fetchStudents();
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const handleDelete = async (studentId: string, studentName: string) => {
        await onDeleteStudent(studentId, studentName);
        await fetchStudents();
    };
    
    const handleSaveUpdate = async (updatedStudent: Student) => {
        await onUpdateStudent(updatedStudent);
        setEditingStudent(null);
        await fetchStudents();
    };

    const handleFileImport = () => {
        if (!excelFile || !importLevel || !importClass) {
             alert(t('selectLevelAndClass'));
            return;
        }
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                const newStudents = json.slice(1).map(row => ({
                    name: String(row[0] || '').trim(),
                    guardianCode: String(row[1] || '').trim(),
                    stage: stage,
                    level: importLevel,
                    class: importClass,
                })).filter(s => s.name && s.guardianCode);

                if (newStudents.length > 0) {
                    await onAddMultipleStudents(newStudents);
                    alert(t('importSuccess', {count: String(newStudents.length)}));
                    await fetchStudents();
                } else {
                     alert(t('importError'));
                }
            } catch (error) {
                console.error("Error reading Excel file:", error);
                alert(t('importError'));
            } finally {
                setExcelFile(null);
                if(fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsArrayBuffer(excelFile);
    };

    return (
         <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 w-full relative">
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
            
            <div className="mb-8 p-4 bg-blue-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('importFromExcel')}</h2>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">{t('importInstructions')}</p>
                <div className="grid grid-cols-2 gap-4">
                    <select value={importLevel} onChange={e => setImportLevel(e.target.value)} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg">
                        {stageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={importClass} onChange={e => setImportClass(e.target.value)} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg">
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <input type="file" accept=".xlsx, .xls" onChange={(e) => setExcelFile(e.target.files?.[0] || null)} ref={fileInputRef} className="w-full text-sm text-slate-500 dark:text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 dark:file:bg-blue-800 dark:file:text-blue-200 dark:hover:file:bg-blue-700" />
                <button onClick={handleFileImport} disabled={!excelFile} className="w-full bg-emerald-500 text-white font-bold py-3 rounded-lg hover:bg-emerald-600 transition shadow-lg disabled:bg-gray-400">{t('import')}</button>
            </div>

            <form onSubmit={handleAdd} className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addStudent')}</h2>
                <input type="text" placeholder={t('studentName')} value={name} onChange={e => setName(e.target.value)} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg" required />
                <input type="text" placeholder={t('guardianCode')} value={guardianCode} onChange={e => setGuardianCode(e.target.value)} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg" required />
                
                <div className="grid grid-cols-2 gap-4">
                    <select value={level} onChange={e => setLevel(e.target.value)} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg">
                        {stageLevels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <select value={studentClass} onChange={e => setStudentClass(e.target.value)} className="w-full p-3 border-2 border-gray-300 bg-white text-gray-900 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-lg">
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>

                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg">{t('addStudent')}</button>
            </form>
            <div>
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 text-center border-t dark:border-gray-600 pt-4">{t('existingStudents')}</h2>
                {isLoading ? <p className="text-center dark:text-gray-300">Loading...</p> : (
                    <div className="max-h-96 overflow-y-auto space-y-4 p-2">
                        {Object.entries(groupedStudents).map(([groupName, studentsInGroup]) => (
                            <div key={groupName}>
                                <h3 className="font-bold text-center text-lg text-blue-600 dark:text-blue-400 my-2">{groupName}</h3>
                                {studentsInGroup.map(student => (
                                    <div key={student.id} className="bg-white dark:bg-gray-700/50 p-3 rounded-lg shadow-sm mb-2">
                                        <div className="flex justify-between items-center">
                                            <p className="font-semibold text-gray-800 dark:text-gray-200">{student.name}</p>
                                            <div className="flex gap-4">
                                                <button onClick={() => setEditingStudent(student)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline text-sm">{t('edit')}</button>
                                                <button onClick={() => handleDelete(student.id, student.name)} className="font-medium text-red-600 dark:text-red-500 hover:underline text-sm">{t('delete')}</button>
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t('guardianCode')}: {student.guardianCode}</p>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
            
            {editingStudent && (
                <EditStudentModal
                    student={editingStudent}
                    stageLevels={stageLevels}
                    onSave={handleSaveUpdate}
                    onCancel={() => setEditingStudent(null)}
                    t={t}
                />
            )}
        </div>
    );
};

export default PrincipalManageStudents;
