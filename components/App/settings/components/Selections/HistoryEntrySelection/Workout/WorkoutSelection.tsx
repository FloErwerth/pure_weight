import { HStack } from "../../../../../../Stack/HStack/HStack";
import { SelectableSetting } from "../../../../SelectableSetting/SelectableSetting";
import { VStack } from "../../../../../../Stack/VStack/VStack";
import { useAppDispatch, useAppSelector } from "../../../../../../../store";
import { getNumberWorkoutEntries } from "../../../../../../../store/reducers/settings/settingsSelectors";
import { useCallback } from "react";
import { setNumberWorkoutEntries } from "../../../../../../../store/reducers/settings";

type WorkoutSelectionProps = {
    insideModal?: boolean;
    onSelect?: () => void;
};

export const WorkoutSelection = ({ insideModal, onSelect }: WorkoutSelectionProps) => {
    const dispatch = useAppDispatch();
    const numberWorkoutEntries = useAppSelector(getNumberWorkoutEntries);
    const handleSelect10Enries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberWorkoutEntries("10"));
    }, [dispatch, onSelect]);

    const handleSelect25Enries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberWorkoutEntries("25"));
    }, [dispatch, onSelect]);

    const handleSelect100Enries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberWorkoutEntries("100"));
    }, [dispatch, onSelect]);

    const handleSelectAllEnries = useCallback(() => {
        onSelect?.();
        dispatch(setNumberWorkoutEntries("ALL"));
    }, [dispatch, onSelect]);

    return (
        <VStack ghost={insideModal} style={{ gap: 5, margin: insideModal ? 10 : 0 }}>
            <HStack ghost={insideModal} style={{ gap: 5 }}>
                <SelectableSetting stretch titleKey="10" onSelect={handleSelect10Enries} selected={numberWorkoutEntries === "10"} />
                <SelectableSetting stretch titleKey="25" onSelect={handleSelect25Enries} selected={numberWorkoutEntries === "25"} />
                <SelectableSetting stretch titleKey="100" onSelect={handleSelect100Enries} selected={numberWorkoutEntries === "100"} />
            </HStack>
            <SelectableSetting titleKey={"settings_workout_history_all"} onSelect={handleSelectAllEnries} selected={numberWorkoutEntries === "ALL"} />
        </VStack>
    );
};
