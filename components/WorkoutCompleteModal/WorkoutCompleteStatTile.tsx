import React from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../Themed/ThemedText/Text";
import { PostWorkoutScreen } from "../../store/reducers/workout/types";
import { styles } from "./styles";

type WorkoutCompleteStatTileProps = PostWorkoutScreen["stats"][number];
export const WorkoutCompleteStatTile = ({ icon, unit, value, text, iconColor }: WorkoutCompleteStatTileProps) => {
    return (
        <ThemedView stretch style={styles.wrapper} round background>
            <HStack center style={styles.innerWrapper} ghost>
                <ThemedMaterialCommunityIcons ghost name={icon} size={20} color={iconColor} />
                <HStack ghost style={styles.smallGap}>
                    <Text ghost style={styles.text}>
                        {value}
                    </Text>
                    <Text ghost style={styles.unitText}>
                        {unit}
                    </Text>
                </HStack>
            </HStack>
            <Text style={styles.smallText} ghost>
                {text}
            </Text>
        </ThemedView>
    );
};
