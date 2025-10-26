
import React, { useState, useRef } from 'react';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { ExamProgram } from '../../core/types';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface TeacherExamProgramFormProps {
    programs: ExamProgram[];
    onSave: (data: { image?: string, pdf?: { name: string, url: string } }) => void;
    onDelete: (id: number) => void;
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

const TeacherExamProgramForm: React.FC<TeacherExamProgramFormProps> = ({ programs, onSave, onDelete, onBack, onLogout }) => {
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

    const handleDeleteClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا البرنامج؟')) {
            onDelete(id);
        }
    };
    
    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">إدارة برامج الفروض</h1>
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b-2 pb-2">البرامج المضافة حاليا</h2>
                <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded-lg">
                    {programs.length > 0 ? (
                        programs.sort((a,b) => b.id - a.id).map(program => (
                            <div key={program.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <span className="text-gray-800 font-medium">
                                    برنامج بتاريخ: {new Date(program.date).toLocaleDateString('ar-DZ')}
                                </span>
                                <button onClick={() => handleDeleteClick(program.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-md hover:bg-red-100 transition">
                                    حذف
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">لا توجد برامج مضافة بعد.</p>
                    )}
                </div>
            </div>

            <div className="space-y-4 border-t-2 border-dashed border-gray-300 pt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">إضافة برنامج جديد</h2>
                {preview && (
                    <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        {fileType === 'image' ? (
                            <img src={preview} alt="معاينة" className="max-h-60 mx-auto rounded-lg" />
                        ) : (
                            <p className="text-gray-700 font-semibold">{preview}</p>
                        )}
                    </div>
                )}
                
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*,.pdf"
                    className="hidden"
                />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 ease-in-out shadow-md"
                >
                    📎 إضافة ملف (صورة أو PDF)
                </button>

                <button
                    onClick={handleSave}
                    disabled={!selectedFile}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg disabled:bg-blue-300 disabled:cursor-not-allowed"
                >
                    حفظ البرنامج
                </button>
                 {saveSuccess && <p className="text-green-600 text-center font-semibold animate-pulse">تم الحفظ بنجاح!</p>}
            </div>
            
            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherExamProgramForm;