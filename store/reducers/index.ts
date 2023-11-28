import { measurementReducer } from "./measurements";
import { workoutReducer } from "./workout";
import { settingsRecuder } from "./settings";
import { metadataReducer } from "./metadata";
import { combineReducers } from "@reduxjs/toolkit";
import { errorsReducer } from "./errors";

export const reducers = combineReducers({
    metadataState: metadataReducer,
    measurmentState: measurementReducer,
    workoutState: workoutReducer,
    settingsState: settingsRecuder,
    errorState: errorsReducer,
});
