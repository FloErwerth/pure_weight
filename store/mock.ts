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
  settings: { language: "en" },
  workoutIndex: 0,
  workoutSorting: "A_Z",
  isFirstTimeRendered: true,
  exerciseIndex: 0,
  errors: [],
  workouts: [
    {
      name: "Real Back",
      calendarColor: "#ffff00",
      exercises: [
        { name: "Klimmzüge unterstützt", weight: "25", sets: "5", pause: "3", reps: "5" },
        { name: "Rudern Seilzug", weight: "50", sets: "4", pause: "2", reps: "8" },
        { name: "Hintere Schulter Seil", weight: "50", sets: "4", pause: "2", reps: "8" },
        { name: "Bizeps Sz", weight: "10", sets: "4", pause: "2", reps: "8" },
      ],
      doneWorkouts: [],
    },
    {
      name: "Real Chest",
      calendarColor: "#ff0000",
      exercises: [
        { name: "Bankdrücken", weight: "50", sets: "5", pause: "2", reps: "5" },
        { name: "Butterfly", weight: "50", sets: "4", pause: "2", reps: "8" },
        { name: "Military", weight: "10", sets: "5", pause: "2", reps: "5" },
        { name: "Seitheben", weight: "10", sets: "4", pause: "2", reps: "8" },
        { name: "Trizeps", weight: "27.5", sets: "4", pause: "2", reps: "8" },
      ],
      doneWorkouts: [],
    },
    {
      name: "TEST Brust 1",
      calendarColor: "#ff11aa",
      exercises: [
        { name: "Bankdrücken", weight: "50", sets: "5", pause: "2", reps: "5" },
        { name: "Butterfly", weight: "50", sets: "5", pause: "2", reps: "2" },
      ],
      doneWorkouts: [
        { duration: "12000", date: "2023-10-16", doneExercises: [{ name: "Bankdrücken", sets: [{ reps: "5", weight: "55" }] }] },
        { duration: "12000", date: "2023-10-20", doneExercises: [{ name: "Butterfly", sets: [{ reps: "5", weight: "55" }] }] },
      ],
    },
    {
      name: "TEST Brust2",
      calendarColor: "#33f193",
      exercises: [{ name: "Bankdrücken", weight: "50", sets: "5", pause: "2", reps: "5" }],
      doneWorkouts: [
        { duration: "12000", date: "2023-10-16", doneExercises: [{ name: "Bankdrücken", sets: [{ reps: "5", weight: "55" }] }] },
        { duration: "12000", date: "2023-11-18", doneExercises: [{ name: "Bankdrücken", sets: [{ reps: "5", weight: "55" }] }] },
        { duration: "12000", date: "2023-11-20", doneExercises: [{ name: "Bankdrücken", sets: [{ reps: "5", weight: "55" }] }] },
      ],
    },
  ],
  latestDeletions: {},
};
export const emptyState: AppState = {
  measurements: [],
  workoutSorting: "LONGEST_AGO",
  latestDeletions: {},
  exerciseIndex: 0,
  errors: [],
  settings: { language: "en" },
  workoutIndex: 0,
  workouts: [],
  setIndex: 0,
  isFirstTimeRendered: false,
  theme: "light",
};
