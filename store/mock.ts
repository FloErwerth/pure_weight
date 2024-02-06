import { AppState } from "./index";

export const mockState: AppState = {
    metadataState: {
        appInstallDate: "2023-09-01",
        isFirstTimeRendered: false,
    },
    settingsState: {
        stopwatchSettings: { startOnDoneSet: false, notifications: { allowed: false } },
        keepAwake: true,
        theme: "system",
        language: "en",
        unitSystem: "metric",
    },
    workoutState: {
        templateSorting: "A_Z",
        workoutSorting: "A_Z",
        workouts: [
            {
                workoutId: "workout-128901238901",
                name: "Rücken 1",
                calendarColor: "#ffff00",
                exercises: [
                    {
                        exerciseId: "exercise-1",
                        type: "WEIGHT_BASED",
                        name: "Klimmzüge unterstützt",
                        weight: "25",
                        sets: "5",
                        pause: { seconds: "0", minutes: "3" },
                        reps: "5",
                    },
                    {
                        exerciseId: "exercise-2",
                        type: "WEIGHT_BASED",
                        name: "Rudern Seilzug",
                        weight: "50",
                        sets: "4",
                        pause: { seconds: "0", minutes: "2" },
                        reps: "8",
                    },
                    {
                        exerciseId: "exercise-3",
                        type: "WEIGHT_BASED",
                        name: "Hintere Schulter Seil",
                        weight: "50",
                        sets: "4",
                        pause: { seconds: "0", minutes: "2" },
                        reps: "8",
                    },
                    {
                        exerciseId: "exercise-4",
                        type: "WEIGHT_BASED",
                        name: "Bizeps Sz",
                        weight: "10",
                        sets: "4",
                        pause: { seconds: "0", minutes: "2" },
                        reps: "8",
                    },
                ],
                doneWorkouts: [
                    {
                        doneWorkoutId: "workout-1",
                        isoDate: "2023-11-12",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
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
                                originalExerciseId: "exercise-2",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-2",
                                name: "Rudern",
                                sets: [
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                ],
                                note: "Das war ein guter Satz",
                            },
                            {
                                originalExerciseId: "exercise-3",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-3",
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
                        doneWorkoutId: "workout-2",
                        isoDate: "2023-11-12",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-3",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Seilzüge",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-4",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Klimmzüge",
                                sets: [{ weight: "50", reps: "5" }],
                                note: "Das war ein guter Satz",
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-5",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-6",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-7",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "50", reps: "5" }],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-8",
                        isoDate: "2023-12-07",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "10", reps: "5" }],
                            },
                            {
                                originalExerciseId: "exercise-2",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-2",
                                name: "Rudern Seilzug",
                                sets: [
                                    { weight: "45", reps: "4" },
                                    { weight: "45", reps: "4" },
                                    { weight: "45", reps: "4" },
                                ],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-9",
                        isoDate: "2023-12-31",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-1",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Klimmzüge unterstützt",
                                sets: [{ weight: "25", reps: "5" }],
                            },
                            {
                                originalExerciseId: "exercise-2",
                                type: "WEIGHT_BASED",
                                doneExerciseId: "exercise-2",
                                name: "Rudern Seilzug",
                                sets: [
                                    { weight: "50", reps: "5" },
                                    { weight: "50", reps: "5" },
                                    { weight: "55", reps: "5" },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Weight and Time Based",
                workoutId: "workout-128901238902",
                calendarColor: "#ff0000",
                exercises: [
                    {
                        name: "Klimmzüge unterstützt",
                        exerciseId: "exercise-1",
                        type: "WEIGHT_BASED",
                        weight: "50",
                        sets: "5",
                        pause: { seconds: "3", minutes: "0" },
                        reps: "5",
                    },
                    {
                        exerciseId: "exercise-2",
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
                        doneWorkoutId: "workout-1",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-6",
                                type: "TIME_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Planks",
                                sets: [
                                    { duration: { seconds: "56", minutes: "0" } },
                                    { duration: { seconds: "56", minutes: "0" } },
                                    { duration: { seconds: "56", minutes: "0" } },
                                ],
                            },
                        ],
                    },
                    {
                        doneWorkoutId: "workout-2",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-6",
                                type: "TIME_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Planks",
                                sets: [
                                    { duration: { seconds: "55", minutes: "0" } },
                                    { duration: { seconds: "56", minutes: "0" } },
                                    { duration: { seconds: "56", minutes: "0" } },
                                ],
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
    workoutState: {
        templateSorting: "MOST_RECENT",
        workoutSorting: "LONGEST_AGO",
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
        stopwatchSettings: { startOnDoneSet: true, notifications: { allowed: false } },
        keepAwake: true,
        language: "en",
        theme: "system",
        unitSystem: "metric",
    },
} satisfies AppState;
