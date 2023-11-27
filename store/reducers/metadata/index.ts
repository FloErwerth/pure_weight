import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { ThemeKey } from "../../../theme/types";
import { IsoDate } from "../../../types/date";
import { emptyState, mockState } from "../../mock";

export type MetadataState = { theme: ThemeKey; appInstallDate?: IsoDate; isFirstTimeRendered?: boolean };

export const setMockState = createAction("set_mock_state");
export const setFirstTimeRendered = createAction<boolean>("set_greeting");
export const setEmptyState = createAction("set_empty_state");

export const setAppInstallDate = createAction<IsoDate>("set_app_install_date");
export const metadataReducer = createReducer<MetadataState>(emptyState, (builder) =>
    builder
        .addCase(setEmptyState, () => {
            return emptyState;
        })
        .addCase(setAppInstallDate, (state, action) => {
            state.appInstallDate = action.payload;
        })

        .addCase(setMockState, () => mockState)
        .addCase(setFirstTimeRendered, (state, action) => {
            state.isFirstTimeRendered = action.payload;
        }),
);
