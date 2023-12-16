import { AppState } from "./index";
import { MeasurementDataPoint } from "../components/App/measurements/types";
import { DoneWorkouts } from "./reducers/workout/types";

const constructedDoneWorkouts: DoneWorkouts = [];
for (let i = 1; i <= 15; i++) {
    const currentDate = new Date("2023-09-01");
    currentDate.setDate(currentDate.getDate() + i * Math.random() * 10 - 5);
    constructedDoneWorkouts.push({
        timestamp: currentDate.getTime(),
        duration: (i * 100).toString(),
        doneExercises: [
            {
                name: "Bankdrücken",
                sets: [
                    { weight: (i * Math.random() * 50).toString(), reps: "5" },
                    { weight: (i * Math.random() * 50).toString(), reps: "5" },
                    { weight: (i * Math.random() * 50).toString(), reps: "5" },
                    { weight: (i * Math.random() * 50).toString(), reps: "5" },
                    { weight: (i * Math.random() * 50).toString(), reps: "5" },
                ],
            },
            {
                name: "Butterfly",
                sets: [
                    { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
                    { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
                    { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
                    { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
                    { weight: (Math.random() * 5 + i).toString(), reps: (Math.random() * 5 + i).toString() },
                ],
            },
        ],
    });
}
const getConstructedMeasurement = (): MeasurementDataPoint[] => {
    const datapoints: MeasurementDataPoint[] = [];
    for (let i = 1; i <= 15; i++) {
        const currentDate = new Date("2023-12-01");
        currentDate.setDate(currentDate.getDate() + i * Math.random() * 10 - 5);
        datapoints.push({ timestamp: currentDate.getTime(), value: (i * Math.random() * 10).toString() });
    }
    return datapoints;
};

export const mockState: AppState = {
    metadataState: {
        appInstallDate: "2023-09-01",
        isFirstTimeRendered: false,
    },
    measurmentState: {
        sorting: "A_Z",
        measurements: [
            {
                name: "Körpergewicht",
                type: "weight",
                data: [
                    { timestamp: 1702271012832, value: "70" },
                    { timestamp: 1702271012832, value: "70" },
                    { timestamp: 1702271012832, value: "70" },
                    { timestamp: 1702271012832, value: "72" },
                    { timestamp: 1702271012832, value: "73" },
                    { timestamp: 1702271012832, value: "75" },
                    { timestamp: 1702271012832, value: "74" },
                ],
                higherIsBetter: true,
            },
            {
                name: "Körperfettanteil",
                type: "percent",
                data: [
                    { timestamp: 1702271012832, value: "15" },
                    { timestamp: 1702271012832, value: "16" },
                    { timestamp: 1702271012832, value: "17" },
                    { timestamp: 1702271012832, value: "18" },
                    { timestamp: 1702271012832, value: "20" },
                    { timestamp: 1702271012832, value: "19" },
                    { timestamp: 1702271012832, value: "23" },
                ],
            },
        ],
    },
    settingsState: {
        theme: "dark",
        language: "en",
        unitSystem: "metric",
    },
    workoutState: {
        sorting: "A_Z",
        workouts: [
            {
                name: "Real Back",
                calendarColor: "#ffff00",
                exercises: [
                    { type: "WEIGHT_BASED", name: "Klimmzüge unterstützt", weight: "25", sets: "5", pause: { seconds: "0", minutes: "3" }, reps: "5" },
                    { type: "WEIGHT_BASED", name: "Rudern Seilzug", weight: "50", sets: "4", pause: { seconds: "0", minutes: "2" }, reps: "8" },
                    { type: "WEIGHT_BASED", name: "Hintere Schulter Seil", weight: "50", sets: "4", pause: { seconds: "0", minutes: "2" }, reps: "8" },
                    { type: "WEIGHT_BASED", name: "Bizeps Sz", weight: "10", sets: "4", pause: { seconds: "0", minutes: "2" }, reps: "8" },
                ],
                doneWorkouts: [
                    {
                        timestamp: 1701385200000,
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        timestamp: 1701385200000 + 60 * 60 * 1000 * 24,
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        timestamp: 1701385200000 + 60 * 60 * 1000 * 24 * 2,
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        timestamp: 1701385200000 + 60 * 60 * 1000 * 24 * 2,
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        timestamp: 1701385200000 + 60 * 60 * 1000 * 24 * 2,
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Real Chest",
                calendarColor: "#ff0000",
                exercises: [{ type: "WEIGHT_BASED", name: "Bankdrücken", weight: "50", sets: "5", pause: { seconds: "3", minutes: "0" }, reps: "5" }],
                doneWorkouts: [
                    {
                        timestamp: 1701385200000,
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Bankdrücken",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                ],
            },
        ],
    },
    errorState: {
        errors: [],
    },
};
export const emptyState = {
    measurmentState: {
        sorting: "A_Z",
        measurements: [],
    },
    workoutState: {
        sorting: "LONGEST_AGO",
        workouts: [],
    },
    metadataState: {
        appInstallDate: "2023-11-11",
        isFirstTimeRendered: false,
    },
    errorState: {
        errors: [],
    },
    settingsState: {
        language: "en",
        theme: "light",
        unitSystem: "metric",
    },
} satisfies AppState;
