type WorkoutErrorFields =
    | "create_workout_name"
    | "create_exercises_empty"
    | "create_exercise_name"
    | "create_exercise_sets"
    | "create_exercise_reps"
    | "create_exercise_weight"
    | "create_exercise_duration"
    | "edit_history_exercise_timebased_weight"
    | "edit_history_exercise_weightbased_weight"
    | "edit_history_duration"
    | "edit_history_reps";

type MeasurementErrorFields = "create_measurement_name" | "create_measurement_value" | "create_measurement_type";

export type ErrorFields = WorkoutErrorFields | MeasurementErrorFields;

export type ErrorTextConfig = {
    errorKey?: ErrorFields;
    errorText?: string;
    hideError?: boolean;
};
