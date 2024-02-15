export interface HelpQuestionsProps {
    closeAll: () => void;
    open: () => void;
}
export type QuestionAnswerArray = Array<{ title: string; answer: JSX.Element }>;
export enum SECTIONS {
    WORKOUTS = "WORKOUTS",
    EXERCISES = "EXERCISES",
    MISCELLANEOUS = "MISCELLANEOUS",
    MEASUREMENTS = "MEASUREMENTS",
    TRAININGS = "TRAININGS",
}
