import { SortingType } from "../../types";
import { Workout } from "./types";
import { Temporal } from "@js-temporal/polyfill";
import { convertDate } from "../../../utils/date";

const sortDates = (a: Workout, b: Workout) => {
    const isoDatesA = a.doneWorkouts.map((workout) => workout.isoDate);
    const isoDatesB = b.doneWorkouts.map((workout) => workout.isoDate);
    return Temporal.PlainDate.compare(convertDate.toTemporal(isoDatesB[isoDatesB.length - 1]), convertDate.toTemporal(isoDatesA[isoDatesA.length - 1]));
};

export const sortWorkouts = (workouts: Workout[], sorting: SortingType) => {
    const sortedWorkouts = [...workouts];
    switch (sorting) {
        case "A_Z":
            return sortedWorkouts.sort((a, b) => a.name.localeCompare(b.name));
        case "Z_A":
            return sortedWorkouts.sort((a, b) => b.name.localeCompare(a.name));
        case "MOST_RECENT":
            return sortedWorkouts.sort(sortDates);
        case "LONGEST_AGO":
            return sortedWorkouts.sort(sortDates).reverse();
    }
};
