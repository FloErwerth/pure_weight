import { SortingType } from "../../types";
import { Workout } from "./types";
import { Temporal } from "@js-temporal/polyfill";
import { convertDate } from "../../../utils/date";

const sortDates = (a: Workout, b: Workout) => {
    const isoDatesA = a.doneWorkouts.map((workout) => workout.isoDate);
    const isoDatesB = b.doneWorkouts?.map((workout) => workout.isoDate);

    const lastDateA = isoDatesA[isoDatesA?.length - 1];
    const lastDateB = isoDatesB[isoDatesB?.length - 1];

    return Temporal.PlainDate.compare(convertDate.toTemporal(lastDateB), convertDate.toTemporal(lastDateA));
};

export const sortWorkouts = (workouts: Workout[], sorting: SortingType) => {
    const sortableWorkouts = [...workouts.filter((workout) => workout.doneWorkouts.length > 0)];
    const unsortableWorkouts = [...workouts.filter((workout) => workout.doneWorkouts.length === 0)];
    switch (sorting) {
        case "A_Z":
            return [...sortableWorkouts, ...unsortableWorkouts].sort((a, b) => a.name.localeCompare(b.name));
        case "Z_A":
            return [...sortableWorkouts, ...unsortableWorkouts].sort((a, b) => b.name.localeCompare(a.name));
        case "MOST_RECENT":
            return [...sortableWorkouts.sort((a, b) => sortDates(a, b)), ...unsortableWorkouts];
        case "LONGEST_AGO":
            return [...sortableWorkouts.sort((a, b) => sortDates(a, b)).reverse(), ...unsortableWorkouts];
    }
};
