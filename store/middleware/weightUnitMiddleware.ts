import { Middleware } from "redux";
import { AppState } from "../index";
import { setWorkouts } from "../reducers/workout";
import { UnitSystem, WeightUnit } from "../reducers/settings/types";

const calculateWeight = (weight: string, unit: WeightUnit) => {
    if (unit === "kg") {
        return (parseFloat(weight) * 2.205).toString();
    }
    if (unit === "lbs") {
        return (parseFloat(weight) / 2.205).toString();
    }
    return weight;
};
const getNextUnit = (currentSystem: UnitSystem): WeightUnit => {
    if (currentSystem === "metric") {
        return "lbs";
    }
    return "kg";
};
export const weightMiddleware: Middleware<Record<string, unknown>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const state = storeApi.getState();
    if (action.type === "set_unit_system") {
        const unit = getNextUnit(state.settingsState.unitSystem);
        dispatch(
            setWorkouts(
                state.workoutState.workouts.map((workout) => ({
                    ...workout,
                    doneWorkouts: workout.doneWorkouts.map((doneWorkout) => ({
                        ...doneWorkout,
                        doneExercises: doneWorkout.doneExercises?.map((doneExercise) => ({
                            ...doneExercise,
                            sets: doneExercise.sets.map((set) => ({ ...set, weight: calculateWeight(set.weight, unit) })),
                        })),
                    })),
                    exercises: workout.exercises.map((exercise) => ({ ...exercise, weight: calculateWeight(exercise.weight, unit) })),
                })),
            ),
        );
    }
    next(action);
};
