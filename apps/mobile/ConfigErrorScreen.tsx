
import React from 'react';

const MobileConfigErrorScreen: React.FC = () => {
    return (
        <div style={{ padding: '32px', border: '1px solid #fca5a5', backgroundColor: '#fef2f2', borderRadius: '16px', textAlign: 'center', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', maxWidth: '400px', margin: 'auto' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#b91c1c' }}>خطأ في الإعدادات</h1>
            <p style={{ color: '#4b5563', margin: '16px 0' }}>
                لم يتمكن التطبيق من الاتصال. الرجاء التأكد من أن متغيرات البيئة (Environment Variables) في Vercel تبدأ بالبادئة <code>VITE_</code>.
            </p>
            <div style={{ textAlign: 'left', padding: '12px', backgroundColor: '#fee2e2', borderRadius: '8px', direction: 'ltr' }}>
                <p style={{fontWeight: 'bold'}}>الأسماء الصحيحة:</p>
                <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
                    <li>VITE_API_KEY</li>
                    <li>VITE_SUPABASE_URL</li>
                    <li>VITE_SUPABASE_ANON_KEY</li>
                </ul>
            </div>
        </div>
    );
};

export default MobileConfigErrorScreen;
