import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";
import { WorkoutId } from "../store/reducers/workout/types";

export type RoutesParamaters = {
    ["workouts/train/index"]: {
        name: "workouts/train/index";
    };
    ["workouts/create/index"]: {
        name: "workouts/create/index";
    };
    ["workouts/progress/index"]: {
        name: "workouts/progress/index";
    };
    ["progress/chart/index"]: {
        name: "progress/chart/index";
    };
    ["tabs/settings"]: {
        name: "tabs/settings";
        scrollIndex?: number;
    };
    ["workouts/create/exercise/index"]: {
        name: "workouts/create/exercise/index";
        to?: keyof typeof Routes;
    };
    ["tabs/workouts"]: {
        name: "tabs/workouts";
    };
    ["settings/workout/index"]: {
        name: "settings/workout/index";
    };
    ["settings/manual/index"]: {
        name: "settings/manual/index";
    };
    ["settings/statistics/entries/index"]: {
        name: "settings/statistics/entries/index";
    };
    ["measurement/progress/index"]: {
        name: "measurement/progress/index";
    };
    ["measurement/create/index"]: {
        name: "measurement/create/index";
    };
    ["workouts/workoutHistory/index"]: {
        name: "workouts/workoutHistory/index";
    };
    "workouts/history/edit/index": {
        screen: "workouts/history/edit/index";
        doneWorkoutId: WorkoutId;
    };
    ["tabs"]: {
        name: "tabs";
    };
};

export const Routes = {
    workouts: {
        screen: "tabs/workouts",
    },
    train: {
        screen: "workouts/train/index",
    },
    create: {
        screen: "workouts/create/index",
    },
    "workout/progress": {
        screen: "workouts/progress/index",
    },
    chart: {
        screen: "progress/chart/index",
    },
    settings: {
        screen: "tabs/settings",
    },
    "workouts/create/exercise": {
        screen: "workouts/create/exercise/index",
    },
    history: {
        screen: "workouts/workoutHistory/index",
    },
    "workouts/history/edit/index": {
        screen: "workouts/history/edit/index",
    },
    "settings/manual": {
        screen: "settings/manual/index",
    },
    entries: {
        screen: "settings/statistics/entries/index",
    },
} as const;

export const navigationRef = createNavigationContainerRef<typeof Routes>();
export function useNavigate() {
    function navigate<T extends keyof typeof Routes>(name: T, params?: ParamListBase[T]) {
        if (navigationRef.isReady()) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigationRef.navigate(Routes[name]["screen"], { ...params });
        }
    }

    return navigate;
}

export function useNavigateBack() {
    function navigateBack() {
        if (navigationRef.isReady()) {
            navigationRef.goBack();
        }
    }

    return navigateBack;
}
