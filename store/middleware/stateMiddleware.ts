import { Middleware } from "redux";
import { MetaDataActions, setMetadataState } from "../reducers/metadata";
import { AppState } from "../index";
import { emptyState, mockState } from "../mock";
import { setSettingsState } from "../reducers/settings";
import { setWorkoutState } from "../reducers/workout";
import { setMeasurementState } from "../reducers/measurements";

const actionsToApplySorting = [MetaDataActions.METADATA_SET_MOCK_STATE, MetaDataActions.METADATA_SET_EMPTY_STATE];

export const stateMiddleware: Middleware<Record<string, unknown>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    if (actionsToApplySorting.includes(action.type)) {
        const selectedState: AppState = action.type === MetaDataActions.METADATA_SET_MOCK_STATE ? mockState : emptyState;
        dispatch(setSettingsState(selectedState.settingsState));
        dispatch(setWorkoutState(selectedState.workoutState));
        dispatch(setMeasurementState(selectedState.measurmentState));
        dispatch(setMetadataState(selectedState.metadataState));
    }
    next(action);
};
