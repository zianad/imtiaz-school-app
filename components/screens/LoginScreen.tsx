
import React, { useState } from 'react';
import { UserRole } from '../../core/types';
import BackButton from '../common/BackButton';

interface LoginScreenProps {
    role: UserRole;
    onLogin: (code: string) => void;
    onBack: () => void;
    onLogout: () => void; // still needed for a full exit from this screen
}

const LoginScreen: React.FC<LoginScreenProps> = ({ role, onLogin, onBack }) => {
    const [code, setCode] = useState('');

    const roleDetails = {
        [UserRole.Teacher]: {
            welcome: 'مرحبا بك أستاذ(ة)',
            placeholder: 'أدخل الرمز الخاص بك',
            color: 'indigo',
        },
        [UserRole.Guardian]: {
            welcome: 'مرحبا بك سيدي/سيدتي',
            placeholder: 'أدخل رمز التلميذ(ة)',
            color: 'blue',
        },
        [UserRole.Principal]: {
            welcome: 'مرحبا بك سيدي/سيدتي المدير(ة)',
            placeholder: 'أدخل الرمز الخاص بالإدارة',
            color: 'teal',
        },
        [UserRole.SuperAdmin]: {
            welcome: 'مرحبا بك أيها المدير الخارق',
            placeholder: 'أدخل الرمز الخاص بالتحكم',
            color: 'gray',
        },
    };

    const { welcome, placeholder, color } = roleDetails[role];
    const buttonColorClass = `bg-${color}-600 hover:bg-${color}-700 disabled:bg-${color}-300`;
    const ringColorClass = `focus:ring-${color}-500`;
    const borderColorClass = `border-${color}-500`;

    return (
        <div className={`bg-white p-8 rounded-2xl shadow-xl text-center border-t-8 ${borderColorClass} animate-fade-in`}>
            <h1 className="text-2xl font-bold text-gray-800 mb-8">{welcome}</h1>

            <form onSubmit={(e) => { e.preventDefault(); onLogin(code); }}>
                <input
                    type="password"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={placeholder}
                    className={`w-full p-4 border-2 border-gray-300 rounded-lg text-center text-xl tracking-widest focus:ring-2 ${ringColorClass} focus:border-transparent transition`}
                />

                {role === UserRole.Guardian && (
                    <div className="flex items-center justify-center mt-4">
                        <input id="remember-me" type="checkbox" className={`w-4 h-4 text-${color}-600 bg-gray-100 border-gray-300 rounded focus:ring-${color}-500`} />
                        <label htmlFor="remember-me" className="mr-2 text-sm font-medium text-gray-700">تذكرني</label>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={!code}
                    className={`w-full mt-6 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out shadow-lg text-lg transform hover:scale-105 ${buttonColorClass} disabled:cursor-not-allowed disabled:transform-none`}
                >
                    الدخول
                </button>
            </form>
            
            <div className="mt-8">
                <BackButton onClick={onBack} />
            </div>
        </div>
    );
};

export default LoginScreen;