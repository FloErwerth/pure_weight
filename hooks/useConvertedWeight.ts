import { useAppSelector } from "../store";
import { getUnitSystem } from "../store/selectors/settings/settingsSelectors";
import { useCallback } from "react";

export const getConveredWeight = (unitSystem: string, weight: number) => {
    const isATon = unitSystem === "metric" ? weight > 1000 : weight > 907.1847;
    const isKTon = unitSystem === "metric" ? weight > 1000000 : weight > 907184.7;
    const isMTon = unitSystem === "metric" ? weight > 1000000000 : weight > 907184700;

    const getConvertedUnit = () => {
        if (unitSystem === "metric") {
            if (isMTon) {
                return "Mt";
            }
            if (isKTon) {
                return "kt";
            }
            if (isATon) {
                return "t";
            }
            return "kg";
        }

        if (isMTon) {
            return "M tons";
        }
        if (isKTon) {
            return "k tons";
        }
        if (isATon) {
            return "tons";
        }
        return "lbs";
    };

    const getConvertedKg = () => {
        if (isMTon) {
            return (weight / 1000000000).toFixed(2);
        }
        if (isKTon) {
            return (weight / 1000000).toFixed(2);
        }
        if (isATon) {
            return (weight / 1000).toFixed(2);
        }
        return weight.toString();
    };

    const getConvertedLbs = () => {
        if (isMTon) {
            return (weight / 907184700).toFixed(2);
        }
        if (isKTon) {
            return (weight / 907184.7).toFixed(2);
        }
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
