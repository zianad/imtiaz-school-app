import React from 'react';
import ComingSoon from './ComingSoon';
// FIX: Added missing props to fix type error in App.tsx. The component is still a placeholder.
import { School, TalkingCard } from '../../../../packages/core/types';

interface GuardianViewTalkingCardsProps {
    school: School;
    cards: TalkingCard[];
    onBack: () => void;
    onLogout: (isError?: boolean) => void;
    toggleDarkMode: () => void;
    isDarkMode: boolean;
}

const GuardianViewTalkingCards: React.FC<GuardianViewTalkingCardsProps> = ({ onBack }) => {
    return <ComingSoon onBack={onBack} />;
};

export default GuardianViewTalkingCards;