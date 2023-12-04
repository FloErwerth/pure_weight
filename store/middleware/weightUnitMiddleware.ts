import { Middleware } from "redux";
import { AppState } from "../index";
import { setWorkouts } from "../reducers/workout";
import { LengthUnit, UnitSystem, WeightUnit } from "../reducers/settings/types";
import { MeasurementDataPoints, measurementUnitGroupsDefinition } from "../../components/App/measurements/types";
import { setMeasurements } from "../reducers/measurements";
import { unitMap } from "../../utils/unitMap";

const KG_TO_POUND = 2.205;
const CM_TO_INCH = 2.54;

const convertKgToPound = (data: MeasurementDataPoints): MeasurementDataPoints => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) * KG_TO_POUND).toString()]));
const convertPoundToKg = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) / KG_TO_POUND).toString()]));
const convertCmToInch = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) / CM_TO_INCH).toString()]));
const convertInchToCm = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, (parseFloat(data) * CM_TO_INCH).toString()]));

const convertWeight = (nextUnit: LengthUnit | WeightUnit, data: MeasurementDataPoints): MeasurementDataPoints => {
    switch (nextUnit) {
        case "kg":
            return convertPoundToKg(data);
        case "lbs":
            return convertKgToPound(data);
        default:
            return data;
    }
};

const convertLength = (nextUnit: LengthUnit | WeightUnit, data: MeasurementDataPoints): MeasurementDataPoints => {
    switch (nextUnit) {
        case "cm":
            return convertInchToCm(data);
        case "inch":
            return convertCmToInch(data);
        default:
            return data;
    }
};

export const convertMeasurements = (data: MeasurementDataPoints, nextUnit: WeightUnit | LengthUnit): MeasurementDataPoints => {
    console.log(nextUnit);
    if (measurementUnitGroupsDefinition.length.includes(nextUnit)) {
        return convertLength(nextUnit, data);
    }
    if (measurementUnitGroupsDefinition.weight.includes(nextUnit)) {
        return convertWeight(nextUnit, data);
    }
    return data;
};

const calculateWeight = (weight: string, unit: WeightUnit) => {
    if (unit === "kg") {
        return (parseFloat(weight) * 2.205).toString();
    }
    if (unit === "lbs") {
        return (parseFloat(weight) / 2.205).toString();
    }
    return weight;
};

const getNextUnit = (nextSystem: UnitSystem) => {
    return unitMap[nextSystem].weight;
};

export const weightMiddleware: Middleware<Record<string, unknown>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const state = storeApi.getState();
    if (action.type === "set_unit_system") {
        const nextUnit = getNextUnit(state.settingsState.unitSystem === "metric" ? "imperial" : "metric");
        dispatch(
            setWorkouts(
                state.workoutState.workouts.map((workout) => ({
                    ...workout,
                    doneWorkouts: workout.doneWorkouts.map((doneWorkout) => ({
                        ...doneWorkout,
                        doneExercises: doneWorkout.doneExercises?.map((doneExercise) => ({
                            ...doneExercise,
                            sets: doneExercise.sets.map((set) => ({ ...set, weight: calculateWeight(set.weight, nextUnit) })),
                        })),
                    })),
                    exercises: workout.exercises.map((exercise) => ({ ...exercise, weight: calculateWeight(exercise.weight, nextUnit) })),
                })),
            ),
        );

        dispatch(
            setMeasurements(
                state.measurmentState.measurements.map((measurement) => {
                    return {
                        ...measurement,
                        data: measurement.data ? convertMeasurements(measurement.data, nextUnit) : measurement.data,
                    };
                }),
            ),
        );
    }
    next(action);
};
