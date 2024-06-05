import { DoneExerciseData, WorkoutId } from "../store/reducers/workout/types";
import { MeasurementId } from "../components/App/measurements/types";

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
    ["tabs/profile"]: {
        name: "tabs/profile";
    };
    ["purchase"]: {
        name: "purchase";
    };
    ["workouts/create/exercise/index"]: {
        name: "workouts/create/exercise/index";
        to?: keyof typeof Routes;
    };
    ["tabs/workouts"]: {
        name: "tabs/workouts";
    };
    ["profile/settings/index"]: {
        name: "profile/settings/index";
        scrollIndex?: number;
    };
    ["profile/settings/manual/index"]: {
        name: "settings/manual/index";
    };
    ["measurement/progress/index"]: {
        name: "measurement/progress/index";
    };
    ["measurement/create/index"]: {
        name: "measurement/create/index";
    };
    ["measurements/history/edit/index"]: {
        name: "measurements/history/edit/index";
    };
    ["workouts/history/index"]: {
        name: "workouts/history/index";
    };
    ["workouts/history/exercise_edit/index"]: {
        name: "workouts/history/exercise_edit/index";
        doneWorkoutId: WorkoutId;
        doneExercise: DoneExerciseData;
    };
    "workouts/history/workout/index": {
        screen: "workouts/history/workout/index";
        doneWorkoutId: WorkoutId;
    };
    ["tabs"]: {
        name: "tabs";
    };
    ["tabs/measurements"]: {
        name: "tabs/measurements";
    };
    ["measurement/history/index"]: {
        name: "measurement/history/index";
        measurementId: MeasurementId;
    };
};

export const Routes = {
    workouts: {
        screen: "tabs/workouts",
    },
    measurements: {
        screen: "tabs/measurements",
    },
    purchase: {
        screen: "purchase",
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
    "measurements/history/edit": {
        screen: "measurements/history/edit/index",
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
    profile: {
        screen: "tabs/profile",
    },
    "workouts/create/exercise": {
        screen: "workouts/create/exercise/index",
    },
    history: {
        screen: "workouts/history/index",
    },
    "workouts/history/exercise_edit/index": {
        screen: "workouts/history/exercise_edit/index",
    },
    "workouts/history/workout/index": {
        screen: "workouts/history/workout/index",
    },
    "profile/settings": {
        screen: "profile/settings/index",
    },
    "profile/settings/manual": {
        screen: "profile/settings/manual/index",
    },
    entries: {
        screen: "settings/statistics/entries/index",
    },
} as const;
