import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store";
import { getWorkoutSorting } from "../store/reducers/workout/workoutSelectors";
import { useComposedTranslation } from "./useComposedTranslation";
import { Sortingtypes } from "../store/types";
import { useMemo } from "react";
import { setWorkoutSorting } from "../store/reducers/workout";
import { setMeasurementSorting } from "../store/reducers/measurements";
import { getMeasurementSorting } from "../store/reducers/measurements/measurementSelectors";

const SortIconMap = {
    ["A_Z"]: "sort-alphabetical-ascending",
    ["Z_A"]: "sort-alphabetical-descending",
    ["MOST_RECENT"]: "sort-calendar-ascending",
    ["LONGEST_AGO"]: "sort-calendar-descending",
} as const;

type SortingConfig = {
    type: "Workout" | "Measurement";
};

export const useSorting = ({ type }: SortingConfig) => {
    const { t } = useTranslation();
    const currentSorting = useAppSelector(type === "Measurement" ? getMeasurementSorting : getWorkoutSorting);
    const dispatch = useAppDispatch();
    const title = useComposedTranslation("sorting_label", `sorting_${currentSorting}`);

    const sortDispatchFunction = useMemo(() => {
        if (type === "Measurement") {
            return setMeasurementSorting;
        }
        return setWorkoutSorting;
    }, [type]);

    const mappedSorting = useMemo(
        () =>
            Sortingtypes.map(
                (sorting) =>
                    ({
                        value: sorting,
                        label: t(`sorting_${sorting}`),
                        iconName: SortIconMap[sorting],
                        selectCallback: () => {
                            dispatch(sortDispatchFunction(sorting));
                        },
                    }) as const,
            ),
        [dispatch, sortDispatchFunction, t],
    );

    return useMemo(() => ({ iconName: SortIconMap[currentSorting], title, mappedSorting }) as const, [currentSorting, mappedSorting, title]);
};
