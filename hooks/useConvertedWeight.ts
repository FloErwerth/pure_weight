import { useAppSelector } from "../store";
import { getUnitSystem } from "../store/selectors/settings/settingsSelectors";
import { useCallback } from "react";

export const getConveredWeight = (unitSystem: string, weight: number) => {
    const isATon = unitSystem === "metric" ? weight > 1000 : weight > 907.1847;

    const getConvertedUnit = () => {
        if (unitSystem === "metric") {
            if (isATon) {
                return "t";
            }
            return "kg";
        }

        if (isATon) {
            return "tons";
        }
        return "lbs";
    };

    const getConvertedKg = () => {
        if (isATon) {
            return (weight / 1000).toFixed(2);
        }
        return weight.toString();
    };

    const getConvertedLbs = () => {
        if (isATon) {
            return (weight / 907.1847).toFixed(2);
        }
        return weight.toString();
    };

    return { unit: getConvertedUnit(), weight: unitSystem === "metric" ? getConvertedKg() : getConvertedLbs() };
};

export const useGetConvertedWeight = () => {
    const unitSystem = useAppSelector(getUnitSystem);

    return useCallback((weight: number) => getConveredWeight(unitSystem, weight), [unitSystem]);
};
