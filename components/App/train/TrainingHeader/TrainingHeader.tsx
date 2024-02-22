import { View } from "react-native";
import { HStack } from "../../../Stack/HStack/HStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store";
import { getWeightUnit } from "../../../../store/reducers/settings/settingsSelectors";
import { styles } from "./styles";

interface TrainingHeaderProps {
    showPlaceholderForDoneButton?: boolean;
    exerciseType?: "WEIGHT_BASED" | "TIME_BASED";
    showWeight?: boolean;
}
export const TrainingHeader = ({ showPlaceholderForDoneButton = true, exerciseType = "WEIGHT_BASED", showWeight }: TrainingHeaderProps) => {
    const { t } = useTranslation();
    const weightUnit = useAppSelector(getWeightUnit);

    const timeBasedHasWeight = Boolean(exerciseType === "TIME_BASED" && showWeight);
    const leftHeader = exerciseType === "WEIGHT_BASED" ? t("training_header_reps") : t("duration");
    const rightHeader = exerciseType === "WEIGHT_BASED" || timeBasedHasWeight ? weightUnit : undefined;

    return (
        <HStack style={styles.vStack}>
            <Text placeholder style={styles.number}>
                #
            </Text>
            <HStack stretch ghost center style={{ gap: 15 }}>
                <Text ghost style={styles.input}>
                    {leftHeader}
                </Text>
                {rightHeader && (
                    <Text ghost style={styles.input}>
                        {rightHeader}
                    </Text>
                )}
                {showPlaceholderForDoneButton && <View style={styles.placeholder}></View>}
            </HStack>
        </HStack>
    );
};
