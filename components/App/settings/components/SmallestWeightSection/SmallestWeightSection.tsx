import { styles } from "./styles";
import { ProfileContent } from "../SettingsSection/ProfileSection";
import { useTranslation } from "react-i18next";
import { useAppDispatch, useAppSelector } from "../../../../../store";
import { useCallback } from "react";
import { setSmallestWeight } from "../../../../../store/reducers/settings";

import { getSmallestWeight, getUnitSystem, getWeightUnit } from "../../../../../store/reducers/settings/settingsSelectors";
import { SelectableSetting } from "../../SelectableSetting/SelectableSetting";
import { ThemedView } from "../../../../Themed/ThemedView/View";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../../../../BottomSheetModal/ThemedBottomSheetModal";

const useSmallestWeightArray = () => {
    const unitSystem = useAppSelector(getUnitSystem);
    if (unitSystem === "metric") {
        return ["1.25", "2.5", "5"];
    }
    return ["2.5", "5", "10"];
};

const unfoldIcon = { name: "unfold-more-horizontal", size: 24 } as const;
const usePrependedIcon = () => {
    const unitSystem = useAppSelector(getUnitSystem);
    if (unitSystem === "metric") {
        return {
            name: "weight-kilogram",
            size: 24,
        } as const;
    }

    return {
        name: "weight-pound",
        size: 24,
    } as const;
};

export const SmallestWeightSection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const smallestWeight = useAppSelector(getSmallestWeight);
    const unit = useAppSelector(getWeightUnit);
    const [ref, open, close] = useBottomSheetRef();

    const handleSelectWeightUnit = useCallback(
        (weight: string) => {
            dispatch(setSmallestWeight(weight));
        },
        [dispatch],
    );

    const smallestWeightArray = useSmallestWeightArray();

    return (
        <ProfileContent title={t("settings_smallest_weight_title")}>
            <ThemedView style={styles.vStack}>
                <SelectableSetting appendedExtraContent={unfoldIcon} selected={false} onSelect={open} titleKey={smallestWeight.concat(" ", unit)} />
                <ThemedBottomSheetModal ref={ref}>
                    <ThemedView ghost style={{ margin: 10, gap: 10 }}>
                        {smallestWeightArray.map((weight) => (
                            <SelectableSetting key={weight} selected={smallestWeight === weight} onSelect={() => handleSelectWeightUnit(weight)} titleKey={weight.toString().concat(" ", unit)} />
                        ))}
                    </ThemedView>
                </ThemedBottomSheetModal>
            </ThemedView>
        </ProfileContent>
    );
};
