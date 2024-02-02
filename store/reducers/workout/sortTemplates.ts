import { SortingType } from "../../types";
import { ExerciseTemplate } from "./types";
import { Temporal } from "@js-temporal/polyfill";
import { convertDate, getIsoDate } from "../../../utils/date";
import { extractMillisecondsFromId } from "../../../utils/generateId";

const sortDates = (a: ExerciseTemplate, b: ExerciseTemplate) => {
    const lastDateA = getIsoDate(extractMillisecondsFromId(a.templateId));
    const lastDateB = getIsoDate(extractMillisecondsFromId(b.templateId));

    return Temporal.PlainDate.compare(convertDate.toTemporal(lastDateB), convertDate.toTemporal(lastDateA));
};

export const sortTemplates = (templates: ExerciseTemplate[], sorting: SortingType) => {
    switch (sorting) {
        case "A_Z":
            return [...templates].sort((a, b) => a.exerciseMetaData.name.localeCompare(b.exerciseMetaData.name));
        case "Z_A":
            return [...templates].sort((a, b) => b.exerciseMetaData.name.localeCompare(a.exerciseMetaData.name));
        case "MOST_RECENT":
            return [...templates].sort((a, b) => sortDates(a, b));
        case "LONGEST_AGO":
            return [...templates].sort((a, b) => sortDates(a, b)).reverse();
    }
};
