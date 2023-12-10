import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { Text } from "../Themed/ThemedText/Text";
import { styles } from "./styles";
import { useAppSelector } from "../../store";
import { ComponentProps, RefObject } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { getNumberSavedWorkouts } from "../../store/reducers/workout/workoutSelectors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

type SortingButtonProps = {
    iconName: ComponentProps<typeof MaterialCommunityIcons>["name"];
    title: string;
    bottomSheetTitle: string;
    sheetRef: RefObject<BottomSheetModalMethods>;
    mappedOptions: Array<{ iconName: ComponentProps<typeof MaterialCommunityIcons>["name"]; value: string; label: string; handleSelect: () => void }>;
};
export const SortingButton = ({ sheetRef, iconName, title, bottomSheetTitle, mappedOptions }: SortingButtonProps) => {
    const numberSavedWorkouts = useAppSelector(getNumberSavedWorkouts);

    if (numberSavedWorkouts < 2) {
        return null;
    }

    return (
        <>
            <ThemedPressable ghost style={styles.wrapper} onPress={sheetRef.current?.present}>
                <HStack ghost style={styles.optionStack}>
                    <ThemedMaterialCommunityIcons ghost name={iconName} size={20} />
                    <Text ghost style={styles.title}>
                        {title}
                    </Text>
                </HStack>
            </ThemedPressable>
            <ThemedBottomSheetModal title={bottomSheetTitle} ref={sheetRef} snapPoints={["50%"]}>
                <ThemedView ghost style={styles.optionWrapper}>
                    {mappedOptions.map(({ iconName, value, label, handleSelect }) => (
                        <ThemedPressable key={value} onPress={handleSelect} style={styles.option}>
                            <HStack style={styles.optionStack}>
                                <ThemedMaterialCommunityIcons name={iconName} size={20} />
                                <Text ghost style={styles.optionText}>
                                    {label}
                                </Text>
                            </HStack>
                        </ThemedPressable>
                    ))}
                </ThemedView>
            </ThemedBottomSheetModal>
        </>
    );
};
