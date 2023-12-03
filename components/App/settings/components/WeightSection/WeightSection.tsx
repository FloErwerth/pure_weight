import { styles } from "./styles";
import { ProfileContent } from "../SettingsSection/ProfileSection";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { useCallback } from "react";
import { setWeightUnit } from "../../../../../store/reducers/settings";

import { getWeightUnit } from "../../../../../store/reducers/settings/settingsSelectors";
import { Icon, SelectableSetting } from "../../SelectableSetting/SelectableSetting";
import { WeightUnit } from "../../../../../store/reducers/settings/types";
import { ThemedView } from "../../../../Themed/ThemedView/View";

const kgIcon: Icon = {
    name: "weight-kilogram",
    size: 24,
};
const poundIcon: Icon = {
    name: "weight-pound",
    size: 24,
};

export const WeightSection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const weightUnit = useAppSelector(getWeightUnit);

    const handleSelectWeightUnit = useCallback(
        (unit: WeightUnit) => {
            dispatch(setWeightUnit(unit));
        },
        [dispatch],
    );

    return (
        <ProfileContent title={t("settings_weight_unit_title")}>
            <ThemedView style={styles.vStack}>
                <SelectableSetting icon={kgIcon} selected={weightUnit === "kg"} onSelect={() => handleSelectWeightUnit("kg")} titleKey="unit_weight_kg" />
                <SelectableSetting icon={poundIcon} selected={weightUnit === "lbs"} onSelect={() => handleSelectWeightUnit("lbs")} titleKey="unit_weight_pounds" />
            </ThemedView>
        </ProfileContent>
    );
};
