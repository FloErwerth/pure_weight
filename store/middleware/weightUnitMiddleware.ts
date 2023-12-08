import { Action, Middleware } from "redux";
import { AppActions, AppState } from "../index";
import { setWorkouts } from "../reducers/workout";
import { LengthUnit, UnitSystem, WeightUnit } from "../reducers/settings/types";
import { MeasurementDataPoints, MeasurementType } from "../../components/App/measurements/types";
import { setMeasurements } from "../reducers/measurements";
import { unitMap } from "../../utils/unitMap";
import { convert } from "convert";

const round = (num: number) => {
    return (Math.round(num * 100) / 100).toString();
};

const calculateWeight = (weight: string, nextUnit: WeightUnit) => {
    let convertedWeight = weight;

    if (nextUnit === "kg") {
        convertedWeight = round(convert(parseFloat(weight), "pound").to("kg"));
    }
    if (nextUnit === "lbs") {
        convertedWeight = round(convert(parseFloat(weight), "kg").to("pound"));
    }

    return convertedWeight;
};

const convertKgToPound = (data: MeasurementDataPoints): MeasurementDataPoints =>
    Object.fromEntries(Object.entries(data).map(([date, data]) => [date, round(convert(parseFloat(data), "kg").to("pound"))]));
const convertPoundToKg = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, calculateWeight(data, "kg")]));
const convertCmToInch = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, calculateWeight(data, "lbs")]));
const convertInchToCm = (data: MeasurementDataPoints) => Object.fromEntries(Object.entries(data).map(([date, data]) => [date, round(convert(parseFloat(data), "inch").to("cm"))]));

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

export const convertMeasurements = (type: MeasurementType | undefined, data: MeasurementDataPoints, nextUnitSystem: UnitSystem): MeasurementDataPoints => {
    if (type === "weight") {
        return convertWeight(getNextUnit(nextUnitSystem).weight, data);
    }
    if (type === "growth") {
        return convertLength(getNextUnit(nextUnitSystem).length, data);
    }

    return data;
};

const getNextUnit = (nextSystem: UnitSystem) => {
    return unitMap[nextSystem];
};
export const weightMiddleware: Middleware<Record<string, string>, AppState> = (storeApi) => (next) => (action) => {
    const dispatch = storeApi.dispatch;
    const state = storeApi.getState();
    const typedAction: Action<AppActions> = action as Action<AppActions>;
    if (typedAction.type === "set_unit_system") {
        const nextUnitSystem = state.settingsState.unitSystem === "metric" ? "imperial" : "metric";
        const nextUnit = getNextUnit(nextUnitSystem);
        dispatch(
            setWorkouts(
                state.workoutState.workouts.map((workout) => ({
                    ...workout,
                    doneWorkouts: workout.doneWorkouts.map((doneWorkout) => ({
                        ...doneWorkout,
                        doneExercises: doneWorkout.doneExercises?.map((doneExercise) => ({
                            ...doneExercise,
                            sets: doneExercise.sets.map((set) => ({ ...set, weight: calculateWeight(set.weight, nextUnit.weight) })),
                        })),
                    })),
                    exercises: workout.exercises.map((exercise) => ({ ...exercise, weight: calculateWeight(exercise.weight, nextUnit.weight) })),
                })),
            ),
        );
        dispatch(
            setMeasurements(
                state.measurmentState.measurements.map((measurement) => {
                    return {
                        ...measurement,
                        data: measurement.data ? convertMeasurements(measurement.type, measurement.data, nextUnitSystem) : measurement.data,
                    };
                }),
            ),
        );
    }
    next(action);
};
