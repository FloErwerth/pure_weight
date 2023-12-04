import { createSelector } from "@reduxjs/toolkit";
import { IsoDate } from "../../../types/date";
import { getDate } from "../../../utils/date";
import { AppState } from "../../index";

export const getMeasurementTypeDisplayOptions = (state: AppState) => {
    if (state.settingsState.unitSystem === "metric") {
    }
};
export const getMeasurementsState = (state: AppState) => state.measurmentState;
export const getMeasurements = createSelector([getMeasurementsState], (state) => state.measurements);
export const getLatestMeasurements = createSelector([getMeasurements], (measurements) =>
    measurements.map(({ data }) => {
        const dates = Object.keys(data ?? []);
        return dates[dates.length - 1] as IsoDate;
    }),
);
function crampToNEntries<T extends Array<unknown>>(n: number, entries: T): T {
    if (entries.length > n) {
        return entries.slice(entries.length - n, entries.length) as T;
    }
    return entries;
}

export const getMeasurementDataFromIndex = createSelector([getMeasurements, (byIndex, index?: number) => index], (measurements, index) => {
    if (index === undefined) {
        return undefined;
    }

    const measurement = measurements[index];
    if (measurement?.data) {
        const labels: string[] = [];
        const data: number[] = [];
        const entries = Object.entries(measurement?.data);
        const vals = crampToNEntries(100, entries);
        vals.forEach(([date, value]) => {
            labels.push(getDate(date as IsoDate));
            data.push(parseFloat(value));
        });
        return {
            labels,
            datasets: [
                {
                    data,
                },
            ],
        };
    }
    return undefined;
});
export const getMeasurmentProgress = createSelector([getMeasurements, (byIndex, index: number) => index], (measurements, index) => {
    const measurement = measurements[index];
    const data = Object.values(measurement?.data ?? []);

    if (data && data?.length >= 2) {
        const latest = parseFloat(data[data?.length - 1]);
        const secondLatest = parseFloat(data[data?.length - 2]);

        return (latest / secondLatest) * 100;
    }

    return undefined;
});
export const getDatesFromCurrentMeasurement = createSelector([getMeasurements], (measurements) => {
    return (measurementKey?: string) => {
        if (!measurementKey) {
            return undefined;
        }
        const measurementIndex = measurements.findIndex((measurement) => measurement.name === measurementKey);
        if (measurementIndex !== -1) {
            return Object.keys(measurements[measurementIndex].data ?? []);
        } else return undefined;
    };
});
