import { Middleware } from "redux";
import { getSortedWorkouts } from "../reducers/workout/workoutSelectors";
import { setWorkouts, WorkoutAction } from "../reducers/workout";

const actionsToApplySorting: WorkoutAction[] = ["workout_recover", "workout_remove", "workout_add", "workout_sort"];
export const workoutSortingMiddleWare: Middleware = (storeApi) => (next) => (action) => {
    const state = storeApi.getState();
    if (actionsToApplySorting.includes(action.type)) {
        storeApi.dispatch(setWorkouts(getSortedWorkouts(state)));
    }
    next(action);
};
