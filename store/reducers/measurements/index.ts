import { createAction, createReducer } from "@reduxjs/toolkit/src";
import { Measurement } from "../../../components/App/measurements/types";
import { convertMeasurements } from "../../../components/App/measurements/utils";

export type MeasurementState = { measurements: Measurement[]; deletedMeasurement?: { measurement: Measurement; index: number } };

export const setMeasurementState = createAction<MeasurementState>("measurement_set_state");
export const addMeasurement = createAction<{ measurement: Measurement; index?: number }>("measurement_add");
export const editMeasurement = createAction<{ measurement: Measurement; index: number }>("measurement_edit");
export const deleteMeasurement = createAction<number>("measurement_delete");
export const recoverMeasurement = createAction("measurement_recover");

export const measurementReducer = createReducer<MeasurementState>({ measurements: [] }, (builder) => {
    builder
        .addCase(setMeasurementState, (_, action) => {
            return action.payload;
        })
        .addCase(editMeasurement, (state, action) => {
            const measurements = [...state.measurements];
            const previouisMeasurement = measurements[action.payload.index];
            const newData = measurements[action.payload.index].data;
            if (previouisMeasurement.unit && newData && action.payload.measurement.unit !== previouisMeasurement.unit) {
                const convertedMeasurements = convertMeasurements(previouisMeasurement.unit, newData);
                measurements.splice(action.payload.index, 1, { ...action.payload.measurement, data: convertedMeasurements });
            } else {
                measurements.splice(action.payload.index, 1, action.payload.measurement);
            }

            state.measurements = measurements;
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
            state.measurements = newMeasurements;
        })
        .addCase(recoverMeasurement, (state) => {
            if (state.deletedMeasurement?.measurement !== undefined) {
                state.measurements.splice(state.deletedMeasurement.index, 0, state.deletedMeasurement.measurement);
            }
        });
});
