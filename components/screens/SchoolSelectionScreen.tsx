
import React from 'react';
import { School } from '../../types';
import Logo from '../Logo';

interface SchoolSelectionScreenProps {
    schools: School[];
    onSelectSchool: (schoolId: string) => void;
    onSuperAdminLogin: () => void;
}

const SchoolSelectionScreen: React.FC<SchoolSelectionScreenProps> = ({ schools, onSelectSchool, onSuperAdminLogin }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-gray-800">
            <Logo />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">اختر مؤسستك</h1>
            <h2 className="text-xl text-gray-600 mb-10">للدخول إلى فضاءك الرقمي</h2>

            <div className="space-y-4 mb-8">
                {schools.length > 0 ? (
                    schools.map(school => (
                        <button
                            key={school.id}
                            onClick={() => onSelectSchool(school.id)}
                            className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg transform hover:scale-105"
                        >
                            {school.name}
                        </button>
                    ))
                ) : (
                    <p className="text-gray-500 py-4">لا توجد مدارس مكونة. الرجاء تسجيل الدخول كمدير خارق لإضافة مدرسة.</p>
                )}
            </div>

            <div className="border-t pt-6">
                <button
                    onClick={onSuperAdminLogin}
                    className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 transition duration-300 ease-in-out shadow-md"
                >
                    الدخول كمدير خارق
                </button>
            </div>
        </div>
    );
};

export default SchoolSelectionScreen;
