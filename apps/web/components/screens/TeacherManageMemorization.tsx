import React from 'react';
import ComingSoon from './ComingSoon';

interface TeacherManageMemorizationProps {
    onBack: () => void;
}

const TeacherManageMemorization: React.FC<TeacherManageMemorizationProps> = ({ onBack }) => {
    return <ComingSoon onBack={onBack} />;
};

export default TeacherManageMemorization;
