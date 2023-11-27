import type { DoneWorkouts } from "./types";
import { IsoDate } from "../types/date";

const constructedDoneWorkouts: DoneWorkouts = [];
for (let i = 0; i < 100; i++) {
    const currentDate = new Date("2023-09-01");
    currentDate.setDate(currentDate.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];
    constructedDoneWorkouts.push({
        date: dateStr as IsoDate,
        duration: (i * 100).toString(),
        doneExercises: [
            {
                name: "Bankdrücken",
                sets: [
                    { weight: (i * 5).toString(), reps: "5" },
                    { weight: (i * 5).toString(), reps: "5" },
                    { weight: (i * 5).toString(), reps: "5" },
                    { weight: (i * 5).toString(), reps: "5" },
                    { weight: (i * 5).toString(), reps: "5" },
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
