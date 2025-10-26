
import React from 'react';
import { UserRole } from '../../core/types';
import { HELP_PHONE_NUMBER } from '../../core/constants';
import Logo from '../common/Logo';

interface WelcomeScreenProps {
    onSelectRole: (role: UserRole) => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSelectRole }) => {
    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 border-blue-600">
            <Logo />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">مرحبا بك في تطبيق المدرسة</h1>
            <p className="text-gray-500 mb-10">by appshark.solution</p>

            <div className="space-y-4">
                <button
                    onClick={() => onSelectRole(UserRole.Guardian)}
                    className="w-full bg-blue-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg text-lg transform hover:scale-105"
                >
                    أنا ولي أمر
                </button>
                <button
                    onClick={() => onSelectRole(UserRole.Teacher)}
                    className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-lg hover:bg-indigo-700 transition duration-300 ease-in-out shadow-lg text-lg transform hover:scale-105"
                >
                    أنا أستاذ(ة)
                </button>
                 <button
                    onClick={() => onSelectRole(UserRole.Principal)}
                    className="w-full bg-teal-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-800 transition duration-300 ease-in-out shadow-lg text-md transform hover:scale-105"
                >
                    أنا المدير(ة)
                </button>
            </div>

            <div className="mt-12">
                <a
                    href={`tel:${HELP_PHONE_NUMBER}`}
                    className="text-blue-600 hover:underline font-semibold"
                >
                    طلب مساعدة
                </a>
                <p className="text-xs text-gray-500 mt-2">
                    ملاحظة: عند الضغط على طلب مساعدة ستتحول تلقائيا إلى الإتصال برقم هاتفي.
                </p>
            </div>
        </div>
    );
};

export default WelcomeScreen;