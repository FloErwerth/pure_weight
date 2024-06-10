import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { useCallback, useMemo } from "react";
import { setUnitSystem } from "../../../../../../store/reducers/settings";

import { getUnitSystem } from "../../../../../../store/selectors/settings/settingsSelectors";
import { Icon, SelectableSetting } from "../../../SelectableSetting/SelectableSetting";
import { UnitSystem } from "../../../../../../store/reducers/settings/types";
import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { selectionStyles } from "../../selectionStyles";
import { SettingsNavigator } from "../../../SettingsNavigator/SettingsNavigator";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { PageContent } from "../../../../../PageContent/PageContent";
import { useTypedTranslation } from "../../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

const kgIcon: Icon = {
    name: "weight-kilogram",
    size: 24,
};
const poundIcon: Icon = {
    name: "weight-pound",
    size: 24,
};

export const UnitSystemSection = () => {
    const { t } = useTypedTranslation();
    const dispatch = useAppDispatch();
    const unitSystem = useAppSelector(getUnitSystem);
    const { ref, openBottomSheet } = useBottomSheetRef();

    const handleSelectWeightUnit = useCallback(
        (unit: UnitSystem) => {
            dispatch(setUnitSystem(unit));
        },
        [dispatch],
    );

    const unitSystemContent = useMemo(
        () => ({
            title: t(TranslationKeys.SETTINGS_UNIT_SYSTEM_TITLE),
            text: t(TranslationKeys.SETTINGS_UNIT_SYSTEM_HELPTEXT_TEXT),
        }),
        [t],
    );

    const unitSystemTitle = useMemo(() => t(TranslationKeys.SETTINGS_UNIT_SYSTEM_TITLE), [t]);
    const handleSelectMetric = useCallback(() => handleSelectWeightUnit("metric"), [handleSelectWeightUnit]);
    const handleSelectImperial = useCallback(() => handleSelectWeightUnit("imperial"), [handleSelectWeightUnit]);

    return (
        <>
            <SettingsNavigator onPress={openBottomSheet} title={unitSystemTitle} content={unitSystemContent}></SettingsNavigator>
            <ThemedBottomSheetModal title={unitSystemTitle} ref={ref}>
                <PageContent ghost paddingTop={20}>
                    <ThemedView ghost style={selectionStyles.vStack}>
                        <SelectableSetting prependedExtraContent={kgIcon} selected={unitSystem === "metric"} onSelect={handleSelectMetric} titleKey={TranslationKeys.UNIT_SYSTEM_METRIC} />
                        <SelectableSetting prependedExtraContent={poundIcon} selected={unitSystem === "imperial"} onSelect={handleSelectImperial} titleKey={TranslationKeys.UNIT_SYSTEM_IMPERIAL} />
                    </ThemedView>
                </PageContent>
            </ThemedBottomSheetModal>
        </>
    );
};
