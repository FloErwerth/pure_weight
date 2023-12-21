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
    ["settings/display/index"]: {
        name: "settings/display/index";
    };
    ["settings/workout/index"]: {
        name: "settings/workout/index";
    };
    ["settings/help/index"]: {
        name: "settings/help/index";
    };
    ["settings/statistics/entries/index"]: {
        name: "settings/statistics/entries/index";
    };
    ["measurement/progress/index"]: {
        name: "measurement/progress/index";
    };
    ["workouts/workoutHistory/index"]: {
        name: "workouts/workoutHistory/index";
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
    measurements: {
        screen: "tabs/measurements",
    },
    display: {
        screen: "settings/display/index",
    },
    "settings/help": {
        screen: "settings/help/index",
    },
    entries: {
        screen: "settings/statistics/entries/index",
    },
    "measurement/progress": {
        screen: "measurement/progress/index",
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
