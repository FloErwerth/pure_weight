import { View } from "react-native";
import { HStack } from "../../../Stack/HStack/HStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { useAppSelector } from "../../../../store";
import { getWeightUnit } from "../../../../store/selectors/settings/settingsSelectors";
import { styles } from "./styles";
import { useTypedTranslation } from "../../../../locales/i18next";
import { TranslationKeys } from "../../../../locales/translationKeys";

interface TrainingHeaderProps {
    showPlaceholderForDoneButton?: boolean;
    exerciseType?: "WEIGHT_BASED" | "TIME_BASED";
    showWeight?: boolean;
}

export const TrainingHeader = ({ showPlaceholderForDoneButton = true, exerciseType = "WEIGHT_BASED", showWeight }: TrainingHeaderProps) => {
    const { t } = useTypedTranslation();
    const weightUnit = useAppSelector(getWeightUnit);

    const leftLabel = exerciseType === "WEIGHT_BASED" ? weightUnit : t(TranslationKeys.DURATION);
    const rightLabel = exerciseType === "WEIGHT_BASED" ? t(TranslationKeys.TRAINING_HEADER_REPS) : showWeight ? weightUnit : undefined;

    return (
        <HStack style={styles.vStack}>
            <Text placeholder style={styles.number}>
                #
            </Text>
            <HStack stretch ghost center style={styles.gap}>
                <Text ghost style={styles.input}>
                    {leftLabel}
                </Text>
                {rightLabel && (
                    <Text ghost style={styles.input}>
                        {rightLabel}
                    </Text>
                )}
                {showPlaceholderForDoneButton && <View style={styles.placeholder}></View>}
            </HStack>
        </HStack>
    );
};
