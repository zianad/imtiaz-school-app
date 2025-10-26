
import React from 'react';
import { InterviewRequest, Student } from '../../types';
import BackButton from '../BackButton';
import LogoutButton from '../LogoutButton';
import LanguageSwitcher from '../LanguageSwitcher';
import { useTranslation } from '../../i18n';

interface PrincipalInterviewRequestsProps {
    requests: InterviewRequest[];
    students: Student[];
    onComplete: (requestId: number) => void;
    onBack: () => void;
    onLogout: () => void;
}

const PrincipalInterviewRequests: React.FC<PrincipalInterviewRequestsProps> = ({ requests, students, onComplete, onBack, onLogout }) => {
    const { t } = useTranslation();
    
    const getStudentName = (studentId: string) => {
        return students.find(s => s.id === studentId)?.name || 'Unknown Student';
    };
    
    const sortedRequests = [...requests].sort((a,b) => a.date.getTime() - b.date.getTime());

    return (
        <div className="bg-white p-6 rounded-2xl shadow-xl border-t-8 border-purple-600 w-full relative">
            <div className="absolute top-4 start-4 z-10">
                <LanguageSwitcher />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">{t('interviewRequests')}</h1>

            <div className="max-h-[70vh] overflow-y-auto space-y-4 p-2 bg-gray-50 rounded-lg">
                {sortedRequests.length > 0 ? sortedRequests.map(request => (
                    <div key={request.id} className="bg-white p-4 rounded-lg shadow-sm border-l-4 border-purple-500">
                        <p className="font-semibold text-gray-800">
                            {t('requestFrom', { studentName: getStudentName(request.studentId) })}
                        </p>
                        <p className="text-sm text-gray-500 mb-3">
                            {new Date(request.date).toLocaleString('ar-DZ', { dateStyle: 'full', timeStyle: 'short' })}
                        </p>
                        <button 
                            onClick={() => onComplete(request.id)}
                            className="w-full bg-green-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-600 transition"
                        >
                            {t('markAsCompleted')}
                        </button>
                    </div>
                )) : (
                    <p className="text-center text-gray-500 py-10">{t('noInterviewRequests')}</p>
                )}
            </div>

            <div className="mt-8 flex items-center gap-4">
                <BackButton onClick={onBack} />
                <LogoutButton onClick={onLogout} />
            </div>
        </div>
    );
};

export default PrincipalInterviewRequests;
