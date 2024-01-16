import { createNavigationContainerRef, ParamListBase } from "@react-navigation/native";

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
    ["tabs/workouts"]: {
        name: "tabs/workouts";
    };
    ["tabs/measurements"]: {
        name: "tabs/measurements";
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
    ["measurement/history/index"]: {
        name: "measurement/history/index";
        measurementIndex: number;
    };
    ["workouts/workoutHistory/index"]: {
        name: "workouts/workoutHistory/index";
    };
    "workouts/history/edit/index": {
        screen: "workouts/history/edit/index";
        doneExerciseIndex: number;
        doneWorkoutId: number;
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
    history: {
        screen: "workouts/workoutHistory/index",
    },
    "workouts/history/edit/index": {
        screen: "workouts/history/edit/index",
    },
    measurements: {
        screen: "tabs/measurements",
    },
    "settings/manual": {
        screen: "settings/manual/index",
    },
    entries: {
        screen: "settings/statistics/entries/index",
    },
    "measurement/progress": {
        screen: "measurement/progress/index",
    },
    "measurement/create": {
        screen: "measurement/create/index",
    },
    "measurement/history": {
        screen: "measurement/history/index",
    },
};

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
