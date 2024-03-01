import React from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { Text } from "../Themed/ThemedText/Text";
import { PostWorkoutScreen } from "../../store/reducers/workout/types";

type WorkoutCompleteStatTileProps = PostWorkoutScreen["stats"][number];
export const WorkoutCompleteStatTile = ({ icon, unit, value, text, iconColor }: WorkoutCompleteStatTileProps) => {
    return (
        <ThemedView stretch style={{ alignSelf: "stretch", padding: 5, paddingBottom: 8 }} round input>
            <HStack center style={{ marginBottom: 5, justifyContent: "space-between" }} ghost>
                <ThemedMaterialCommunityIcons ghost name={icon} size={20} color={iconColor} />
                <HStack ghost style={{ gap: 3 }}>
                    <Text ghost style={{ fontSize: 26 }}>
                        {value}
                    </Text>
                    <Text ghost style={{ fontSize: 20, alignSelf: "flex-end", marginBottom: 2 }}>
                        {unit}
                    </Text>
                </HStack>
            </HStack>
            <Text style={{ fontSize: 12 }} ghost>
                {text}
            </Text>
        </ThemedView>
    );
};
