import { TimeInput } from "../../store/reducers/workout/types";
import { ErrorTextConfig } from "../../store/reducers/errors/types";

export interface EditableExerciseInputRowProps {
    value?: string;
    setValue: (value: string) => void;
    errorTextConfig?: ErrorTextConfig;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
    placeholder?: string;
    helpTextConfig?: { text: string; title: string };
    maxLength?: number;
}

export interface TimeInputRowProps {
    value?: TimeInput;
    setValue: (value: { timeInputKey: keyof TimeInput; value: string }) => void;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
    helpTextConfig?: { text: string; title: string };
    errorTextConfig?: ErrorTextConfig;
}
