import { ErrorTextConfig } from "../../store/reducers/errors/types";

export interface EditableExerciseInputRowProps {
    value?: string;
    setValue: (value: string) => void;
    errorTextConfig?: ErrorTextConfig;
    i18key?: string;
    background?: boolean;
    stretch?: boolean;
    suffix?: string;
    placeholder?: string;
    helpTextConfig?: { text: string; title: string };
    maxLength?: number;
    bottomSheet?: boolean;
}

export interface TimeInputRowProps {
    stretch?: boolean;
    hideSuffix?: boolean;
    seconds?: string;
    minutes?: string;
    setMinutes: (minutes: string) => void;
    setSeconds: (seconds: string) => void;
    i18key?: string;
    helpTextConfig?: { text: string; title: string };
    errorTextConfig?: ErrorTextConfig;
    ghost?: boolean;
    input?: boolean;
    background?: boolean;
}
