import { createAction, createReducer } from "@reduxjs/toolkit/src";

export type ErrorState = { errors: ErrorFields[] };

export type ErrorFields =
    | "create_name"
    | "create_weight"
    | "create_sets"
    | "create_reps"
    | "workout_name"
    | "create_exercises_empty"
    | "measurement_name"
    | "measurement_unit"
    | "measurement_value"
    | "create_timePerSet";
export const setError = createAction<ErrorFields[]>("error_set");
export const cleanError = createAction<ErrorFields[]>("error_clean");
export const cleanErrors = createAction("error_clean_all");
export const errorsReducer = createReducer<ErrorState>({ errors: [] }, (builder) => {
    builder
        .addCase(setError, (state, action) => {
            const notIncludedErrors = action.payload.filter((errorKey) => !state.errors.includes(errorKey));
            state.errors.push(...notIncludedErrors);
        })
        .addCase(cleanError, (state, action) => {
            state.errors = state.errors.filter((key) => !action.payload.includes(key));
        })
        .addCase(cleanErrors, (state) => {
            state.errors = [];
        });
});
