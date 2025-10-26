
import React, { useState, useRef } from 'react';
import { Student, Note, Absence } from '../../core/types';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';

interface TeacherNotesFormProps {
    students: Student[];
    notes: Note[];
    absences: Absence[];
    onSave: (studentIds: string[], observation: string, files: { image?: string; pdf?: { name: string; url: string; } }, externalLink: string) => void;
    onDeleteNote: (id: number) => void;
    onDeleteAbsence: (id: number) => void;
    onMarkAbsent: (studentIds: string[]) => void;
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

const TeacherNotesForm: React.FC<TeacherNotesFormProps> = ({ students, notes, absences, onSave, onMarkAbsent, onBack, onLogout, onDeleteNote, onDeleteAbsence }) => {
    const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
    const [observation, setObservation] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [externalLink, setExternalLink] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const resetForm = () => {
        setSelectedStudentIds([]);
        setObservation('');
        setFile(null);
        setPreview(null);
        setExternalLink('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleStudentSelect = (studentId: string) => {
        setSelectedStudentIds(prev => prev.includes(studentId) ? prev.filter(id => id !== studentId) : [...prev, studentId]);
    };
    
    const handleSelectAll = () => {
        setSelectedStudentIds(selectedStudentIds.length === students.length ? [] : students.map(s => s.id));
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            if (selectedFile.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => setPreview(reader.result as string);
                reader.readAsDataURL(selectedFile);
            } else {
                setPreview(selectedFile.name);
            }
        }
    };

    const handleSave = async () => {
        if (selectedStudentIds.length === 0) {
            alert('الرجاء اختيار تلميذ واحد على الأقل.');
            return;
        }
        if (!observation.trim()) {
            alert('الرجاء كتابة الملاحظة.');
            return;
        }

        let files: { image?: string; pdf?: { name: string; url: string; } } = {};
        if (file) {
            if (file.type.startsWith('image/')) {
                files.image = await fileToBase64(file);
            } else if (file.type === 'application/pdf') {
                files.pdf = { name: file.name, url: URL.createObjectURL(file) };
            }
        }
        onSave(selectedStudentIds, observation, files, externalLink);
        resetForm();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 4000);
    };

    const handleAbsence = () => {
        if (selectedStudentIds.length === 0) {
            alert('الرجاء اختيار تلميذ واحد على الأقل لتسجيل الغياب.');
            return;
        }
        onMarkAbsent(selectedStudentIds);
        setSelectedStudentIds([]); // Reset selection after marking
    };

    const handleDeleteClick = (id: number, type: 'note' | 'absence') => {
        const message = type === 'note' 
            ? 'هل أنت متأكد من رغبتك في حذف هذه الملاحظة؟ (سيتم حذفها حتى لو كانت لدى المدير)'
            : 'هل أنت متأكد من رغبتك في حذف هذا الغياب؟';
        if (window.confirm(message)) {
            type === 'note' ? onDeleteNote(id) : onDeleteAbsence(id);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">إدارة الملاحظات والغيابات</h1>
            
            <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                     <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">الملاحظات المسجلة</h2>
                     <div className="max-h-32 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded-lg">
                        {notes.length > 0 ? (
                            notes.sort((a,b)=>b.date.getTime() - a.date.getTime()).map(note => (
                                <div key={note.id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                                    <p className="text-sm text-gray-600 truncate flex-grow">
                                        <span className={`inline-block w-2 h-2 rounded-full mr-2 ${note.status === 'pending' ? 'bg-yellow-400' : 'bg-green-500'}`}></span>
                                        {note.observation}
                                    </p>
                                    <button onClick={() => handleDeleteClick(note.id, 'note')} className="text-red-500 hover:text-red-700 font-bold px-2 text-sm flex-shrink-0">حذف</button>
                                </div>
                            ))
                        ) : <p className="text-gray-500 text-center py-4">لا توجد ملاحظات.</p>}
                     </div>
                </div>
                 <div>
                     <h2 className="text-lg font-semibold text-gray-700 mb-2 text-center">الغيابات المسجلة</h2>
                     <div className="max-h-32 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded-lg">
                         {absences.length > 0 ? (
                            absences.sort((a,b)=>b.date.getTime() - a.date.getTime()).map(absence => (
                                <div key={absence.id} className="flex items-center justify-between bg-white p-2 rounded-lg shadow-sm">
                                    <span className="text-sm text-gray-600">{students.find(s=>s.id === absence.studentId)?.name} - {new Date(absence.date).toLocaleDateString('ar-DZ')}</span>
                                    <button onClick={() => handleDeleteClick(absence.id, 'absence')} className="text-red-500 hover:text-red-700 font-bold px-2 text-sm flex-shrink-0">حذف</button>
                                </div>
                            ))
                        ) : <p className="text-gray-500 text-center py-4">لا توجد غيابات.</p>}
                     </div>
                </div>
            </div>

            <div className="space-y-4 border-t-2 border-dashed border-gray-300 pt-6">
                 <h2 className="text-xl font-semibold text-gray-700 mb-2">إضافة جديدة</h2>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="font-semibold text-gray-700">اختر التلاميذ:</h3>
                        <button onClick={handleSelectAll} className="text-sm font-semibold text-blue-600 hover:underline">
                            {selectedStudentIds.length === students.length ? 'إلغاء الكل' : 'تحديد الكل'}
                        </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-lg p-2 space-y-2 bg-gray-50">
                        {students.map(student => (
                            <div key={student.id} className="flex items-center p-2 rounded-md hover:bg-blue-50">
                                <input type="checkbox" id={`student-${student.id}`} checked={selectedStudentIds.includes(student.id)} onChange={() => handleStudentSelect(student.id)} className="w-5 h-5 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500" />
                                <label htmlFor={`student-${student.id}`} className="mr-3 text-gray-700 font-medium">{student.name}</label>
                            </div>
                        ))}
                    </div>
                </div>

                <textarea
                    value={observation}
                    onChange={(e) => setObservation(e.target.value)}
                    placeholder="اكتب ملاحظة..."
                    rows={5}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="🔗 رابط خارجي (اختياري)"
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                {preview && (
                        <div className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        {file && file.type.startsWith('image/') ? 
                            <img src={preview} alt="معاينة" className="max-h-40 mx-auto rounded-lg" />
                            : <p className="text-gray-700 font-semibold">{preview}</p>
                        }
                    </div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,.pdf" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition duration-300 ease-in-out shadow-md">
                    📎 إضافة ملف (صورة أو PDF)
                </button>

                <div className="flex gap-2">
                    <button onClick={handleSave} className="flex-1 bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition shadow-lg">
                        حفظ الملاحظة
                    </button>
                    <button onClick={handleAbsence} className="flex-1 bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition shadow-lg">
                        تسجيل غياب
                    </button>
                </div>
                {saveSuccess && <p className="text-green-600 text-center font-semibold animate-pulse">تم إرسال الملاحظة للمراجعة بنجاح!</p>}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherNotesForm;
