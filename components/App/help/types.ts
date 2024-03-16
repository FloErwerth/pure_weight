export interface HelpQuestionsProps {
    closeAll: () => void;
    open: () => void;
}
export type QuestionAnswerArray = Array<{ title: string; answer: JSX.Element }>;
export enum SECTIONS {
    PRO = "PRO",
    WORKOUTS = "WORKOUTS",
    EXERCISES = "EXERCISES",
    MISCELLANEOUS = "MISCELLANEOUS",
    MEASUREMENTS = "MEASUREMENTS",
    TRAININGS = "TRAININGS",
}
