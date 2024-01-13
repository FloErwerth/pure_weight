import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Measurement } from "../../../components/App/measurements/types";
import { SortingType } from "../../types";
import { sortMeasurements } from "./utils/sortMeasurements";
import { IsoDate } from "../../../types/date";

type NewMeasurement = { isNew: true };
type ExistingMeasurement = { measurementId: number; isNew: false; isDataPoint: false };
export type MeasurementDataPoint = { isNew: false; isDataPoint: true; dataPointIndex: number; measurementId: number };
type EditedMeasurementPayload = NewMeasurement | ExistingMeasurement | MeasurementDataPoint | undefined;
export type EditedMeasurement = EditedMeasurementPayload & { measurement: Measurement };
export type EditedMeasurementDataPoint = { indexInData: number; timestamp: number; value: string; editedMeasurement: EditedMeasurement };

export type MeasurementState = {
    measurements: Measurement[];
    deletedMeasurement?: { measurement: Measurement };
    inspectedMeasurement?: number;
    editedMeasurement?: EditedMeasurement;
    editedMeasurementDataPoint?: EditedMeasurementDataPoint;
    sorting: SortingType;
};

export const setMeasurementState = createAction<MeasurementState, "measurement_set_state">("measurement_set_state");
export const setMeasurements = createAction<Measurement[], "measurement_set_measurement">("measurement_set_measurement");
export const setEditedMeasurement = createAction<EditedMeasurementPayload, "measurement_set_inspected_measurement">("measurement_set_inspected_measurement");
export const addMeasurement = createAction<{ measurement: Measurement; index?: number }, "measurement_add">("measurement_add");
export const editMeasurement = createAction<{ measurement: Measurement; index: number }, "measurement_edit">("measurement_edit");
export const deleteMeasurement = createAction<number, "measurement_delete">("measurement_delete");
export const setMeasurementSorting = createAction<SortingType, "measurement_sort">("measurement_sort");
export const mutateEditedMeasurement = createAction<{ key: keyof Measurement; value: Measurement[keyof Measurement] }, "mutate_measurement">("mutate_measurement");
export const mutateEditedMeasurementDataPoint = createAction<{ key: "value" | "timestamp"; value: Measurement[keyof Measurement] }, "mutate_measurement">("mutate_measurement");
export const setDatapointIndexInEditedExercise = createAction<number, "setDatapointIndexInEditedExercise">("setDatapointIndexInEditedExercise");
export const saveEditedMeasurement = createAction<{ isoDate: IsoDate; replaceIndex: number | undefined }, "save_inspected_measurement">("save_inspected_measurement");
export const saveMeasurementDataPoint = createAction<{ isoDate: IsoDate }, "save_measurement_data_point">("save_measurement_data_point");
export const setupNewMeasurement = createAction("setup_new_measurement");
export const recoverMeasurement = createAction("measurement_recover");

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
        .addCase(setDatapointIndexInEditedExercise, (state, action) => {
            if (state.editedMeasurement && action.payload !== undefined) {
                state.editedMeasurement = {
                    ...state.editedMeasurement,
                    measurement: {
                        ...state.editedMeasurement.measurement,
                        value: state.editedMeasurement.measurement.data[action.payload]?.value ?? "",
                    },
                    isDataPoint: true,
                    dataPointIndex: action.payload,
                };
            }
        })
        .addCase(setEditedMeasurement, (state, action) => {
            if (action.payload === undefined) {
                state.editedMeasurement = undefined;
                return;
            }
            if (action.payload.isNew) {
                state.editedMeasurement = { isNew: true, measurement: { measurementId: Date.now(), name: "", data: [] } };
                return;
            }
            const measurementId = action.payload.measurementId;
            const measurement = state.measurements.find((measurement) => measurement.measurementId === measurementId);
            if (measurement) {
                if (action.payload.isDataPoint) {
                    measurement.value = measurement?.data[action.payload.dataPointIndex]?.value ?? "";
                    state.editedMeasurement = {
                        isNew: false,
                        isDataPoint: true,
                        measurementId: action.payload.measurementId,
                        dataPointIndex: action.payload.dataPointIndex,
                        measurement,
                    };
                    return;
                }

                measurement.value = measurement.data[measurement.data.length - 1]?.value ?? "";
                state.editedMeasurement = { measurementId, isNew: false, isDataPoint: false, measurement };
            }
        })
        .addCase(setupNewMeasurement, (state) => {
            const newMeasurement: Measurement = { measurementId: Date.now(), name: "", data: [] };
            state.editedMeasurement = { isNew: true, measurement: newMeasurement };
        })
        .addCase(saveMeasurementDataPoint, (state, action) => {
            const editedMeasurement = state.editedMeasurement;
            if (editedMeasurement && !editedMeasurement.isNew && editedMeasurement.isDataPoint) {
                const index = state.measurements.findIndex((measurement) => measurement.measurementId === editedMeasurement.measurement.measurementId);
                const newMeasurement = editedMeasurement.measurement;
                newMeasurement?.data.splice(editedMeasurement.dataPointIndex, 1, { isoDate: action.payload.isoDate, value: newMeasurement.value ?? "" });
                state.measurements.splice(index, 1, newMeasurement);
            }
            state.editedMeasurement = undefined;
        })
        .addCase(saveEditedMeasurement, (state, action) => {
            const editedMeasurement = state.editedMeasurement;
            if (editedMeasurement) {
                const newMeasurement = editedMeasurement.measurement;
                if (action.payload.replaceIndex !== undefined) {
                    newMeasurement.data.splice(action.payload.replaceIndex, 1);
                }
                const measurementsIndex = state.measurements.findIndex((measurement) => measurement.measurementId === newMeasurement.measurementId);
                newMeasurement.data.push({ isoDate: action.payload.isoDate, value: newMeasurement.value ?? "" });
                if (editedMeasurement.isNew) {
                    state.measurements.push(newMeasurement);
                } else {
                    state.measurements.splice(measurementsIndex, 1, newMeasurement);
                }
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
        });
});
