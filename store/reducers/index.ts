import { workoutReducer } from "./workout";
import { settingsRecuder } from "./settings";
import { metadataReducer } from "./metadata";
import { combineReducers } from "@reduxjs/toolkit";
import { errorsReducer } from "./errors";

export const reducers = combineReducers({
    metadataState: metadataReducer,
    workoutState: workoutReducer,
    settingsState: settingsRecuder,
    errorState: errorsReducer,
});
