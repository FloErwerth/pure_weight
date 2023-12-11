import { createSelector } from "@reduxjs/toolkit";
import { getDate } from "../../../utils/date";
import { AppState } from "../../index";
import { getUnitSystem } from "../settings/settingsSelectors";
import { getLastNEntries } from "../../../utils/getLastNEntries";
import { UnitSystem } from "../settings/types";
import { MeasurementType } from "../../../components/App/measurements/types";
import { measurementUnitMap } from "../../../utils/unitMap";

export const getMeasurementsState = (state: AppState) => state.measurmentState;
export const getInspectedMeasurementIndex = createSelector([getMeasurementsState], (state) => state.inspectedMeasurementIndex);

export const getMeasurements = createSelector([getMeasurementsState], (state) => state.measurements);
export const getInspectedMeasurement = createSelector([getMeasurements, getInspectedMeasurementIndex], (measurments, index) => {
    if (index) {
        return measurments[index];
    }
    return undefined;
});
export const getLatestMeasurements = createSelector([getMeasurements], (measurements) =>
    measurements.map(({ data }) => {
        return data[data.length - 1].timestamp;
    }),
);

const getUnitByType = (unitSystem: UnitSystem, type?: MeasurementType) => {
    if (!type) {
        return "";
    }

    return measurementUnitMap[unitSystem][type];
};
export const getMeasurementData = createSelector([getMeasurements, getInspectedMeasurementIndex, getUnitSystem], (measurements, index, unitSystem) => {
    if (index === undefined) {
        return undefined;
    }

    const measurement = measurements[index];
    const entries = getLastNEntries(measurement.data ?? [], 25);
    if (measurement?.data) {
        const labels: string[] = [];
        const data: number[] = [];
        entries.forEach(({ timestamp, value }) => {
            labels.push(getDate(timestamp));
            data.push(parseFloat(value));
        });
        return {
            labels,
            name: measurement.name,
            unit: getUnitByType(unitSystem, measurement.type),
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
    const data = measurement.data.map(({ value }) => value);
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
