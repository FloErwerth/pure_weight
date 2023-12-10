import { IsoDate } from "../types/date";
import { DoneWorkouts } from "./types";
import { AppState } from "./index";
import { MeasurementDataPoints } from "../components/App/measurements/types";

const constructedDoneWorkouts: DoneWorkouts = [];
for (let i = 1; i <= 15; i++) {
    const currentDate = new Date("2023-09-01");
    currentDate.setDate(currentDate.getDate() + i * Math.random() * 10 - 5);
    const dateStr = currentDate.toISOString().split("T")[0];
    constructedDoneWorkouts.push({
        date: dateStr as IsoDate,
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
const getConstructedMeasruement = (): MeasurementDataPoints => {
    const constructedMeasurement: Record<string, string> = {};
    for (let i = 1; i <= 15; i++) {
        const currentDate = new Date("2023-09-01");
        currentDate.setDate(currentDate.getDate() + i * Math.random() * 10 - 5);
        const dateStr = currentDate.toISOString().split("T")[0];
        constructedMeasurement[dateStr] = i.toString();
    }
    return constructedMeasurement;
};

export const mockState: AppState = {
    metadataState: {
        appInstallDate: "2023-09-01",
        isFirstTimeRendered: false,
    },
    measurmentState: {
        measurements: [
            {
                name: "Körpergewicht",
                type: "weight",
                data: getConstructedMeasruement(),
                higherIsBetter: true,
            },
            {
                name: "Körperfettanteil",
                type: "percent",
                data: {
                    ["2023-10-11"]: "15",
                    ["2023-10-12"]: "16",
                    ["2023-10-13"]: "17",
                    ["2023-10-14"]: "18",
                    ["2023-10-15"]: "20",
                    ["2023-10-16"]: "19",
                    ["2023-10-17"]: "23",
                },
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
                doneWorkouts: constructedDoneWorkouts,
            },
            {
                name: "Real Chest",
                calendarColor: "#ff0000",
                exercises: [{ type: "WEIGHT_BASED", name: "Bankdrücken", weight: "50", sets: "5", pause: { seconds: "0", minutes: "2" }, reps: "5" }],
                doneWorkouts: [],
            },
        ],
    },
    errorState: {
        errors: [],
    },
};
export const emptyState = {
    measurmentState: {
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
