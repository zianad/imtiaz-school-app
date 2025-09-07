import React, { useState, useRef } from 'react';
import { GoogleGenAI, GenerateContentResponse, Type } from '@google/genai';
import { Quiz, Question, School } from '../../../../packages/core/types';
import { useTranslation } from '../../../../packages/core/i18n';
import BackButton from '../common/BackButton';
import LogoutButton from '../common/LogoutButton';
import LanguageSwitcher from '../common/LanguageSwitcher';
import ThemeSwitcher from '../common/ThemeSwitcher';

interface TeacherAddQuizProps {
    school: School;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
    quizzes: Quiz[];
    onSave: (quiz: Omit<Quiz, 'id'|'level'|'class'|'subject'|'date'|'stage'>) => void;
    onDelete: (quiz: Quiz) => void;
    onBack: () => void;
    onLogout: () => void;
}

const fileToGenerativePart = (file: File): Promise<{mimeType:string, data:string}> => {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = (reader.result as string).split(',')[1];
        resolve({
          mimeType: file.type,
          data: result,
        });
      };
      reader.onerror = err => reject(err);
   });
};

const TeacherAddQuiz: React.FC<TeacherAddQuizProps> = ({ school, toggleDarkMode, isDarkMode, quizzes, onSave, onDelete, onBack, onLogout }) => {
    // FIX: Destructure i18n from useTranslation to correctly access the language property.
    const { t, i18n } = useTranslation();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [generatedQuiz, setGeneratedQuiz] = useState<Omit<Quiz, 'id'|'level'|'class'|'subject'|'date'|'stage'> | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file && file.type.startsWith('image/')) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setImagePreview(reader.result as string);
            reader.readAsDataURL(file);
            setGeneratedQuiz(null);
            setError('');
        } else {
            setImageFile(null);
            setImagePreview(null);
        }
    };
    
    const handleGenerateQuiz = async () => {
        const apiKey = (import.meta as any).env.VITE_API_KEY;
        if (!imageFile || !apiKey) {
            setError('Please upload an image first. API key must be set.');
            return;
        }
        setIsLoading(true);
        setError('');
        setGeneratedQuiz(null);

        try {
            const ai = new GoogleGenAI({apiKey: apiKey});
            const imagePartData = await fileToGenerativePart(imageFile);
            
            const schema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: 'A short, relevant title for the quiz based on the image content.'},
                    questions: {
                        type: Type.ARRAY,
                        description: 'An array of 3 to 5 multiple-choice questions.',
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                question: { type: Type.STRING, description: 'The question text.' },
                                options: { type: Type.ARRAY, description: 'An array of 3 or 4 possible answers.', items: { type: Type.STRING } },
                                correctAnswerIndex: { type: Type.INTEGER, description: 'The 0-based index of the correct answer in the options array.' }
                            },
                            required: ['question', 'options', 'correctAnswerIndex']
                        }
                    }
                },
                required: ['title', 'questions']
            };

            const prompt = `Based on the content of this image, generate a multiple-choice quiz. The language of the quiz must be ${i18n.language}.`;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: { parts: [{ text: prompt }, { inlineData: imagePartData }] },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: schema,
                }
            });
            
            const quizData = JSON.parse(response.text);
            setGeneratedQuiz(quizData);

        } catch (e) {
            console.error(e);
            setError('Failed to generate quiz. The content may not be suitable or an API error occurred.');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleSaveQuiz = () => {
        if (generatedQuiz) {
            onSave(generatedQuiz);
            setGeneratedQuiz(null);
            setImageFile(null);
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
    
    const handleDeleteClick = (quiz: Quiz) => {
        onDelete(quiz);
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
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 text-center">{t('quizzes')}</h1>

            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-3 border-b-2 dark:border-gray-600 pb-2">{t('quizzes')}</h2>
                <div className="max-h-48 overflow-y-auto space-y-2 p-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
                    {quizzes.length > 0 ? (
                        quizzes.sort((a,b) => b.id - a.id).map(quiz => (
                            <div key={quiz.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                                <span className="text-gray-800 dark:text-gray-200 font-medium">{quiz.title}</span>
                                <button onClick={() => handleDeleteClick(quiz)} className="text-red-500 hover:text-red-700 font-bold px-3 py-1 rounded-md hover:bg-red-100 dark:hover:bg-red-900/20 transition">
                                    {t('delete')}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">{t('noQuizzes')}</p>
                    )}
                </div>
            </div>

            <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg shadow-inner space-y-4 border-t-2 border-dashed dark:border-gray-600 pt-6">
                <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 text-center">{t('addQuiz')}</h2>
                <p className="text-sm text-center text-gray-600 dark:text-gray-300">{t('uploadImageForQuiz')}</p>
                
                {imagePreview && (
                    <div className="p-2 border-2 border-dashed dark:border-gray-600 rounded-lg"><img src={imagePreview} alt="Preview" className="max-h-48 mx-auto rounded"/></div>
                )}

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="w-full bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg hover:bg-gray-300 transition dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">
                    📎 {t('uploadPhoto')}
                </button>

                <button onClick={handleGenerateQuiz} disabled={!imageFile || isLoading} className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2 disabled:bg-gray-400">
                    {isLoading ? '...' : '✨'} {isLoading ? t('generatingQuiz') : t('generateQuizFromImage')}
                </button>
                {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            </div>

            {generatedQuiz && (
                <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-inner space-y-4 animate-fade-in">
                    <h3 className="text-xl font-bold text-blue-800 dark:text-blue-200 text-center">{generatedQuiz.title}</h3>
                    <div className="space-y-4 max-h-60 overflow-y-auto p-2">
                        {generatedQuiz.questions.map((q, qIndex) => (
                            <div key={qIndex} className="bg-white dark:bg-gray-800 p-3 rounded">
                                <p className="font-semibold dark:text-gray-200">{qIndex + 1}. {q.question}</p>
                                <ul className="mt-2 space-y-1">
                                    {q.options.map((opt, oIndex) => (
                                        <li key={oIndex} className={`p-1 rounded ${oIndex === q.correctAnswerIndex ? 'bg-green-200 dark:bg-green-800 font-bold' : 'dark:bg-gray-700'}`}>
                                            {opt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                    <button onClick={handleSaveQuiz} className="w-full bg-teal-500 text-white font-bold py-3 rounded-lg hover:bg-teal-600 transition shadow-lg">{t('saveQuiz')}</button>
                </div>
            )}

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default TeacherAddQuiz;