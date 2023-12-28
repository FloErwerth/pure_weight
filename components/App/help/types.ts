import { SnapPoint } from "../../BottomSheetModal/ThemedBottomSheetModal";

export interface HelpQuestionsProps {
    closeAll: () => void;
    open: () => void;
}
export type QuestionAnswerArray = Array<{ title: string; answer: JSX.Element; snapPoints?: SnapPoint[] }>;
export enum SECTIONS {
    WORKOUTS = "WORKOUTS",
    EXERCISES = "EXERCISES",
    MISCELLANEOUS = "MISCELLANEOUS",
    TRAININGS = "TRAININGS",
    MEASUREMENTS = "MEASUREMENTS",
}
