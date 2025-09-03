import React from 'react';
import ComingSoon from './ComingSoon';

interface TeacherManageTalkingCardsProps {
    onBack: () => void;
}

const TeacherManageTalkingCards: React.FC<TeacherManageTalkingCardsProps> = ({ onBack }) => {
    return <ComingSoon onBack={onBack} />;
};

export default TeacherManageTalkingCards;
