import { ThemedView } from "../../../../../Themed/ThemedView/View";
import { selectionStyles } from "../../selectionStyles";
import { useCallback, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../../../store";
import { getKeepAwake } from "../../../../../../store/selectors/settings/settingsSelectors";
import { setKeepAwake } from "../../../../../../store/reducers/settings";
import { CheckBox } from "../../../../../Themed/CheckBox/CheckBox";
import { SnapPoint } from "../../../../../BottomSheetModal/ThemedBottomSheetModal";
import { useTypedTranslation } from "../../../../../../locales/i18next";
import { TranslationKeys } from "../../../../../../locales/translationKeys";

export const KeepAwakeSelection = () => {
    const { t } = useTypedTranslation();
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
                title: t(TranslationKeys.SETTINGS_KEEP_AWAKE),
                text: t(TranslationKeys.SETTINGS_KEEP_AWAKE_HELPTEXT_TEXT),
                snapPoints: ["35%"] as SnapPoint[],
            }) as const,
        [t],
    );

    return (
        <ThemedView round style={selectionStyles.vStack}>
            <CheckBox ghost helpTextConfig={helpText} label={helpText.title} size={26} checked={awake} onChecked={(awake) => handleSelectAwake(awake)} />
        </ThemedView>
    );
};
