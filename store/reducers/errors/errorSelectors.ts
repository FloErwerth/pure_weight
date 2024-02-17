import { AppState } from "../../index";
import { createSelector } from "@reduxjs/toolkit";
import { ErrorFields } from "./types";

export const getErrors = (state: AppState) => state.errorState.errors;
export const getErrorByKey = createSelector([getErrors, (_, errorKey?: ErrorFields) => errorKey], (state, errorKey) =>
    Boolean(errorKey && state.includes(errorKey)),
);
