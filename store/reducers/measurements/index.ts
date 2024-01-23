import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Measurement, MeasurementDataPoint } from "../../../components/App/measurements/types";
import { SortingType } from "../../types";
import { sortMeasurements } from "./utils/sortMeasurements";
import { IsoDate } from "../../../types/date";
import { sortMeasurementDataPoints } from "../../../utils/sortIsoDate";

export type EditedMeasurement = { isNew: boolean; isEditing: boolean; measurement?: Measurement } | undefined;
export type EditedMeasurementDataPoint = { indexInData: number; timestamp: number; value: string; editedMeasurement: EditedMeasurement };

export type MeasurementState = {
    measurements: Measurement[];
    deletedMeasurement?: { measurement: Measurement };
    deletedMeasurementDataPoint?: { index: number; dataPoint: MeasurementDataPoint };
    inspectedMeasurement?: number;
    editedMeasurement?: EditedMeasurement;
    editedMeasurementDataPoint?: EditedMeasurementDataPoint;
    sorting: SortingType;
};

export const setMeasurementState = createAction<MeasurementState, "measurement_set_state">("measurement_set_state");
export const setMeasurements = createAction<Measurement[], "measurement_set_measurement">("measurement_set_measurement");
export const setEditedMeasurement = createAction<EditedMeasurement, "measurement_set_inspected_measurement">("measurement_set_inspected_measurement");
export const addMeasurement = createAction<{ measurement: Measurement; index?: number }, "measurement_add">("measurement_add");
export const editMeasurement = createAction<{ measurement: Measurement; index: number }, "measurement_edit">("measurement_edit");
export const deleteMeasurement = createAction<number, "measurement_delete">("measurement_delete");
export const setMeasurementSorting = createAction<SortingType, "measurement_sort">("measurement_sort");
export const mutateEditedMeasurement = createAction<{ key: keyof Measurement; value: Measurement[keyof Measurement] }, "mutate_measurement">("mutate_measurement");
export const saveEditedMeasurement = createAction<{ isoDate: IsoDate; replaceIndex: number | undefined } | undefined, "save_inspected_measurement">("save_inspected_measurement");
export const saveMeasurementDataPoint = createAction<{ datapoint?: MeasurementDataPoint; index?: number }, "save_measurement_data_point">("save_measurement_data_point");
export const deleteMeasurementDataPoint = createAction<{ index?: number }, "delete_measurement_data_point">("delete_measurement_data_point");
export const setupNewMeasurement = createAction("setup_new_measurement");
export const recoverMeasurement = createAction("measurement_recover");
export const recoverMeasurementDataPoint = createAction("measurement_recover_data_point");
export type MeasurementActions =
    | typeof setMeasurementState.type
    | typeof addMeasurement.type
    | typeof editMeasurement.type
    | typeof deleteMeasurement.type
    | typeof recoverMeasurement.type
    | typeof setEditedMeasurement.type;

