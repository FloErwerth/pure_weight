import { View } from "react-native";
import { HStack } from "../../../../Stack/HStack/HStack";
import { Text } from "../../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../../../store";
import { getWeightUnit } from "../../../../../store/reducers/settings/settingsSelectors";
import { styles } from "../styles";

interface TrainingHeaderProps {
    showPlaceholderForDoneButton?: boolean;
}
export const WeightBasedTrainingHeader = ({ showPlaceholderForDoneButton = true }: TrainingHeaderProps) => {
    const { t } = useTranslation();
    const weightUnit = useAppSelector(getWeightUnit);
    return (
        <HStack style={styles.vStack}>
            <Text placeholder style={styles.number}>
                #
            </Text>
            <HStack style={styles.inputStack}>
                <Text placeholder style={styles.input}>
                    {weightUnit}
                </Text>
                <Text placeholder style={styles.input}>
                    {t("training_header_reps")}
                </Text>
                {showPlaceholderForDoneButton && <View style={styles.placeholder}></View>}
            </HStack>
        </HStack>
    );
};
