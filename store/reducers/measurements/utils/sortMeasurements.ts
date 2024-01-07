import { SortingType } from "../../../types";
import { Measurement } from "../../../../components/App/measurements/types";
import { convertDate } from "../../../../utils/date";
import { Temporal } from "@js-temporal/polyfill";

const sortAfterDate = (a: Measurement, b: Measurement) => {
    const latestDateA = a.data[a.data.length - 1].isoDate;
    const latestDateB = b.data[b.data.length - 1].isoDate;
    return Temporal.PlainDate.compare(convertDate.toTemporal(latestDateA), convertDate.toTemporal(latestDateB));
};
export const sortMeasurements = (measurements: Measurement[], sorting: SortingType) => {
    const sortedMeasurement = [...measurements];
    switch (sorting) {
        case "A_Z":
            return sortedMeasurement.sort((a, b) => a.name.localeCompare(b.name));
        case "Z_A":
            return sortedMeasurement.sort((a, b) => b.name.localeCompare(a.name));
        case "MOST_RECENT":
            return sortedMeasurement.sort((a, b) => sortAfterDate(a, b)).reverse();
        case "LONGEST_AGO":
            return sortedMeasurement.sort((a, b) => sortAfterDate(a, b));
    }

    return sortedMeasurement;
};
