import { Middleware } from "redux";
import { MetadataAction, setDevelopmentState, setMetadataState } from "../reducers/metadata";
import { AppState } from "../index";
import { emptyState, mockState } from "../mock";
import { setSettingsState } from "../reducers/settings";
import { setWorkoutState } from "../reducers/workout";
import { setMeasurementState } from "../reducers/measurements";

const actionsToApplySorting: MetadataAction[] = ["metadata_empty_state", "metadata_set_mock_state"];
export const stateMiddleware: Middleware<Record<string, unknown>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    if (actionsToApplySorting.includes(action.type)) {
        const selectedState = action.type === "metadata_set_mock_state" ? mockState : emptyState;
        dispatch(setSettingsState(selectedState.settingsState));
        dispatch(setWorkoutState(selectedState.workoutState));
        dispatch(setMeasurementState(selectedState.measurmentState));
        dispatch(setMetadataState(selectedState.metadataState));
        dispatch(setDevelopmentState(action.type === "metadata_set_mock_state" ? "mock" : "empty"));
    }
    next(action);
};
