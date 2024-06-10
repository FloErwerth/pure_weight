import { ErrorFields } from "../reducers/errors/types";
import { ErrorTranslationKeys } from "../../locales/translationKeys";

export const toErrorTranslation = (errorField: ErrorFields | undefined): ErrorTranslationKeys | undefined => {
    switch (errorField) {
        case "create_exercise_duration":
            return ErrorTranslationKeys.ERROR_CREATE_EXERCISE_DURATION;
        case "create_exercise_name":
            return ErrorTranslationKeys.ERROR_CREATE_EXERCISE_NAME;
        case "create_exercise_reps":
            return ErrorTranslationKeys.ERROR_CREATE_EXERCISE_REPS;
        case "create_exercise_sets":
            return ErrorTranslationKeys.ERROR_CREATE_EXERCISE_SETS;
        case "create_exercise_weight":
            return ErrorTranslationKeys.ERROR_CREATE_EXERCISE_WEIGHT;
        case "create_exercises_empty":
            return ErrorTranslationKeys.ERROR_CREATE_EXERCISES_EMPTY;
        case "create_measurement_type":
            return ErrorTranslationKeys.ERROR_CREATE_MEASUREMENT_TYPE;
        case "create_measurement_name":
            return ErrorTranslationKeys.ERROR_CREATE_MEASUREMENT_NAME;
        case "create_measurement_value":
            return ErrorTranslationKeys.ERROR_CREATE_MEASUREMENT_VALUE;
        case "edit_history_exercise_timebased_weight":
            return ErrorTranslationKeys.ERROR_EDIT_HISTORY_EXERCISE_TIMEBASED_WEIGHT;
        case "edit_history_exercise_weightbased_weight":
            return ErrorTranslationKeys.ERROR_EDIT_HISTORY_EXERCISE_WEIGHTBASED_WEIGHT;
        case "edit_history_reps":
        case "edit_history_duration":
        default:
            return;
    }
};
