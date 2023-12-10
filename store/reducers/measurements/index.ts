import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Measurement } from "../../../components/App/measurements/types";
import { SortingType } from "../../types";
import { sortMeasurements } from "./utils/sortMeasurements";

export type MeasurementState = { measurements: Measurement[]; deletedMeasurement?: { measurement: Measurement; index: number }; inspectedMeasurementIndex?: number; sorting: SortingType };
export const setMeasurementState = createAction<MeasurementState, "measurement_set_state">("measurement_set_state");
export const setMeasurements = createAction<Measurement[], "measurement_set_measurement">("measurement_set_measurement");
export const setInspectedMeasurement = createAction<number, "measurement_set_inspected_measurement">("measurement_set_inspected_measurement");
export const addMeasurement = createAction<{ measurement: Measurement; index?: number }, "measurement_add">("measurement_add");
export const editMeasurement = createAction<{ measurement: Measurement; index: number }, "measurement_edit">("measurement_edit");
export const deleteMeasurement = createAction<number, "measurement_delete">("measurement_delete");
export const setMeasurementSorting = createAction<SortingType, "workout_sort">("workout_sort");

export const recoverMeasurement = createAction("measurement_recover");

export type MeasurementActions =
    | typeof setMeasurementState.type
    | typeof addMeasurement.type
    | typeof editMeasurement.type
    | typeof deleteMeasurement.type
    | typeof recoverMeasurement.type
    | typeof setInspectedMeasurement.type;

export const measurementReducer = createReducer<MeasurementState>({ measurements: [], sorting: "A_Z" }, (builder) => {
    builder
        .addCase(setMeasurementState, (_, action) => {
            return action.payload;
        })
        .addCase(setInspectedMeasurement, (state, action) => {
            state.inspectedMeasurementIndex = action.payload;
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
            state.measurements = sortMeasurements(state.measurements, action.payload);
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
            const deletedMeasurement = newMeasurements.splice(action.payload, 1);
            state.deletedMeasurement = { measurement: deletedMeasurement[0], index: action.payload };
            state.measurements = sortMeasurements(newMeasurements, state.sorting);
        })
        .addCase(recoverMeasurement, (state) => {
            if (state.deletedMeasurement?.measurement !== undefined) {
                const newMeasurements = [...state.measurements];
                newMeasurements.splice(state.deletedMeasurement.index, 0, state.deletedMeasurement.measurement);
                state.measurements = sortMeasurements(newMeasurements, state.sorting);
            }
        });
});
