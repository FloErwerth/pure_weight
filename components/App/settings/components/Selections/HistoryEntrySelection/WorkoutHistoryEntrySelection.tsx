import { ProfileContent } from "../../SettingsSection/SettingsNavigator";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { HStack } from "../../../../../Stack/HStack/HStack";
import { VStack } from "../../../../../Stack/VStack/VStack";
import { useCallback } from "react";
import { setNumberWorkoutEntries } from "../../../../../../store/reducers/settings";
import { getNumberWorkoutEntries } from "../../../../../../store/reducers/settings/settingsSelectors";

export const WorkoutHistoryEntrySelection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const numberWorkoutEntries = useAppSelector(getNumberWorkoutEntries);

    const handleSelect10Enries = useCallback(() => {
        dispatch(setNumberWorkoutEntries("10"));
    }, [dispatch]);
    const handleSelect25Enries = useCallback(() => {
        dispatch(setNumberWorkoutEntries("25"));
    }, [dispatch]);
    const handleSelect100Enries = useCallback(() => {
        dispatch(setNumberWorkoutEntries("100"));
    }, [dispatch]);
    const handleSelectAllEnries = useCallback(() => {
        dispatch(setNumberWorkoutEntries("ALL"));
    }, [dispatch]);

    return (
        <ProfileContent title={t("workout")}>
            <VStack style={{ gap: 5 }}>
                <HStack style={{ gap: 5 }}>
                    <SelectableSetting stretch titleKey="10" onSelect={handleSelect10Enries} selected={numberWorkoutEntries === "10"} />
                    <SelectableSetting stretch titleKey="25" onSelect={handleSelect25Enries} selected={numberWorkoutEntries === "25"} />
                    <SelectableSetting stretch titleKey="100" onSelect={handleSelect100Enries} selected={numberWorkoutEntries === "100"} />
                </HStack>
                <SelectableSetting titleKey={"settings_workout_history_all"} onSelect={handleSelectAllEnries} selected={numberWorkoutEntries === "ALL"} />
            </VStack>
        </ProfileContent>
    );
};
