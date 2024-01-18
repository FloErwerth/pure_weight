import { AppState } from "./index";

export const mockState: AppState = {
    metadataState: {
        appInstallDate: "2023-09-01",
        isFirstTimeRendered: false,
    },
    measurmentState: {
        sorting: "A_Z",
        measurements: [
            {
                measurementId: 1,
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
                measurementId: 2,
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
                workoutId: 128901238901,
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
                        doneWorkoutId: 1,
                        isoDate: "2023-11-12",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 1,
                                name: "Klimmzüge unterstützt",
                                sets: [
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                ],
                                note: "Das war ein guter Satz",
                            },
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 2,
                                name: "Rudern",
                                sets: [
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                ],
                                note: "Das war ein guter Satz",
                            },
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 3,
                                name: "Bizeps",
                                sets: [
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                ],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 2,
                        isoDate: "2023-11-12",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 2,
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 3,
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 3,
                                name: "Seilzüge",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 4,
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 4,
                                name: "Klimmzüge",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 5,
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 5,
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 6,
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 6,
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 7,
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 7,
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 8,
                        isoDate: "2023-12-07",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 8,
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: 9,
                        isoDate: "2023-12-31",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 9,
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Weight and Time Based",
                workoutId: 231390123891,
                calendarColor: "#ff0000",
                exercises: [
                    { type: "WEIGHT_BASED", name: "Bankdrücken", weight: "50", sets: "5", pause: { seconds: "3", minutes: "0" }, reps: "5" },
                    {
                        type: "TIME_BASED",
                        weight: "0",
                        reps: "0",
                        name: "Planks",
                        sets: "5",
                        duration: { seconds: "45", minutes: "0" },
                        pause: { seconds: "3", minutes: "0" },
                        preparation: { seconds: "15", minutes: "0" },
                    },
                ],
                doneWorkouts: [
                    {
                        doneWorkoutId: 1,
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                type: "WEIGHT_BASED",
                                doneExerciseId: 1,
                                name: "Bankdrücken",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                            {
                                type: "TIME_BASED",
                                doneExerciseId: 2,
                                name: "Planks",
                                sets: [{ duration: { seconds: "30", minutes: "1" } }],
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
