import { measurementReducer } from "./measurements";
import { workoutReducer } from "./workout";
import { settingsRecuder } from "./settings";
import { metadataReducer } from "./metadata";
import { combineReducers } from "@reduxjs/toolkit";

export const reducers = combineReducers({
    metadata: metadataReducer,
    measurement: measurementReducer,
    workout: workoutReducer,
    settings: settingsRecuder,
} as const);
