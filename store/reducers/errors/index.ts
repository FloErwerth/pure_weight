import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { ErrorFields } from "./types";

export type ErrorState = { errors: ErrorFields[] };

export const setError = createAction<ErrorFields[], "error_set">("error_set");
export const cleanError = createAction<ErrorFields[], "error_clean">("error_clean");
export const cleanErrors = createAction("error_clean_all");

export type ErrorActions = typeof setError.type | typeof cleanError.type | typeof cleanErrors.type;

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
