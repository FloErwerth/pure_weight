import { workoutReducer } from "./workout";
import { settingsRecuder } from "./settings";
import { metadataReducer } from "./metadata";
import { combineReducers } from "@reduxjs/toolkit";
import { errorsReducer } from "./errors";
import { measurementReducer } from "./measurements";
import { purchaseReducer } from "./purchase";

export const reducers = combineReducers({
    measurementState: measurementReducer,
    metadataState: metadataReducer,
    workoutState: workoutReducer,
    settingsState: settingsRecuder,
    errorState: errorsReducer,
    purchaseState: purchaseReducer,
});
