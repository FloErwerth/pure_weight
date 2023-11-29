import { Temporal } from "@js-temporal/polyfill";
import { Workout, WorkoutSortingType } from "../../types";

export const sortWorkouts = (workouts: Workout[], sorting: WorkoutSortingType) => {
    const sortedWorkouts = [...workouts];
    switch (sorting) {
        case "A_Z":
            return sortedWorkouts.sort((a, b) => a.name.localeCompare(b.name));
        case "Z_A":
            return sortedWorkouts.sort((a, b) => b.name.localeCompare(a.name));
        case "MOST_RECENT":
            return sortedWorkouts.sort((a, b) => {
                if (a.doneWorkouts.length > 0 && b.doneWorkouts.length > 0) {
                    const latestDateA = a.doneWorkouts[a.doneWorkouts.length - 1].date;
                    const latestDateB = b.doneWorkouts[b.doneWorkouts.length - 1].date;
                    const latestA = Temporal.Instant.from(`${latestDateA}T00:00+00:00`).epochMilliseconds;
                    const latestB = Temporal.Instant.from(`${latestDateB}T00:00+00:00`).epochMilliseconds;
                    return latestA - latestB;
                }
                return -1;
            });
        case "LONGEST_AGO":
            return sortedWorkouts.sort((a, b) => {
                if (a.doneWorkouts.length > 0 && b.doneWorkouts.length > 0) {
                    const latestDateA = a.doneWorkouts[a.doneWorkouts.length - 1].date;
                    const latestDateB = b.doneWorkouts[b.doneWorkouts.length - 1].date;
                    const latestA = Temporal.Instant.from(latestDateA.concat("T00:00+00:00")).epochMilliseconds;
                    const latestB = Temporal.Instant.from(latestDateB.concat("T00:00+00:00")).epochMilliseconds;
                    return latestB - latestA;
                }
                return -1;
            });
    }

    return sortedWorkouts;
};
