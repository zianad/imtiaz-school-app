
import React from 'react';
import { useTranslation } from '../../../../packages/core/i18n';

const ConfigErrorScreen: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="flex items-center justify-center h-screen p-4 bg-gray-50 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl text-center border-t-8 border-red-600 w-full max-w-2xl mx-auto">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/50 mb-4">
                    <svg className="h-10 w-10 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">خطأ في الإعدادات</h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg mb-6">
                    لم يتمكن التطبيق من الاتصال بالخدمات السحابية. يبدو أن متغيرات البيئة غير معرفة بشكل صحيح في بيئة النشر (Vercel).
                </p>
                <div className="text-right bg-gray-50 dark:bg-gray-700/50 p-6 rounded-lg border border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-3">الخطوات اللازمة للحل:</h2>
                    <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>اذهب إلى لوحة تحكم مشروعك في <strong>Vercel</strong>.</li>
                        <li>انتقل إلى <strong>Settings</strong> ثم <strong>Environment Variables</strong>.</li>
                        <li>تأكد من أن أسماء المتغيرات تبدأ بالبادئة <code>VITE_</code>. يجب أن تكون الأسماء كالتالي:</li>
                    </ol>
                    <ul className="list-disc list-inside mt-4 p-4 bg-gray-100 dark:bg-gray-900/50 rounded-md space-y-2 text-left" dir="ltr">
                        <li className="font-mono text-gray-900 dark:text-gray-100">VITE_API_KEY</li>
                        <li className="font-mono text-gray-900 dark:text-gray-100">VITE_SUPABASE_URL</li>
                        <li className="font-mono text-gray-900 dark:text-gray-100">VITE_SUPABASE_ANON_KEY</li>
                    </ul>
                     <p className="mt-4 text-gray-700 dark:text-gray-300">
                       بعد تعديل الأسماء، قم بإعادة نشر التطبيق من تبويب <strong>Deployments</strong> في Vercel.
                     </p>
                </div>
            </div>
        </div>
    );
};

export default ConfigErrorScreen;