export const measurementReducer = createReducer<MeasurementState>({ measurements: [], sorting: "A_Z" }, (builder) => {
    builder
        .addCase(setMeasurementState, (_, action) => {
            return action.payload;
        })
        .addCase(setEditedMeasurement, (state, action) => {
            if (action.payload === undefined) {
                state.editedMeasurement = undefined;
                return;
            }
            const measurement = action.payload.measurement;
            if (measurement) {
                measurement.value = measurement.data[measurement.data.length - 1]?.value ?? "";
                state.editedMeasurement = { isNew: false, isEditing: action.payload.isEditing, measurement };
            }
        })
        .addCase(setupNewMeasurement, (state) => {
            const newMeasurement: Measurement = { measurementId: Date.now(), name: "", data: [] };
            state.editedMeasurement = { isNew: true, isEditing: false, measurement: newMeasurement };
        })
        .addCase(saveMeasurementDataPoint, (state, action) => {
            const editedMeasurement = state.editedMeasurement;
            if (editedMeasurement && action.payload.datapoint && action.payload.index !== undefined) {
                const index = state.measurements.findIndex((measurement) => measurement.measurementId === editedMeasurement.measurement?.measurementId);
                const newMeasurement = editedMeasurement.measurement;
                if (newMeasurement) {
                    newMeasurement?.data.splice(action.payload.index, 1, action.payload.datapoint);
                    newMeasurement.data = sortMeasurementDataPoints(newMeasurement?.data);
                    state.measurements.splice(index, 1, newMeasurement);
                }
            }
        })
        .addCase(saveEditedMeasurement, (state, action) => {
            const editedMeasurement = state.editedMeasurement;
            const newMeasurement = editedMeasurement?.measurement;
            const measurementsIndex = state.measurements.findIndex((measurement) => measurement.measurementId === newMeasurement?.measurementId);
            if (editedMeasurement && newMeasurement) {
                if (editedMeasurement.isEditing) {
                    state.measurements.splice(measurementsIndex, 1, newMeasurement);
                    return;
                }
                if (action.payload?.replaceIndex !== undefined) {
                    newMeasurement.data.splice(action.payload.replaceIndex, 1);
                }
                if (action.payload?.isoDate !== undefined) {
                    newMeasurement.data.push({ isoDate: action.payload?.isoDate, value: newMeasurement.value ?? "" });
                }
                newMeasurement.data = sortMeasurementDataPoints(newMeasurement.data);
                if (editedMeasurement.isNew) {
                    state.measurements.push(newMeasurement);
                }
                state.measurements.splice(measurementsIndex, 1, newMeasurement);
            }
            state.editedMeasurement = undefined;
        })
        .addCase(mutateEditedMeasurement, (state, action) => {
            if (state.editedMeasurement && state.editedMeasurement.measurement) {
                state.editedMeasurement = { ...state.editedMeasurement, measurement: { ...state.editedMeasurement.measurement, [action.payload.key]: action.payload.value } };
            }
        })
        .addCase(setMeasurements, (state, action) => {
            state.measurements = action.payload;
            state.measurements = sortMeasurements(state.measurements, state.sorting);
        })
        .addCase(editMeasurement, (state, action) => {
            state.measurements.push(action.payload.measurement);
            state.measurements = sortMeasurements(state.measurements, state.sorting);
        })
        .addCase(setMeasurementSorting, (state, action) => {
            state.sorting = action.payload;
        })
        .addCase(addMeasurement, (state, action) => {
            if (action.payload.index !== undefined) {
                const measurements = [...state.measurements];
                const measurement = state.measurements[action.payload.index];
                const newMeasurement = { ...action.payload.measurement, data: { ...measurement.data, ...action.payload.measurement.data } };
                measurements.splice(action.payload.index, 1, newMeasurement);
                state.measurements = measurements;
            } else {
                const measurements = [...state.measurements];
                measurements.push(action.payload.measurement);
                state.measurements = measurements;
            }
        })
        .addCase(deleteMeasurement, (state, action) => {
            const newMeasurements = [...state.measurements];
            const index = newMeasurements.findIndex((measurement) => measurement.measurementId === action.payload);
            const deletedMeasurement = newMeasurements.splice(index, 1);
            state.deletedMeasurement = { measurement: deletedMeasurement[0] };
            state.measurements = sortMeasurements(newMeasurements, state.sorting);
        })
        .addCase(recoverMeasurement, (state) => {
            if (state.deletedMeasurement?.measurement !== undefined) {
                const newMeasurements = [...state.measurements];
                newMeasurements.splice(
                    state.measurements.findIndex((measurement) => measurement.measurementId === state.deletedMeasurement?.measurement.measurementId),
                    0,
                    state.deletedMeasurement.measurement,
                );
                state.measurements = sortMeasurements(newMeasurements, state.sorting);
            }
        })
        .addCase(deleteMeasurementDataPoint, (state, action) => {
            if (state.editedMeasurement?.measurement?.data && action.payload.index !== undefined) {
                const deletedDataPoint = state.editedMeasurement.measurement.data.splice(action.payload.index, 1);
                state.deletedMeasurementDataPoint = { index: action.payload.index, dataPoint: deletedDataPoint[0] };
            }
        })
        .addCase(recoverMeasurementDataPoint, (state) => {
            if (state.deletedMeasurementDataPoint && state.editedMeasurement) {
                state.editedMeasurement.measurement?.data.splice(state.deletedMeasurementDataPoint.index, 0, state.deletedMeasurementDataPoint?.dataPoint);
            }
        });
});
