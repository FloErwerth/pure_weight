import { MetadataAction, setDevelopmentState, setGenerallAppState } from "../reducers/metadata";
import { emptyState, mockState } from "../mock";
import { setSettingsState, setTheme } from "../reducers/settings";
import { setWorkoutState } from "../reducers/workout";
import { Action, Middleware } from "redux";
import { AppState } from "../index";
import { setMeasurementState } from "../reducers/measurements";
import { Appearance } from "react-native";
import { setPurchaseState } from "../reducers/purchase";

const actionsToApplySorting: MetadataAction[] = ["metadata_empty_state", "metadata_set_mock_state"];
export const stateMiddleware: Middleware<Record<string, never>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const typedAction = action as Action<MetadataAction>;
    if (actionsToApplySorting.includes(typedAction.type)) {
        const selectedState = typedAction.type === "metadata_set_mock_state" ? mockState : emptyState;
        const theme = selectedState.settingsState.theme === "system" ? (Appearance.getColorScheme() === "dark" ? "dark" : "light") : selectedState.settingsState.theme;
        dispatch(setSettingsState(selectedState.settingsState));
        dispatch(setPurchaseState(selectedState.purchaseState));
        dispatch(setWorkoutState(selectedState.workoutState));
        dispatch(setMeasurementState(selectedState.measurementState));
        dispatch(setGenerallAppState(selectedState.metadataState));
        dispatch(setTheme(theme));
        dispatch(setDevelopmentState(typedAction.type === "metadata_set_mock_state" ? "mock" : "empty"));
    }
    next(action);
};
