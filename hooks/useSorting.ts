import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../store";
import { useComposedTranslation } from "./useComposedTranslation";
import { Sortingtypes } from "../store/types";
import { useMemo } from "react";
import { setWorkoutSorting } from "../store/reducers/workout";
import { getWorkoutSorting } from "../store/reducers/workout/workoutSelectors";

const SortIconMap = {
    ["A_Z"]: "sort-alphabetical-ascending",
    ["Z_A"]: "sort-alphabetical-descending",
    ["MOST_RECENT"]: "sort-calendar-ascending",
    ["LONGEST_AGO"]: "sort-calendar-descending",
} as const;

export const useSorting = () => {
    const { t } = useTranslation();
    const currentSorting = useAppSelector(getWorkoutSorting);
    const dispatch = useAppDispatch();
    const title = useComposedTranslation("sorting_label", `sorting_${currentSorting}`);

    const mappedSorting = useMemo(
        () =>
            Sortingtypes.map(
                (sorting) =>
                    ({
                        value: sorting,
                        label: t(`sorting_${sorting}`),
                        iconName: SortIconMap[sorting],
                        selectCallback: () => {
                            dispatch(setWorkoutSorting(sorting));
                        },
                    }) as const,
            ),
        [dispatch, t],
    );

    return useMemo(
        () => ({ iconName: SortIconMap[currentSorting ?? "A_Z"], title, mappedSorting }) as const,
        [currentSorting, mappedSorting, title],
    );
};
