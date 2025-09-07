import React, { useState, useEffect, useCallback, useRef } from 'react';
import { School, Student, EducationalStage } from '../../../../packages/core/types';
import { STAGE_DETAILS, CLASSES } from '../../../../packages/core/constants';
import { useTranslation } from '../../../../packages/core/i18n';
import { supabase } from '../../../../packages/core/supabaseClient';
import { snakeToCamelCase } from '../../../../packages/core/utils';
import BackButton from '../../../../packages/ui/BackButton';
import LogoutButton from '../../../../packages/ui/LogoutButton';
import LanguageSwitcher from '../../../../packages/ui/LanguageSwitcher';
import ThemeSwitcher from '../../../../packages/ui/ThemeSwitcher';
import * as XLSX from 'xlsx';

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

    const [name, setName] = useState('');
    const [guardianCode, setGuardianCode] = useState('');
    const [level, setLevel] = useState<string>(stageLevels[0]);
    const [studentClass, setStudentClass] = useState<string>(CLASSES[0]);

    const [filterLevel, setFilterLevel] = useState<string>(stageLevels[0]);
    const [filterClass, setFilterClass] = useState<string>(CLASSES[0]);
    const [searchTerm, setSearchTerm] = useState('');
    
    const [isImporting, setIsImporting] = useState(false);
    const [importStatus, setImportStatus] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);


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
    };

    const addStudentAndCreateGuardian = async (studentData: Omit<Student, 'id' | 'grades'>): Promise<{success: boolean, error?: string}> => {
        const { data: existingStudent, error: checkError } = await supabase
            .from('students')
            .select('id')
            .eq('school_id', school.id)
            .eq('guardian_code', studentData.guardianCode)
            .maybeSingle();

        if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is 'exact one row not found' which is fine
             return { success: false, error: checkError.message };
        }
        if (existingStudent) {
            return { success: false, error: t('guardianCodeInUseError', { code: studentData.guardianCode }) };
        }

        // Create auth user first
        const email = `${studentData.guardianCode}@${school.id}.com`;
        const password = `ImtiazApp_${studentData.guardianCode}_S3cure!`;
        const { data: authData, error: signUpError } = await supabase.auth.signUp({ email, password });

        if (signUpError || !authData.user) {
            return { success: false, error: `Guardian login creation failed: ${signUpError?.message}` };
        }
        
        // Then insert student profile
        const { error: insertError } = await supabase.from('students').insert([
            {
                id: authData.user.id, // Use the auth user ID as the student's primary key
                name: studentData.name,
                guardian_code: studentData.guardianCode,
                stage: studentData.stage,
                level: studentData.level,
                class: studentData.class,
                school_id: school.id
            }
        ]);
        
        if (insertError) {
            // Rollback auth user creation if profile insert fails
            await supabase.auth.admin.deleteUser(authData.user.id);
            return { success: false, error: insertError.message };
        }

        return { success: true };
    };


    const handleAddStudent = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name.trim() && guardianCode.trim() && level && studentClass) {
            const result = await addStudentAndCreateGuardian({
                name,
                guardianCode,
                stage,
                level,
                class: studentClass
            });

            if (result.success) {
                resetForm();
                await fetchStudents();
            } else {
                alert(result.error || 'An unknown error occurred.');
            }
        } else {
            alert(t('fillAllFields'));
        }
    };
    
    const handleDeleteStudent = async (student: Student) => {
        if (window.confirm(t('confirmDeleteStudent', { name: student.name }))) {
            const { error } = await supabase.from('students').delete().match({ id: student.id });
            if (error) {
                alert('Error deleting student: ' + error.message);
            } else {
                await fetchStudents();
            }
        }
    };
    
    const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (e) => {
            setIsImporting(true);
            setImportStatus(t('importProcessing'));
            try {
                const data = new Uint8Array(e.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[sheetName];
                const json: any[] = XLSX.utils.sheet_to_json(worksheet);
                
                let successCount = 0;
                let errorCount = 0;
                const errors: string[] = [];

                for (const row of json) {
                    const studentName = row['name'] || row['الاسم'];
                    const code = row['guardian_code'] || row['رمز ولي الأمر'];

                    if (studentName && code) {
                        const result = await addStudentAndCreateGuardian({
                            name: String(studentName),
                            guardianCode: String(code),
                            stage: stage,
                            level: filterLevel,
                            class: filterClass
                        });
                        if (result.success) {
                            successCount++;
                        } else {
                            errorCount++;
                            errors.push(`${studentName} (${code}): ${result.error}`);
                        }
                    } else {
                        errorCount++;
                        errors.push(`${t('importMissingData')}: ${JSON.stringify(row)}`);
                    }
                }
                setImportStatus(t('importReport', { successCount, errorCount, total: json.length, errors: errors.join('\n') }));
                await fetchStudents();
            } catch (error) {
                console.error(error);
                setImportStatus(t('importError'));
            } finally {
                setIsImporting(false);
                if(fileInputRef.current) fileInputRef.current.value = "";
            }
        };
        reader.readAsArrayBuffer(file);
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
                <div className="space-y-4">
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
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-3">
                        <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('importFromExcel')}</h2>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400">{t('importExcelInstructions')}</p>
                        <p className="text-xs text-center text-gray-500 dark:text-gray-400"><strong>{t('importExcelNote', { level: filterLevel, class: filterClass })}</strong></p>
                        <input type="file" ref={fileInputRef} onChange={handleFileImport} accept=".xlsx, .xls" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} disabled={isImporting} className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400">
                            {isImporting ? t('importing') : t('selectExcelFile')}
                        </button>
                        {importStatus && (
                            <div className="mt-2 p-2 bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 text-xs rounded whitespace-pre-wrap">
                                {importStatus}
                            </div>
                        )}
                    </div>
                </div>

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
                     <input type="text" placeholder={t('searchByName')} value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-600 dark:text-gray-200" />
                     
                    <div className="max-h-[50vh] overflow-y-auto space-y-2 pr-1">
                        {isLoading ? <p className="text-center dark:text-gray-300">{t('loading')}...</p> : filteredStudents.map(student => (
                            <div key={student.id} className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg shadow-sm flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-gray-800 dark:text-gray-100">{student.name}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Code: {student.guardianCode}</p>
                                </div>
                                <button onClick={() => handleDeleteStudent(student)} className="text-sm font-semibold text-red-600 hover:underline">{t('delete')}</button>
                            </div>
                        ))}
                         {!isLoading && filteredStudents.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">{t('noStudentsInClass')}</p>}
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