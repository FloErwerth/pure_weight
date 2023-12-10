import { useMemo } from "react";
import { WorkoutSortingType } from "../../../../store/types";
import { setWorkoutSorting } from "../../../../store/reducers/workout";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getWorkoutSorting } from "../../../../store/reducers/workout/workoutSelectors";
import { useTranslation } from "react-i18next";
import { useBottomSheetRef } from "../../../BottomSheetModal/ThemedBottomSheetModal";
import { SortingButton } from "../../../SortingButton/SortingButton";
import { useComposedTranslation } from "../../../../hooks/useComposedTranslation";

const SortIconMap = {
    ["A_Z"]: "sort-alphabetical-ascending",
    ["Z_A"]: "sort-alphabetical-descending",
    ["MOST_RECENT"]: "sort-calendar-ascending",
    ["LONGEST_AGO"]: "sort-calendar-descending",
} as const;

const useWorkoutSorting = () => {
    const [ref, open, close] = useBottomSheetRef();
    const { t } = useTranslation();
    const currentSorting = useAppSelector(getWorkoutSorting);
    const dispatch = useAppDispatch();
    const title = useComposedTranslation("workout_sorting_label", `workout_sorting_${currentSorting}`);
    const mappedSorting = WorkoutSortingType.map(
        (sorting) =>
            ({
                value: sorting,
                label: t(`workout_sorting_${sorting}`),
                iconName: SortIconMap[sorting],
                handleSelect: () => {
                    if (currentSorting !== sorting) {
                        close();
                    }
                    dispatch(setWorkoutSorting(sorting));
                },
                ref,
            }) as const,
    );

    return useMemo(() => ({ iconName: SortIconMap[currentSorting], title, mappedSorting, ref, open }) as const, [currentSorting, mappedSorting, open, ref, t]);
};
export const WorkoutSorting = () => {
    const { title, iconName, ref, mappedSorting } = useWorkoutSorting();
    const { t } = useTranslation();

    return <SortingButton iconName={iconName} sheetRef={ref} title={title} bottomSheetTitle={t("workout_sorting_modal_title")} mappedOptions={mappedSorting} />;
};
