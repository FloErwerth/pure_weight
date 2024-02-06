import { Action, Middleware } from "redux";
import { AppActions, AppState } from "../index";
import { setWorkouts } from "../reducers/workout";
import { UnitSystem, WeightUnit } from "../reducers/settings/types";
import { unitMap } from "../../utils/unitMap";
import { convert } from "convert";

const round = (num: number) => {
    return (Math.round(num * 100) / 100).toString();
};

const calculateWeight = (weight: string, nextUnit: WeightUnit) => {
    let convertedWeight = weight;

    if (nextUnit === "kg") {
        convertedWeight = round(convert(parseFloat(weight), "pound").to("kg"));
    }
    if (nextUnit === "lbs") {
        convertedWeight = round(convert(parseFloat(weight), "kg").to("pound"));
    }

    return convertedWeight;
};

const getNextUnit = (nextSystem: UnitSystem) => {
    return unitMap[nextSystem];
};
export const weightMiddleware: Middleware<Record<string, string>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const state = storeApi.getState();
    const typedAction: Action<AppActions> = action as Action<AppActions>;
    if (typedAction.type === "set_unit_system") {
        const nextUnitSystem = state.settingsState.unitSystem === "metric" ? "imperial" : "metric";
        const nextUnit = getNextUnit(nextUnitSystem);
        dispatch(
            setWorkouts(
                state.workoutState.workouts.map((workout) => ({
                    ...workout,
                    doneWorkouts: workout.doneWorkouts.map((doneWorkout) => ({
                        ...doneWorkout,
                        doneExercises: doneWorkout.doneExercises?.map((doneExercise) => ({
                            ...doneExercise,
                            sets: doneExercise.sets.map((set) => ({ ...set, weight: calculateWeight(set.weight ?? "0", nextUnit.weight) })),
                        })),
                    })),
                    exercises: workout.exercises.map((exercise) => ({
                        ...exercise,
                        weight: calculateWeight(exercise.weight, nextUnit.weight),
                    })),
                })),
            ),
        );
    }
    next(action);
};
