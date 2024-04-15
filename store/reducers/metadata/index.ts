import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { IsoDate } from "../../../types/date";

export type DevelopmentState = "mock" | "empty";
export type MetadataState = {
    appInstallDate?: IsoDate;
    isFirstTimeRendered?: boolean;
    developmentState?: DevelopmentState;
};

export const setGenerallAppState = createAction<MetadataState, "metadata_set_metadatastate">(
    "metadata_set_metadatastate",
);
export const setMockState = createAction("metadata_set_mock_state");
export const setFirstTimeRendered = createAction<boolean, "metadata_set_first_time_rendered">(
    "metadata_set_first_time_rendered",
);
export const setEmptyState = createAction("metadata_empty_state");
export const setAppInstallDate = createAction<IsoDate, "set_app_install_date">(
    "set_app_install_date",
);
export const setDevelopmentState = createAction<DevelopmentState, "set_development_state">(
    "set_development_state",
);

export type MetadataAction =
    | typeof setGenerallAppState.type
    | typeof setMockState.type
    | typeof setFirstTimeRendered.type
    | typeof setEmptyState.type
    | typeof setAppInstallDate.type;

export const metadataReducer = createReducer<MetadataState>(
    { isFirstTimeRendered: false },
    (builder) =>
        builder
            .addCase(setGenerallAppState, (_, action) => {
                return action.payload;
            })
            .addCase(setDevelopmentState, (state, action) => {
                state.developmentState = action.payload;
            })
            .addCase(setAppInstallDate, (state, action) => {
                state.appInstallDate = action.payload;
            })
            .addCase(setFirstTimeRendered, (state, action) => {
                state.isFirstTimeRendered = action.payload;
            }),
);
