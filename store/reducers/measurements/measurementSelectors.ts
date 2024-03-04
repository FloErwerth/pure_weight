import { createSelector } from "@reduxjs/toolkit";
import { AppState } from "../../index";
import { getUnitSystem } from "../settings/settingsSelectors";
import { UnitSystem } from "../settings/types";
import { MeasurementId, MeasurementType } from "../../../components/App/measurements/types";
import { measurementUnitMap } from "../../../utils/unitMap";
import { sortMeasurements } from "./utils/sortMeasurements";
import { IsoDate } from "../../../types/date";

export const getMeasurementsState = (state: AppState) => state.measurementState;
export const getEditedMeasurement = createSelector([getMeasurementsState], (state) => state.editedMeasurement);

export const getMeasurements = createSelector([getMeasurementsState], (state) => state.measurements);
export const getEditedMeasurementDataPoint = createSelector(
    [getMeasurementsState],
    (state) => state.editedMeasurementDataPoint,
);
export const getLatestMeasurements = createSelector([getMeasurements], (measurements) =>
    measurements.reduce(
        (obj, { measurementId, data }) => {
            return { ...obj, [measurementId]: data[data.length - 1]?.isoDate ?? 0 };
        },
        {} as Record<MeasurementId, IsoDate>,
    ),
);

export const getUnitByType = (unitSystem: UnitSystem, type?: MeasurementType) => {
    if (!type) {
        return "";
    }

    return measurementUnitMap[unitSystem][type];
};
export const getMeasurementData = createSelector(
    [getEditedMeasurement, getUnitSystem],
    (editedMeasurement, unitSystem) => {
        if (!editedMeasurement || editedMeasurement?.isNew) {
            return undefined;
        }
        const entries = editedMeasurement.measurement?.data ?? [];
        if (editedMeasurement.measurement?.data) {
            const labels: string[] = [];
            const data: number[] = [];
            entries.forEach((entry) => {
                if (!entry) {
                    return;
                }
                labels.push(entry.isoDate);
                data.push(parseFloat(entry.value));
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
    },
);
export const getMeasurementSorting = createSelector([getMeasurementsState], (state) => state.sorting);
export const getMeasurmentProgress = createSelector(
    [getMeasurements, (_, index: MeasurementId) => index],
    (measurements, index) => {
        const measurement = measurements.find((measurement) => measurement.measurementId === index);
        const data = measurement?.data.map((data) => data?.value);

        if (data && data.length >= 2) {
            const latest = parseFloat(data[data.length - 1] ?? "0");
            const secondLatest = parseFloat(data[data.length - 2] ?? "1");
            if (measurement?.type === "percent") {
                return latest - secondLatest;
            }

            const percentRaw = (latest / secondLatest) * 100;

            if (percentRaw > 100) {
                return percentRaw - 100;
            }
            return 100 - percentRaw;
        }

        return undefined;
    },
);

export const getNumberMeasurementEntries = createSelector(
    [getMeasurements, (measurements, measurementId: MeasurementId) => measurementId],
    (measurements, measurementId) => {
        const measurement = measurements.find((measurement) => measurement.measurementId === measurementId);

        return measurement?.data.length ?? 0;
    },
);

export const getSearchedMeasurements = createSelector([getMeasurementsState], (state) => state.searchedMeasurements);

export const getSortedMeasurements = createSelector(
    [getMeasurements, getMeasurementSorting],
    (measurements, sorting) => {
        return sortMeasurements(measurements, sorting);
    },
);
export const getDatesFromCurrentMeasurement = createSelector([getEditedMeasurement], (editedMeasurement) => {
    if (!editedMeasurement) {
        return undefined;
    }
    return editedMeasurement.measurement?.data?.map((data) => data?.isoDate);
});
