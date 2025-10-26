
import React, { useState, useRef } from 'react';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import { Summary, Exercise } from '../../core/types';
import LanguageSwitcher from '../common/LanguageSwitcher';

type ContentItem = Summary | Exercise;

interface TeacherContentFormProps {
    title: string;
    items: ContentItem[];
    onSave: (field1: string, field2: string, files: { image?: string; pdf?: { name: string; url: string; } }, externalLink: string) => void;
    onDelete: (id: number) => void;
    onBack: () => void;
    onLogout: () => void;
    showTitleField?: boolean;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const TeacherContentForm: React.FC<TeacherContentFormProps> = ({ title, items, onSave, onDelete, onBack, onLogout, showTitleField = false }) => {
    const [field1, setField1] = useState(''); // Title
    const [field2, setField2] = useState(''); // Content
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [externalLink, setExternalLink] = useState('');
    const [saveSuccess, setSaveSuccess] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const resetForm = () => {
        setField1('');
        setField2('');
        setFile(null);
        setPreview(null);
        setExternalLink('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

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
        if ((showTitleField && !field1.trim()) && !field2.trim()) {
            alert('يجب ملء حقل العنوان أو المحتوى على الأقل.');
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
        
        onSave(field1, field2, files, externalLink);
        resetForm();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
    };
    
    const handleDeleteClick = (id: number) => {
        if (window.confirm('هل أنت متأكد من رغبتك في حذف هذا العنصر؟')) {
            onDelete(id);
        }
    };

    const field2Label = showTitleField ? "أضف الملخص" : "أضف التمارين";

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border-t-8 border-blue-600 animate-fade-in relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">{title}</h1>
            
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-3 border-b-2 pb-2">العناصر المضافة حاليا</h2>
                <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-gray-100 rounded-lg">
                    {items.length > 0 ? (
                        items.sort((a,b) => b.id - a.id).map(item => (
                            <div key={item.id} className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
                                <span className="text-gray-800 font-medium">
                                    {'title' in item && item.title ? item.title : `تمرين بتاريخ: ${new Date((item as Exercise).date).toLocaleDateString('ar-DZ')}`}
                                </span>
                                <button onClick={() => handleDeleteClick(item.id)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-md hover:bg-red-100 transition">
                                    حذف
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center py-4">لا توجد عناصر مضافة بعد.</p>
                    )}
                </div>
            </div>

            <div className="space-y-4 border-t-2 border-dashed border-gray-300 pt-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">إضافة عنصر جديد</h2>
                {showTitleField && (
                     <input
                        type="text"
                        value={field1}
                        onChange={(e) => setField1(e.target.value)}
                        placeholder="أضف عنوان الملخص"
                        className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    />
                )}

                <textarea
                    value={field2}
                    onChange={(e) => setField2(e.target.value)}
                    placeholder={field2Label}
                    rows={6}
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />

                <input
                    type="url"
                    value={externalLink}
                    onChange={(e) => setExternalLink(e.target.value)}
                    placeholder="🔗 رابط خارجي للشرح (اختياري)"
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
                
                <button
                    onClick={handleSave}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg"
                >
                    حفظ
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

export default TeacherContentForm;