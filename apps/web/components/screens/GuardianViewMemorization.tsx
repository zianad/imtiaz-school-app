import React from 'react';
import ComingSoon from './ComingSoon';
// FIX: Added missing props to fix type error in App.tsx. The component is still a placeholder.
import { School, MemorizationItem } from '../../../../packages/core/types';


interface GuardianViewMemorizationProps {
    school: School;
    items: MemorizationItem[];
    onBack: () => void;
    onLogout: (isError?: boolean) => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewMemorization: React.FC<GuardianViewMemorizationProps> = ({ onBack }) => {
    return <ComingSoon onBack={onBack} />;
};

export default GuardianViewMemorization;