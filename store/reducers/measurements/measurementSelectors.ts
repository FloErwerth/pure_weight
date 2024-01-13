import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";
import { getUnitSystem } from "../settings/settingsSelectors";
import { getLastNEntries } from "../../../utils/getLastNEntries";
import { UnitSystem } from "../settings/types";
import { MeasurementType } from "../../../components/App/measurements/types";
import { measurementUnitMap } from "../../../utils/unitMap";
import { sortMeasurements } from "./utils/sortMeasurements";
import { IsoDate } from "../../../types/date";

export const getMeasurementsState = (state: AppState) => state.measurmentState;
export const getEditedMeasurement = createSelector([getMeasurementsState], (state) => state.editedMeasurement);

export const getMeasurements = createSelector([getMeasurementsState], (state) => state.measurements);
export const getMeasurementDataPoint = createSelector([getEditedMeasurement], (editedMeasurement) => {
    return Boolean(editedMeasurement && !editedMeasurement.isNew && editedMeasurement.isDataPoint);
});

export const getLatestMeasurements = createSelector([getMeasurements], (measurements) =>
    measurements.reduce(
        (obj, { measurementId, data }) => {
            return { ...obj, [measurementId]: data[data.length - 1]?.isoDate ?? 0 };
        },
        {} as Record<string, IsoDate>,
    ),
);

export const getUnitByType = (unitSystem: UnitSystem, type?: MeasurementType) => {
    if (!type) {
        return "";
    }

    return measurementUnitMap[unitSystem][type];
};
export const getMeasurementData = createSelector([getEditedMeasurement, getUnitSystem], (editedMeasurement, unitSystem) => {
    if (!editedMeasurement || editedMeasurement?.isNew) {
        return undefined;
    }
    const entries = getLastNEntries(editedMeasurement.measurement?.data ?? [], 25);
    if (editedMeasurement.measurement?.data) {
        const labels: string[] = [];
        const data: number[] = [];
        entries.forEach(({ isoDate, value }) => {
            labels.push(isoDate);
            data.push(parseFloat(value));
        });
        return {
            labels,
            name: editedMeasurement.measurement.name,
            unit: getUnitByType(unitSystem, editedMeasurement.measurement.type),
            datasets: [
                {
                    data,
                },
            ],
        };
    }
    return undefined;
});
export const getMeasurementSorting = createSelector([getMeasurementsState], (state) => state.sorting);
export const getMeasurmentProgress = createSelector([getMeasurements, (byIndex, index: number) => index], (measurements, index) => {
    const measurement = measurements.find((measurement) => measurement.measurementId === index);
    const data = measurement?.data.map(({ value }) => value);
    if (data && data?.length >= 2) {
        const latest = parseFloat(data[data?.length - 1]);
        const secondLatest = parseFloat(data[data?.length - 2]);
        const percent = (latest / secondLatest) * 100;
        if (percent > 100) {
            return percent - 100;
        }
        return 100 - percent;
    }

    return undefined;
});
export const getSortedMeasurements = createSelector([getMeasurements, getMeasurementSorting], (measurements, sorting) => {
    return sortMeasurements(measurements, sorting);
});
export const getDatesFromCurrentMeasurement = createSelector([getEditedMeasurement], (measurement) => {
    if (!measurement || measurement.isNew) {
        return undefined;
    }
    return measurement.measurement.data.map(({ isoDate }) => isoDate);
});
