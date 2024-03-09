import { styles } from "./styles";
import { View } from "react-native";
import { ComponentProps, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { cleanError } from "../../store/reducers/errors";
import { getErrorByKey } from "../../store/selectors/errors/errorSelectors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ErrorText } from "../ErrorText/ErrorText";
import { Text } from "../Themed/ThemedText/Text";

interface AddExerciseProps {
    onPress?: () => void;
    title?: string;
    disabled?: boolean;
    icon?: { name: ComponentProps<typeof MaterialCommunityIcons>["name"]; size: number };
}

export const AddButton = ({ onPress, title, disabled = false, icon }: AddExerciseProps) => {
    const { t } = useTranslation();
    const text = useMemo(() => title ?? t("add_exercise"), [title, t]);

    const hasError = useAppSelector((state: AppState) => getErrorByKey(state, "create_exercises_empty"));
    const dispatch = useAppDispatch();

    const handlePress = useCallback(() => {
        if (hasError) {
            dispatch(cleanError(["create_exercises_empty"]));
        }
        onPress?.();
    }, [dispatch, hasError, onPress]);

    return (
        <View>
            {hasError && <ErrorText errorKey="create_exercises_empty" />}
            <ThemedPressable disabled={disabled} style={styles.add} error={hasError} onPress={handlePress}>
                <HStack style={styles.stack}>
                    <Text error={hasError} ghost style={styles.text}>
                        {text}
                    </Text>
                    {icon && <ThemedMaterialCommunityIcons name={icon.name} size={icon.size} />}
                </HStack>
            </ThemedPressable>
        </View>
    );
};
