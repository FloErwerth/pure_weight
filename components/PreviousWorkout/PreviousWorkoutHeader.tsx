import { HStack } from "../Stack/HStack/HStack";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { ThemedView } from "../Themed/ThemedView/View";
import { ExerciseType } from "../../store/reducers/workout/types";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../store";
import { getWeightUnit } from "../../store/reducers/settings/settingsSelectors";

export const PreviousWorkoutHeader = ({ exerciseType }: { exerciseType: ExerciseType }) => {
    const { t } = useTranslation();
    const weightUnit = useAppSelector(getWeightUnit);
    if (exerciseType === "TIME_BASED") {
        return (
            <HStack key={Math.random() * 102} style={styles.innerWrapperHeader}>
                <Text ghost style={styles.numberHeader}>
                    #
                </Text>
                <Text stretch ghost style={styles.set}>
                    {t("duration")}
                </Text>
            </HStack>
        );
    }

    return (
        <HStack stretch key={Math.random() * 102} style={styles.innerWrapperHeader}>
            <Text ghost style={styles.numberHeader}>
                #
            </Text>
            <HStack ghost stretch style={styles.setOuterWrapper}>
                <ThemedView ghost round stretch style={styles.setWrapper}>
                    <Text ghost style={styles.set}>
                        {weightUnit}
                    </Text>
                </ThemedView>
                <ThemedView style={styles.setWrapper} ghost round stretch>
                    <Text ghost style={styles.set}>
                        {t("reps_lower")}
                    </Text>
                </ThemedView>
            </HStack>
        </HStack>
    );
};
