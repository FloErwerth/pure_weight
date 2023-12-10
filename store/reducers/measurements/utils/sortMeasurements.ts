import { SortingType } from "../../../types";
import { Measurement } from "../../../../components/App/measurements/types";
import { getEpochMilliseconds } from "../../../../utils/date";
import { IsoDate } from "../../../../types/date";

export const sortMeasurements = (measurements: Measurement[], sorting: SortingType) => {
    const sortedMeasurement = [...measurements];
    switch (sorting) {
        case "A_Z":
            return sortedMeasurement.sort((a, b) => a.name.localeCompare(b.name));
        case "Z_A":
            return sortedMeasurement.sort((a, b) => b.name.localeCompare(a.name));
        case "MOST_RECENT":
            return sortedMeasurement.sort((a, b) => {
                const latestDateA = Object.entries(a.data)[Object.entries(a.data).length - 1][0] as IsoDate;
                const latestDateB = Object.entries(b.data)[Object.entries(b.data).length - 1][0] as IsoDate;
                return getEpochMilliseconds(latestDateB) - getEpochMilliseconds(latestDateA);
            });
        case "LONGEST_AGO":
            return sortedMeasurement.sort((a, b) => {
                const latestDateA = Object.entries(a.data)[Object.entries(a.data).length - 1][0] as IsoDate;
                const latestDateB = Object.entries(b.data)[Object.entries(b.data).length - 1][0] as IsoDate;
                return getEpochMilliseconds(latestDateA) - getEpochMilliseconds(latestDateB);
            });
    }

    return sortedMeasurement;
};
