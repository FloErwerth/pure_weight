import { SortingType } from "../../types";
import { Workout } from "./types";

export const sortWorkouts = (workouts: Workout[], sorting: SortingType) => {
    const sortedWorkouts = [...workouts];
    switch (sorting) {
        case "A_Z":
            return sortedWorkouts.sort((a, b) => a.name.localeCompare(b.name));
        case "Z_A":
            return sortedWorkouts.sort((a, b) => b.name.localeCompare(a.name));
        case "MOST_RECENT":
            return sortedWorkouts.sort((a, b) => {
                if (a.doneWorkouts.length > 0 && b.doneWorkouts.length > 0) {
                    const latestA = a.doneWorkouts[a.doneWorkouts.length - 1].timestamp;
                    const latestB = b.doneWorkouts[b.doneWorkouts.length - 1].timestamp;
                    return latestB - latestA;
                }
                return -1;
            });
        case "LONGEST_AGO":
            return sortedWorkouts.sort((a, b) => {
                if (a.doneWorkouts.length > 0 && b.doneWorkouts.length > 0) {
                    const latestDateA = a.doneWorkouts[a.doneWorkouts.length - 1].timestamp;
                    const latestDateB = b.doneWorkouts[b.doneWorkouts.length - 1].timestamp;
                    return latestDateA - latestDateB;
                }
                return -1;
            });
    }

    return sortedWorkouts;
};
