import { ProfileContent } from "../../SettingsSection/SettingsNavigator";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { HStack } from "../../../../../Stack/HStack/HStack";
import { VStack } from "../../../../../Stack/VStack/VStack";
import { useCallback } from "react";
import { setNumberMeasurementEntries } from "../../../../../../store/reducers/settings";
import { getNumberMeasurementEntries } from "../../../../../../store/reducers/settings/settingsSelectors";

export const MeasurementsHistoryEntrySelection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const numberMeasurementEntries = useAppSelector(getNumberMeasurementEntries);

    const handleSelect10Enries = useCallback(() => {
        dispatch(setNumberMeasurementEntries("10"));
    }, [dispatch]);
    const handleSelect25Enries = useCallback(() => {
        dispatch(setNumberMeasurementEntries("25"));
    }, [dispatch]);
    const handleSelect100Enries = useCallback(() => {
        dispatch(setNumberMeasurementEntries("100"));
    }, [dispatch]);
    const handleSelectAllEnries = useCallback(() => {
        dispatch(setNumberMeasurementEntries("ALL"));
    }, [dispatch]);

    return (
        <ProfileContent title={t("measurement")}>
            <VStack style={{ gap: 5 }}>
                <HStack style={{ gap: 5 }}>
                    <SelectableSetting stretch titleKey="10" onSelect={handleSelect10Enries} selected={numberMeasurementEntries === "10"} />
                    <SelectableSetting stretch titleKey="25" onSelect={handleSelect25Enries} selected={numberMeasurementEntries === "25"} />
                    <SelectableSetting stretch titleKey="100" onSelect={handleSelect100Enries} selected={numberMeasurementEntries === "100"} />
                </HStack>
                <SelectableSetting titleKey={"settings_measurement_history_all"} onSelect={handleSelectAllEnries} selected={numberMeasurementEntries === "ALL"} />
            </VStack>
        </ProfileContent>
    );
};
