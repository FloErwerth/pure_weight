import { ErrorFields } from "../../store/reducers/errors";
import { TimeInput } from "../../store/types";

export interface EditableExerciseInputRowProps {
    value?: string;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
}

export interface TimeInputRowProps {
    value?: TimeInput;
    setValue: (key: keyof TimeInput, value: string | undefined) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
}
