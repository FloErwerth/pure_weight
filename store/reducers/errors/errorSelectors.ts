import { AppState } from "../../index";
import { createSelector } from "@reduxjs/toolkit";
import { ErrorFields } from "./index";

export const getErrors = (state: AppState) => state.errorState.errors;
export const getErrorByKey = createSelector(
    [getErrors],
    (state) => (errorField?: ErrorFields | undefined) => Boolean(errorField && state.includes(errorField)),
);
