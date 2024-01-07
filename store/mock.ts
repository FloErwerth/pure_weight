import { AppState } from "./index";
import { MeasurementDataPoint } from "../components/App/measurements/types";
import { DoneWorkouts } from "./reducers/workout/types";
import { convertDate } from "../utils/date";

const constructedDoneWorkouts: DoneWorkouts = [];
for (let i = 1; i <= 15; i++) {
    const currentDate = new Date("2023-09-01");
    currentDate.setDate(currentDate.getDate() + i * Math.random() * 10 - 5);
    constructedDoneWorkouts.push({
        isoDate: convertDate.toIsoDate(currentDate),
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
        datapoints.push({ isoDate: convertDate.toIsoDate(currentDate), value: (i * Math.random() * 10).toString() });
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
                    { isoDate: "2023-12-01", value: "70" },
                    { isoDate: "2023-12-02", value: "70" },
                    { isoDate: "2023-12-03", value: "70" },
                    { isoDate: "2023-12-04", value: "72" },
                    { isoDate: "2023-12-05", value: "73" },
                    { isoDate: "2023-12-06", value: "75" },
                    { isoDate: "2023-12-07", value: "74" },
                    { isoDate: "2023-12-08", value: "74" },
                    { isoDate: "2023-12-09", value: "74" },
                    { isoDate: "2023-12-10", value: "74" },
                    { isoDate: "2023-12-11", value: "74" },
                    { isoDate: "2023-12-12", value: "74" },
                    { isoDate: "2023-12-13", value: "74" },
                    { isoDate: "2023-12-14", value: "74" },
                    { isoDate: "2023-12-15", value: "74" },
                ],
                higherIsBetter: true,
            },
            {
                name: "Körperfettanteil",
                type: "percent",
                data: [
                    { isoDate: "2023-12-01", value: "15" },
                    { isoDate: "2023-12-02", value: "15" },
                    { isoDate: "2023-12-03", value: "15" },
                    { isoDate: "2023-12-04", value: "16" },
                    { isoDate: "2023-12-05", value: "14" },
                    { isoDate: "2023-12-06", value: "13" },
                    { isoDate: "2023-12-07", value: "12" },
                ],
            },
        ],
    },
    settingsState: {
        switchToNextExercise: true,
        stopwatchSettings: { startOnDoneSet: false, startOnLastSet: false, notifications: { allowed: false } },
        keepAwake: true,
        theme: "dark",
        language: "en",
        unitSystem: "metric",
        deletionTimeMs: 5000,
    },
    workoutState: {
        sorting: "A_Z",
        workouts: [
            {
                index: 0,
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
                        isoDate: "2023-10-01",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        isoDate: "2023-11-12",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        isoDate: "2023-12-04",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        isoDate: "2023-12-05",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        isoDate: "2023-12-06",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        isoDate: "2023-12-07",
                        duration: "120",
                        doneExercises: [
                            {
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        isoDate: "2023-12-31",
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
                index: 1,
                calendarColor: "#ff0000",
                exercises: [{ type: "WEIGHT_BASED", name: "Bankdrücken", weight: "50", sets: "5", pause: { seconds: "3", minutes: "0" }, reps: "5" }],
                doneWorkouts: [
                    {
                        isoDate: "2023-12-01",
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
        switchToNextExercise: true,
        stopwatchSettings: { startOnDoneSet: true, startOnLastSet: true, notifications: { allowed: false } },
        keepAwake: true,
        language: "en",
        theme: "light",
        unitSystem: "metric",
        deletionTimeMs: 5000,
    },
} satisfies AppState;
