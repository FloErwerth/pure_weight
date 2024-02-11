import { ErrorFields } from "../../store/reducers/errors";

import { TimeInput } from "../../store/reducers/workout/types";

export type WeightBasedInputRowProps = {
    type: "WEIGHT_BASED";
    value?: string;
    setValue: (value: string) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    suffix?: string;
    placeholder?: string;
};

export type EditableExerciseInputRowProps = WeightBasedInputRowProps | TimeInputRowProps;

export interface TimeInputRowProps {
    type: "TIME_BASED";
    value?: TimeInput;
    setValue: (value: { timeInputKey: keyof TimeInput; value: string }) => void;
    errorKey?: ErrorFields;
    i18key?: string;
    stretch?: boolean;
    hideSuffix?: boolean;
    placeholder?: string;
}
