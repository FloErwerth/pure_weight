import { createNavigationContainerRef } from "@react-navigation/native";

export const Routes = {
    workouts: {
        screen: "tabs",
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
        screen: "tabs",
    },
    history: {
        screen: "workouts/workoutHistory/index",
    },
    measurements: {
        screen: "tabs",
    },
    display: {
        screen: "settings/display/index",
    },
    "workout/settings": {
        screen: "settings/workout/index",
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
    function navigate<T extends keyof typeof Routes>(name: T) {
        if (navigationRef.isReady()) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            navigationRef.navigate(Routes[name]["screen"]);
        }
    }

    return navigate;
}
