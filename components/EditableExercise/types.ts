import { ErrorTextConfig } from "../../store/reducers/errors/types";
import { TextStyle, ViewStyle } from "react-native";
import { TranslationKeys } from "../../locales/translationKeys";

export interface EditableExerciseInputRowProps {
    value?: string;
    setValue: (value: string) => void;
    errorTextConfig?: ErrorTextConfig;
    i18key?: TranslationKeys;
    background?: boolean;
    stretch?: boolean;
    suffix?: string;
    placeholder?: string;
    helpTextConfig?: { text: string; title: string };
    maxLength?: number;
    bottomSheet?: boolean;
}

export interface TimeInputRowProps {
    editable?: boolean;
    stretch?: boolean;
    hideSuffix?: boolean;
    seconds?: string;
    minutes?: string;
    setMinutes: (minutes: string) => void;
    setSeconds: (seconds: string) => void;
    i18key?: TranslationKeys;
    helpTextConfig?: { text: string; title: string };
    errorTextConfig?: ErrorTextConfig;
    ghost?: boolean;
    input?: boolean;
    background?: boolean;
    wrapperStyle?: ViewStyle;
    textStyle?: TextStyle;
    placeholderColor?: string;
}
