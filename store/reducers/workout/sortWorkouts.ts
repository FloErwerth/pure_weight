import { SortingType } from "../../types";
import { getEpochMilliseconds } from "../../../utils/date";
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
                    const latestA = a.doneWorkouts[a.doneWorkouts.length - 1].date;
                    const latestB = b.doneWorkouts[b.doneWorkouts.length - 1].date;
                    return getEpochMilliseconds(latestB) - getEpochMilliseconds(latestA);
                }
                return -1;
            });
        case "LONGEST_AGO":
            return sortedWorkouts.sort((a, b) => {
                if (a.doneWorkouts.length > 0 && b.doneWorkouts.length > 0) {
                    const latestDateA = a.doneWorkouts[a.doneWorkouts.length - 1].date;
                    const latestDateB = b.doneWorkouts[b.doneWorkouts.length - 1].date;
                    return getEpochMilliseconds(latestDateA) - getEpochMilliseconds(latestDateB);
                }
                return -1;
            });
    }

    return sortedWorkouts;
};
