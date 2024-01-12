import { View } from "react-native";
import { HStack } from "../../../../Stack/HStack/HStack";
import { Text } from "../../../../Themed/ThemedText/Text";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";

interface TrainingHeaderProps {
    showPlaceholderForDoneButton?: boolean;
}
export const TimeBasedTrainingHeader = ({ showPlaceholderForDoneButton = true }: TrainingHeaderProps) => {
    const { t } = useTranslation();
    return (
        <HStack style={styles.vStack}>
            <Text placeholder style={styles.number}>
                #
            </Text>
            <HStack stretch>
                <Text placeholder style={styles.durationInput}>
                    {t("duration")}
                </Text>
                {showPlaceholderForDoneButton && <View style={styles.placeholder}></View>}
            </HStack>
        </HStack>
    );
};
