import { Middleware } from "redux";
import { AppState } from "../index";
import { UnitSystem } from "../reducers/settings/types";
import { setWorkouts } from "../reducers/workout";

const calculateWeight = (weight: string, unit: UnitSystem) => {
    if (unit === "kg") {
        return (parseFloat(weight) * 2.205).toFixed(3);
    }
    if (unit === "lbs") {
        return (parseFloat(weight) / 2.205).toFixed(3);
    }
    return weight;
};

export const weightMiddleware: Middleware<Record<string, unknown>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const state = storeApi.getState();
    if (action.type === "weight_unit_set") {
        dispatch(
            setWorkouts(
                state.workoutState.workouts.map((workout) => ({
                    ...workout,
                    doneWorkouts: workout.doneWorkouts.map((doneWorkout) => ({
                        ...doneWorkout,
                        doneExercises: doneWorkout.doneExercises?.map((doneExercise) => ({
                            ...doneExercise,
                            sets: doneExercise.sets.map((set) => ({ ...set, weight: calculateWeight(set.weight, action.payload) })),
                        })),
                    })),
                    exercises: workout.exercises.map((exercise) => ({ ...exercise, weight: calculateWeight(exercise.weight, action.payload) })),
                })),
            ),
        );
    }
    next(action);
};
