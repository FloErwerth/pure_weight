import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store";
import { getWorkoutSorting } from "../store/reducers/workout/workoutSelectors";
import { useComposedTranslation } from "./useComposedTranslation";
import { SortingType } from "../store/types";
import { useMemo } from "react";
import { setWorkoutSorting } from "../store/reducers/workout";
import { setMeasurementSorting } from "../store/reducers/measurements";

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
    const currentSorting = useAppSelector(getWorkoutSorting);
    const dispatch = useAppDispatch();
    const title = useComposedTranslation("sorting_label", `sorting_${currentSorting}`);

    const sortDispatchFunction = useMemo(() => {
        if (type === "Measurement") {
            return setMeasurementSorting;
        }
        return setWorkoutSorting;
    }, [type]);

    const mappedSorting = SortingType.map(
        (sorting) =>
            ({
                value: sorting,
                label: t(`sorting_${sorting}`),
                iconName: SortIconMap[sorting],
                selectCallback: () => {
                    dispatch(sortDispatchFunction(sorting));
                },
            }) as const,
    );

    return useMemo(() => ({ iconName: SortIconMap[currentSorting], title, mappedSorting }) as const, [currentSorting, mappedSorting, title]);
};
