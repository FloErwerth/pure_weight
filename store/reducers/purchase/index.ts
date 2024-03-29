import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { PurchasesPackage } from "react-native-purchases";

type PurchseState = {
    availablePackages: PurchasesPackage[];
    pro: boolean;
    loaded: boolean;
};

export const setPurchaseState = createAction<PurchseState>("purchase_set_state");
export const setPro = createAction<boolean>("purchase_set_pro");
export const setAvailablePackages = createAction<PurchasesPackage[]>("purchase_set_available_packages");
export const setPurchasesLoaded = createAction<boolean>("purchase_set_purchases_loaded");

export const purchaseReducer = createReducer<PurchseState>({ loaded: false, availablePackages: [], pro: false }, (builder) => {
    builder
        .addCase(setPurchaseState, (_, action) => {
            return action.payload;
        })
        .addCase(setPro, (state, action) => {
            state.pro = action.payload;
        })
        .addCase(setAvailablePackages, (state, action) => {
            state.availablePackages = action.payload;
        })
        .addCase(setPurchasesLoaded, (state, action) => {
            state.loaded = action.payload;
        });
});
