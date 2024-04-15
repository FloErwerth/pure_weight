import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { selectionStyles } from "../../selectionStyles";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { getKeepAwake } from "../../../../../../store/selectors/settings/settingsSelectors";
import { setKeepAwake } from "../../../../../../store/reducers/settings";
import { useTranslation } from "react-i18next";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { SnapPoint } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";

export const KeepAwakeSelection = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const awake = useAppSelector(getKeepAwake);
    const handleSelectAwake = useCallback(
        (awake: boolean) => {
            dispatch(setKeepAwake(awake));
        },
        [dispatch],
    );

    const helpText = useMemo(
        () =>
            ({
                title: t("settings_keep_awake"),
                text: t("settings_keep_awake_helptext_text"),
                snapPoints: ["35%"] as SnapPoint[],
            }) as const,
        [t],
    );

    const awakeLabel = useMemo(() => t("settings_keep_awake"), [t]);

    return (
        <ThemedView round style={selectionStyles.vStack}>
            <CheckBox ghost helpTextConfig={helpText} label={awakeLabel} size={26} checked={awake} onChecked={(awake) => handleSelectAwake(awake)} />
        </ThemedView>
    );
};
