import { ErrorFields } from "../../store/reducers/errors";

import { TimeInput } from "../../store/reducers/workout/types";

export interface EditableExerciseInputRowProps {
    value?: string;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
    placeholder?: string;
}

export interface TimeInputRowProps {
    value?: TimeInput;
    setValue: (value: { timeInputKey: keyof TimeInput; value: string }) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
}
