import { Middleware } from "redux";
import { getSortedWorkouts } from "../reducers/workout/workoutSelectors";

const actionsToApplySorting = ["workout_remove", "workout_add"];

export const workoutSortingMiddleWare: Middleware = (storeApi) => (next) => (action) => {
    const state = storeApi.getState();
    if (actionsToApplySorting.includes(action)) {
        state.workouts = getSortedWorkouts(state);
    }
    next(action);
};
