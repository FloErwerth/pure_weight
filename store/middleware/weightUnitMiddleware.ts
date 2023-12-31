import { Action, Middleware } from "redux";
import { AppActions, AppState } from "../index";
import { setWorkouts } from "../reducers/workout";
import { LengthUnit, UnitSystem, WeightUnit } from "../reducers/settings/types";
import { MeasurementDataPoint, MeasurementType } from "../../components/App/measurements/types";
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

const convertKgToPound = (data: MeasurementDataPoint[]): MeasurementDataPoint[] => data.map(({ isoDate, value }) => ({ isoDate, value: round(convert(parseFloat(value), "kg").to("pound")) }));
const convertPoundToKg = (data: MeasurementDataPoint[]) => data.map(({ isoDate, value }) => ({ isoDate, value: calculateWeight(value, "kg") }));
const convertCmToInch = (data: MeasurementDataPoint[]) => data.map(({ isoDate, value }) => ({ isoDate, value: calculateWeight(value, "lbs") }));
const convertInchToCm = (data: MeasurementDataPoint[]) => data.map(({ isoDate, value }) => ({ isoDate, value: round(convert(parseFloat(value), "inch").to("cm")) }));

const convertWeight = (nextUnit: LengthUnit | WeightUnit, data: MeasurementDataPoint[]) => {
    switch (nextUnit) {
        case "kg":
            return convertPoundToKg(data);
        case "lbs":
            return convertKgToPound(data);
        default:
            return data;
    }
};

const convertLength = (nextUnit: LengthUnit | WeightUnit, data: MeasurementDataPoint[]) => {
    switch (nextUnit) {
        case "cm":
            return convertInchToCm(data);
        case "inch":
            return convertCmToInch(data);
        default:
            return data;
    }
};

export const convertMeasurements = (type: MeasurementType | undefined, data: MeasurementDataPoint[], nextUnitSystem: UnitSystem) => {
    if (type === "weight") {
        return convertWeight(getNextUnit(nextUnitSystem).weight, data);
    }
    if (type === "length") {
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
