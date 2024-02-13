import { MetadataAction, setDevelopmentState, setGenerallAppState } from "../reducers/metadata";
import { emptyState, mockState } from "../mock";
import { setSettingsState } from "../reducers/settings";
import { setWorkoutState } from "../reducers/workout";
import { Action, Middleware } from "redux";
import { AppState } from "../index";
import { setMeasurementState } from "../reducers/measurements";

const actionsToApplySorting: MetadataAction[] = ["metadata_empty_state", "metadata_set_mock_state"];
export const stateMiddleware: Middleware<Record<string, never>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const typedAction = action as Action<MetadataAction>;
    if (actionsToApplySorting.includes(typedAction.type)) {
        const selectedState = typedAction.type === "metadata_set_mock_state" ? mockState : emptyState;
        dispatch(setSettingsState(selectedState.settingsState));
        dispatch(setWorkoutState(selectedState.workoutState));
        dispatch(setMeasurementState(selectedState.measurementState));
        dispatch(setGenerallAppState(selectedState.metadataState));
        dispatch(setDevelopmentState(typedAction.type === "metadata_set_mock_state" ? "mock" : "empty"));
    }
    next(action);
};
