import { View } from "react-native";
import { HStack } from "../../../Stack/HStack/HStack";
import { Text } from "../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../store";
import { getTimeUnit, getWeightUnit } from "../../../../store/reducers/settings/settingsSelectors";
import { styles } from "./styles";

interface TrainingHeaderProps {
    showPlaceholderForDoneButton?: boolean;
    exerciseType?: "WEIGHT_BASED" | "TIME_BASED";
}
export const TrainingHeader = ({ showPlaceholderForDoneButton = true, exerciseType = "WEIGHT_BASED" }: TrainingHeaderProps) => {
    const { t } = useTranslation();
    const weightUnit = useAppSelector(getWeightUnit);
    const timeUnit = useAppSelector(getTimeUnit);

    const leftHeader = exerciseType === "WEIGHT_BASED" ? weightUnit : timeUnit.minutesUnit;
    const rightHeader = exerciseType === "WEIGHT_BASED" ? t("training_header_reps") : timeUnit.secondsUnit;

    return (
        <HStack style={styles.vStack}>
            <Text placeholder style={styles.number}>
                #
            </Text>
            <HStack stretch ghost gap>
                {exerciseType === "WEIGHT_BASED" ? (
                    <>
                        <Text placeholder style={styles.input}>
                            {leftHeader}
                        </Text>
                        <Text placeholder style={styles.input}>
                            {rightHeader}
                        </Text>
                    </>
                ) : (
                    <Text placeholder style={styles.input}>
                        {t("duration")}
                    </Text>
                )}
                {showPlaceholderForDoneButton && <View style={styles.placeholder}></View>}
            </HStack>
        </HStack>
    );
};
