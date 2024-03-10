import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback } from "react";
import { setUnitSystem } from "../../../../../../store/reducers/settings";

import { getUnitSystem } from "../../../../../../store/selectors/settings/settingsSelectors";
import { Icon, SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { UnitSystem } from "../../../../../../store/reducers/settings/types";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { selectionStyles } from "../../selectionStyles";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { PageContent } from "../../../../../PageContent/PageContent";

const kgIcon: Icon = {
    name: "weight-kilogram",
    size: 24,
};
const poundIcon: Icon = {
    name: "weight-pound",
    size: 24,
};

export const UnitSystemSection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const unitSystem = useAppSelector(getUnitSystem);
    const { ref, openBottomSheet } = useBottomSheetRef();

    const handleSelectWeightUnit = useCallback(
        (unit: UnitSystem) => {
            dispatch(setUnitSystem(unit));
        },
        [dispatch],
    );

    return (
        <>
            <SettingsNavigator
                onPress={openBottomSheet}
                title={t("settings_unit_system_title")}
                helpText={{
                    title: t("settings_unit_system_title"),
                    text: t("settings_unit_system_helptext_text"),
                }}></SettingsNavigator>
            <ThemedBottomSheetModal title={t("settings_unit_system_title")} ref={ref}>
                <PageContent ghost paddingTop={20}>
                    <ThemedView ghost style={selectionStyles.vStack}>
                        <SelectableSetting
                            prependedExtraContent={kgIcon}
                            selected={unitSystem === "metric"}
                            onSelect={() => handleSelectWeightUnit("metric")}
                            titleKey="unit_system_metric"
                        />
                        <SelectableSetting
                            prependedExtraContent={poundIcon}
                            selected={unitSystem === "imperial"}
                            onSelect={() => handleSelectWeightUnit("imperial")}
                            titleKey="unit_system_imperial"
                        />
                    </ThemedView>
                </PageContent>
            </ThemedBottomSheetModal>
        </>
    );
};
