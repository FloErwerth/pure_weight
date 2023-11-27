import { ThemedButtomSheetModal, useBottomSheetRef } from "../../../BottomSheetModal/ThemedButtomSheetModal";
import { ThemedPressable } from "../../../Themed/Pressable/Pressable";
import { Text } from "../../../Themed/ThemedText/Text";
import { styles } from "./styles";
import { WorkoutSortingType } from "../../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../../store";
import { getNumberSavedWorkouts, getWorkoutSorting } from "../../../../store/selectors";
import { useTranslation } from "react-i18next";
import { useMemo } from "react";
import { ThemedView } from "../../../Themed/ThemedView/View";
import { HStack } from "../../../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../../../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { setWorkoutSorting } from "../../../../store/reducers/workout";

const SortIconMap = {
    ["A_Z"]: "sort-alphabetical-ascending",
    ["Z_A"]: "sort-alphabetical-descending",
    ["MOST_RECENT"]: "sort-calendar-ascending",
    ["LONGEST_AGO"]: "sort-calendar-descending",
} as const;

const useMappedSortingLabels = () => {
    const [ref, open, close] = useBottomSheetRef();

    const { t } = useTranslation();
    const currentSorting = useAppSelector(getWorkoutSorting);
    const dispatch = useAppDispatch();
    const mappedSorting = WorkoutSortingType.map(
        (sorting) => ({
            value: sorting,
            label: t(`workout_sorting_${sorting}`),
            handleSelect: () => {
                if (currentSorting !== sorting) {
                    close();
                }
                dispatch(setWorkoutSorting(sorting));
            },
        }),
        {} as Record<WorkoutSortingType, string>,
    );

    return useMemo(
        () => ({ currentSorting, sortingLabel: t(`workout_sorting_${currentSorting}`), mappedSorting, ref, open }) as const,
        [currentSorting, mappedSorting, open, ref, t],
    );
};

export const WorkoutSorting = () => {
    const { currentSorting, sortingLabel, mappedSorting, ref, open } = useMappedSortingLabels();
    const numberSavedWorkouts = useAppSelector(getNumberSavedWorkouts);
    const { t } = useTranslation();

    if (numberSavedWorkouts < 2) {
        return null;
    }

    return (
        <>
            <ThemedPressable ghost style={styles.wrapper} onPress={open}>
                <HStack ghost style={styles.optionStack}>
                    <ThemedMaterialCommunityIcons ghost name={SortIconMap[currentSorting]} size={20} />
                    <Text ghost style={styles.title}>
                        {t("workout_sorting_label")}
                        {sortingLabel}
                    </Text>
                </HStack>
            </ThemedPressable>
            <ThemedButtomSheetModal title={t("workout_sorting_modal_title")} ref={ref} snapPoints={["50%"]}>
                <ThemedView ghost style={styles.optionWrapper}>
                    {mappedSorting.map(({ value, label, handleSelect }) => (
                        <ThemedPressable key={value} onPress={handleSelect} style={styles.option}>
                            <HStack style={styles.optionStack}>
                                <ThemedMaterialCommunityIcons name={SortIconMap[value]} size={20} />
                                <Text ghost style={styles.optionText}>
                                    {label}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                    ))}
                </ThemedView>
            </ThemedButtomSheetModal>
        </>
    );
};
