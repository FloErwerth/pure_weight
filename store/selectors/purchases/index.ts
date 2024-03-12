import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";

export const getPurchasesState = (state: AppState) => state.purchaseState;
export const getIsPro = createSelector([getPurchasesState], (state) => state.pro);
export const getAvailablePackages = createSelector([getPurchasesState], (state) => state.availablePackages);
