import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { IsoDate } from "../../../types/date";

export type MetadataState = { appInstallDate?: IsoDate; isFirstTimeRendered?: boolean };

export enum MetaDataActions {
    METADATA_SET_MOCK_STATE = "METADATA_SET_MOCK_STATE",
    METADATA_SET_EMPTY_STATE = "METADATA_SET_EMPTY_STATE",
    METADATA_FIRST_TIME_RENDERED = "METADATA_FIRST_TIME_RENDERED",
}

export const setMetadataState = createAction<MetadataState>("metadata_set_state");
export const setMockState = createAction(MetaDataActions.METADATA_SET_MOCK_STATE);
export const setFirstTimeRendered = createAction<boolean>(MetaDataActions.METADATA_FIRST_TIME_RENDERED);
export const setEmptyState = createAction(MetaDataActions.METADATA_SET_EMPTY_STATE);
export const setAppInstallDate = createAction<IsoDate>("set_app_install_date");

export const metadataReducer = createReducer<MetadataState>({ isFirstTimeRendered: false }, (builder) =>
    builder
        .addCase(setMetadataState, (_, action) => {
            return action.payload;
        })
        .addCase(setAppInstallDate, (state, action) => {
            state.appInstallDate = action.payload;
        })
        .addCase(setFirstTimeRendered, (state, action) => {
            state.isFirstTimeRendered = action.payload;
        }),
);

console.log(metadataReducer["getInitialState"]());
