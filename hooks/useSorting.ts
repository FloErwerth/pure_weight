import { useTranslation } from "react-i18next";
import { AppState, useAppDispatch, useAppSelector } from "../store";
import { useComposedTranslation } from "./useComposedTranslation";
import { Sortingtypes } from "../store/types";
import { useMemo } from "react";
import { setTemplateSorting, setWorkoutSorting } from "../store/reducers/workout";
import { setMeasurementSorting } from "../store/reducers/measurements";
import { getSortingType } from "../store/reducers/workout/workoutSelectors";

const SortIconMap = {
    ["A_Z"]: "sort-alphabetical-ascending",
    ["Z_A"]: "sort-alphabetical-descending",
    ["MOST_RECENT"]: "sort-calendar-ascending",
    ["LONGEST_AGO"]: "sort-calendar-descending",
} as const;

type SortingConfig = {
    type: "Workout" | "Measurement" | "ExerciseTemplate";
};

export const useSorting = ({ type }: SortingConfig) => {
    const { t } = useTranslation();
    const currentSorting = useAppSelector((state: AppState) => getSortingType(state, type));
    const dispatch = useAppDispatch();
    const title = useComposedTranslation("sorting_label", `sorting_${currentSorting}`);

    const sortDispatchFunction = useMemo(() => {
        if (type === "Measurement") {
            return setMeasurementSorting;
        }
        if (type === "ExerciseTemplate") {
            return setTemplateSorting;
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

    return useMemo(() => ({ iconName: SortIconMap[currentSorting ?? "A_Z"], title, mappedSorting }) as const, [currentSorting, mappedSorting, title]);
};
