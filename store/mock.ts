import { AppState } from "./types";

export const mockState: AppState = {
    appInstallDate: "2023-09-01",
    measurements: [
        {
            name: "Körpergewicht",
            unit: "kg",
            data: {
                ["2023-10-11"]: "15",
                ["2023-10-12"]: "16",
                ["2023-10-13"]: "17",
                ["2023-10-14"]: "18",
                ["2023-10-15"]: "20",
                ["2023-10-16"]: "19",
                ["2023-10-17"]: "23",
            },
            higherIsBetter: true,
        },
        {
            name: "Körperfettanteil",
            unit: "%",
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
    theme: "dark",
    setIndex: 0,
    language: "en",
    workoutIndex: 0,
    sorting: "A_Z",
    isFirstTimeRendered: true,
    exerciseIndex: 0,
    errors: [],
    workouts: [
        {
            name: "Real Back",
            calendarColor: "#ffff00",
            exercises: [
                { type: "WEIGHT_BASED", name: "Klimmzüge unterstützt", weight: "25", sets: "5", pause: "3", reps: "5" },
                { type: "WEIGHT_BASED", name: "Rudern Seilzug", weight: "50", sets: "4", pause: "2", reps: "8" },
                { type: "WEIGHT_BASED", name: "Hintere Schulter Seil", weight: "50", sets: "4", pause: "2", reps: "8" },
                { type: "WEIGHT_BASED", name: "Bizeps Sz", weight: "10", sets: "4", pause: "2", reps: "8" },
            ],
            doneWorkouts: [],
        },
        {
            name: "Real Chest",
            calendarColor: "#ff0000",
            exercises: [{ type: "WEIGHT_BASED", name: "Bankdrücken", weight: "50", sets: "5", pause: "2", reps: "5" }],
            doneWorkouts: [],
        },
    ],
};
export const emptyState: AppState = {
    measurements: [],
    sorting: "LONGEST_AGO",
    exerciseIndex: 0,
    errors: [],
    language: "en",
    workoutIndex: 0,
    workouts: [],
    setIndex: 0,
    isFirstTimeRendered: false,
    theme: "light",
};
