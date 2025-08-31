


import React, { useState, useRef } from 'react';
import { ExamProgram, School } from '../../../../packages/core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherExamProgramFormProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    programs: ExamProgram[];
    onSave: (data: { image?: string, pdf?: { name: string, url: string } }) => void;
    onDelete: (program: ExamProgram) => void;
    onBack: () => void;
    onLogout: () => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const TeacherExamProgramForm: React.FC<TeacherExamProgramFormProps> = ({ school, toggleDarkMode, isDarkMode, programs, onSave, onDelete, onBack, onLogout }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setSelectedFile(null);
        setPreview(null);
        setFileType(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            if (file.type.startsWith('image/')) {
                 setFileType('image');
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result as string);
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf') {
                setFileType('pdf');
                setPreview(file.name);
            }
        }
    };
    
    const handleSave = async () => {
        if (!selectedFile || !fileType) return;
        
        if (fileType === 'image') {
            const base64Image = await fileToBase64(selectedFile);
            onSave({ image: base64Image });
        } else if (fileType === 'pdf') {
            const pdfUrl = URL.createObjectURL(selectedFile);
            onSave({ pdf: { name: selectedFile.name, url: pdfUrl } });
        }
        resetForm();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };

    const handleDeleteClick = (program: ExamProgram) => {
        onDelete(program);
    };
    
    return (
        <div className="bg-white dark:bg-gray-800 p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 dark:border-blue-500 animate-fade-in relative">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    {school.logoUrl && <img src={school.logoUrl} alt={`${school.name} Logo`} className="w-12 h-12 rounded-full object-contain shadow-sm bg-white" />}
                </div>
                <div className="flex items-center gap-2">
                    <LanguageSwitcher />
                    <ThemeSwitcher toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
                </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">إدارة برامج الفروض</h1>
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b-2 dark:border-gray-600 pb-2">البرامج المضافة حاليا</h2>
                <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    {programs.length > 0 ? (
                        programs.sort((a,b) => b.id - a.id).map(program => (
                            <div key={program.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                <span className="text-gray-800 dark:text-gray-200 font-medium">
                                    برنامج بتاريخ: {new Date(program.date).toLocaleDateString('ar-DZ')}
                                </span>
                                <button onClick={() => handleDeleteClick(program)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition">
                                    حذف
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">لا توجد برامج مضافة بعد.</p>
                    )}
                </div>
            </div>

            <div className="space-y-4 border-t-2 border-dashed border-gray-300 dark:border-gray-600 pt-6">
                {preview && (
                    <div className="w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center">
                        {fileType === 'image' ? 
                            <img src={preview} alt="معاينة" className="max-h-60 mx-auto rounded-lg" />
                            : <p className="text-gray-700 dark:text-gray-300 font-semibold">{preview}</p>
                        }
                    </div>
                )}
                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-md dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    📎 إرفاق ملف (صورة أو PDF)
                </button>
                <button
                    onClick={handleSave}
                    disabled={!selectedFile}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg disabled:bg-gray-400"
                >
                    حفظ
                </button>
                {saveSuccess && <p className="text-green-600 dark:text-green-400 text-center font-semibold animate-pulse">تم الحفظ بنجاح!</p>}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherExamProgramForm;
