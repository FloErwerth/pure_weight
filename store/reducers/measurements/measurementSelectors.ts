import { createSelector } from "@reduxjs/toolkit";
import { getDate } from "../../../utils/date";
import { AppState } from "../../index";
import { getUnitSystem } from "../settings/settingsSelectors";
import { getLastNEntries } from "../../../utils/getLastNEntries";
import { UnitSystem } from "../settings/types";
import { MeasurementType } from "../../../components/App/measurements/types";
import { measurementUnitMap } from "../../../utils/unitMap";

export const getMeasurementsState = (state: AppState) => state.measurmentState;
export const getEditedMeasurementData = createSelector([getMeasurementsState], (state) => state.editedMeasurement);

export const getMeasurements = createSelector([getMeasurementsState], (state) => state.measurements);

export const getLatestMeasurements = createSelector([getMeasurements], (measurements) =>
    measurements.map(({ data }) => {
        return data[data.length - 1]?.timestamp ?? 0;
    }),
);

const getUnitByType = (unitSystem: UnitSystem, type?: MeasurementType) => {
    if (!type) {
        return "";
    }

    return measurementUnitMap[unitSystem][type];
};
export const getMeasurementData = createSelector([getMeasurements, getEditedMeasurementData, getUnitSystem], (measurements, data, unitSystem) => {
    if (data === undefined || data.isNew) {
        return undefined;
    }
    const { index } = data;
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
export const getDatesFromCurrentMeasurement = createSelector([getEditedMeasurementData], (measurement) => {
    if (!measurement || measurement.isNew) {
        return undefined;
    }
    return measurement.measurement.data.map(({ timestamp }) => getDate(timestamp));
});
