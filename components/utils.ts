import { STAGE_DETAILS } from '../constants';
import { EducationalStage } from '../types';

export const getStageForLevel = (level: string): EducationalStage | null => {
    for (const stageKey in STAGE_DETAILS) {
        const stage = STAGE_DETAILS[stageKey as EducationalStage];
        if (stage.levels.includes(level)) {
            return stageKey as EducationalStage;
        }
    }
    return null;
};
