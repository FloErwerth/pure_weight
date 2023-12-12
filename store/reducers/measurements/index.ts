import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Measurement } from "../../../components/App/measurements/types";
import { SortingType } from "../../types";
import { sortMeasurements } from "./utils/sortMeasurements";

type NewMeasurement = { isNew: true };
type ExistingMeasurement = { isNew: false; index: number };
type EditedMeasurementPayload = NewMeasurement | ExistingMeasurement | undefined;
type EditedMeasurment = EditedMeasurementPayload & { measurement: Measurement };
export type MeasurementState = {
    measurements: Measurement[];
    deletedMeasurement?: { measurement: Measurement; index: number };
    inspectedMeasurement?: number;
    editedMeasurement?: EditedMeasurment;
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
export const saveEditedMeasurement = createAction("save_inspected_measurement");
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
        .addCase(setEditedMeasurement, (state, action) => {
            if (!action.payload) {
                state.editedMeasurement = undefined;
                return;
            }
            if (!action.payload.isNew) {
                const measurement = state.measurements[action.payload.index];
                measurement.value = measurement.data[measurement.data.length - 1]?.value ?? "";
                state.editedMeasurement = { isNew: false, measurement: state.measurements[action.payload.index], index: action.payload?.index };
            } else {
                state.editedMeasurement = { isNew: true, measurement: { name: "", data: [] } };
            }
        })
        .addCase(setupNewMeasurement, (state) => {
            const newMeasurement: Measurement = { name: "", data: [] };
            state.editedMeasurement = { isNew: true, measurement: newMeasurement };
        })
        .addCase(saveEditedMeasurement, (state) => {
            const editedMeasurement = state.editedMeasurement;
            if (editedMeasurement) {
                const measurements = [...state.measurements];
                const newMeasurement = editedMeasurement.measurement;
                newMeasurement.data.push({ timestamp: Date.now(), value: newMeasurement.value ?? "" });
                if (editedMeasurement.isNew) {
                    measurements.push(newMeasurement);
                } else {
                    measurements.splice(editedMeasurement.index, 1, newMeasurement);
                }
                state.measurements = measurements;
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
