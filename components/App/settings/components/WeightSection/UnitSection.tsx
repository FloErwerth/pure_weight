import { styles } from "./styles";
import { ProfileContent } from "../SettingsSection/ProfileSection";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { useCallback } from "react";
import { setWeightUnit } from "../../../../../store/reducers/settings";

import { getUnitSystem } from "../../../../../store/reducers/settings/settingsSelectors";
import { Icon, SelectableSetting } from "../../SelectableSetting/SelectableSetting";
import { UnitSystem } from "../../../../../store/reducers/settings/types";
import { ThemedView } from "../../../../Themed/ThemedView/View";

const kgIcon: Icon = {
    name: "weight-kilogram",
    size: 24,
};
const poundIcon: Icon = {
    name: "weight-pound",
    size: 24,
};

export const UnitSection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const unitSystem = useAppSelector(getUnitSystem);

    const handleSelectWeightUnit = useCallback(
        (unit: UnitSystem) => {
            dispatch(setWeightUnit(unit));
        },
        [dispatch],
    );

    return (
        <ProfileContent title={t("settings_unit_system_title")}>
            <ThemedView style={styles.vStack}>
                <SelectableSetting icon={kgIcon} selected={unitSystem === "metric"} onSelect={() => handleSelectWeightUnit("metric")} titleKey="unit_system_metric" />
                <SelectableSetting icon={poundIcon} selected={unitSystem === "imperial"} onSelect={() => handleSelectWeightUnit("imperial")} titleKey="unit_system_imperial" />
            </ThemedView>
        </ProfileContent>
    );
};
