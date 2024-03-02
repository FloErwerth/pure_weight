import { AppState } from "./index";

export const mockState: AppState = {
    metadataState: {
        appInstallDate: "2023-09-01",
        isFirstTimeRendered: false,
    },
    settingsState: {
        stopwatchSettings: { startOnDoneSet: false },
        keepAwake: true,
        theme: "dark",
        language: "de",
        unitSystem: "metric",
        switchToNextExercise: false,
        searchManual: "",
        updatePrefilledWorkoutValues: true,
    },
    measurementState: {
        sorting: "A_Z",
        measurements: [
            {
                measurementId: "measurement-1",
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
                measurementId: "measurement-2",
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
    workoutState: {
        templateSorting: "A_Z",
        workoutSorting: "A_Z",
        workouts: [
            {
                workoutId: "workout-128901238901",
                name: "Rücken 1",
                exercises: [
                    {
                        exerciseId: "exercise-1",
                        type: "WEIGHT_BASED",
                        name: "Klimmzüge unterstützt",
                        weight: "25",
                        sets: "5",
                        pauseMinutes: "3",
                        reps: "5",
                    },
                    {
                        exerciseId: "exercise-2",
                        type: "WEIGHT_BASED",
                        name: "Rudern Seilzug",
                        weight: "50",
                        sets: "4",
                        pauseMinutes: "2",
                        reps: "8",
                    },
                    {
                        exerciseId: "exercise-3",
                        type: "WEIGHT_BASED",
                        name: "Hintere Schulter Seil",
                        weight: "50",
                        sets: "4",
                        pauseMinutes: "2",
                        reps: "8",
                    },
                    {
                        exerciseId: "exercise-4",
                        type: "WEIGHT_BASED",
                        name: "Bizeps Sz",
                        weight: "10",
                        sets: "4",
                        pauseMinutes: "2",
                        reps: "8",
                    },
                ],
                doneWorkouts: [
                    {
                        originalWorkoutId: "workout-128901238901",
                        doneWorkoutId: "workout-1",
                        isoDate: "2023-11-12",
                        duration: "180000",
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
                        originalWorkoutId: "workout-128901238901",
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
                        originalWorkoutId: "workout-128901238901",
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
                        originalWorkoutId: "workout-128901238901",
                        doneWorkoutId: "workout-4",
                        isoDate: "2023-12-02",
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
                        originalWorkoutId: "workout-128901238901",
                        doneWorkoutId: "workout-5",
                        isoDate: "2023-12-03",
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
                        originalWorkoutId: "workout-128901238901",
                        doneWorkoutId: "workout-6",
                        isoDate: "2023-12-04",
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
                        originalWorkoutId: "workout-128901238901",
                        doneWorkoutId: "workout-7",
                        isoDate: "2023-12-05",
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
                        originalWorkoutId: "workout-128901238901",
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
                        originalWorkoutId: "workout-128901238901",
                        doneWorkoutId: "workout-9",
                        isoDate: "2023-12-31",
                        duration: "1180000",
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
                                    { weight: "505", reps: "5" },
                                    { weight: "505", reps: "5" },
                                    { weight: "555", reps: "5" },
                                ],
                            },
                        ],
                    },
                ],
            },
            {
                name: "Weight and Time Based",
                workoutId: "workout-128901238902",
                exercises: [
                    {
                        name: "Klimmzüge unterstützt",
                        exerciseId: "exercise-1",
                        type: "WEIGHT_BASED",
                        weight: "50",
                        sets: "5",
                        pauseMinutes: "3",
                        pauseSeconds: "0",
                        reps: "5",
                    },
                    {
                        exerciseId: "exercise-2",
                        type: "TIME_BASED",
                        weight: "0",
                        reps: "0",
                        name: "Planks",
                        sets: "5",
                        durationMinutes: "0",
                        durationSeconds: "45",
                        pauseMinutes: "0",
                        pauseSeconds: "15",
                    },
                ],
                doneWorkouts: [
                    {
                        originalWorkoutId: "workout-128901238902",
                        doneWorkoutId: "workout-1",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-2",
                                doneExerciseId: "exercise-1",
                                type: "TIME_BASED",
                                name: "Planks",
                                sets: [
                                    { durationMinutes: "0", durationSeconds: "56" },
                                    { durationMinutes: "0", durationSeconds: "56" },
                                    { durationMinutes: "0", durationSeconds: "56" },
                                ],
                            },
                        ],
                    },
                    {
                        originalWorkoutId: "workout-128901238902",

                        doneWorkoutId: "workout-2",
                        isoDate: "2023-12-01",
                        duration: "120",
                        doneExercises: [
                            {
                                originalExerciseId: "exercise-2",
                                type: "TIME_BASED",
                                doneExerciseId: "exercise-1",
                                name: "Planks",
                                sets: [
                                    { durationMinutes: "0", durationSeconds: "56" },
                                    { durationMinutes: "0", durationSeconds: "56" },
                                    { durationMinutes: "0", durationSeconds: "56" },
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
    measurementState: {
        sorting: "A_Z",
        measurements: [],
    },
    metadataState: {
        appInstallDate: "2023-11-11",
        isFirstTimeRendered: true,
    },
    errorState: {
        errors: [],
    },
    settingsState: {
        stopwatchSettings: { startOnDoneSet: true },
        keepAwake: true,
        language: "de",
        theme: "system",
        unitSystem: "metric",
        switchToNextExercise: false,
        searchManual: "",
        updatePrefilledWorkoutValues: true,
    },
} satisfies AppState;
