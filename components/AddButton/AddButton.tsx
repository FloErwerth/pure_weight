import { styles } from "./styles";
import { View } from "react-native";
import { ComponentProps, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { AppState, useAppDispatch, useAppSelector } from "../../store";
import { useTheme } from "../../theme/context";
import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { cleanError } from "../../store/reducers/errors";
import { getErrorByKey } from "../../store/reducers/errors/errorSelectors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HStack } from "../Stack/HStack/HStack";
import { ThemedMaterialCommunityIcons } from "../Themed/ThemedMaterialCommunityIcons/ThemedMaterialCommunityIcons";
import { ErrorFields } from "../../store/reducers/errors/errorFields";
import { ErrorText } from "../ErrorText/ErrorText";
import { Text } from "../Themed/ThemedText/Text";

interface AddExerciseProps {
    onPress?: () => void;
    title?: string;
    disabled?: boolean;
    errorKey?: ErrorFields;
    icon?: { name: ComponentProps<typeof MaterialCommunityIcons>["name"]; size: number };
}

export const AddButton = ({ errorKey, onPress, title, disabled = false, icon }: AddExerciseProps) => {
    const { textDisabled, mainColor } = useTheme();
    const { t } = useTranslation();
    const text = useMemo(() => title ?? t("add_exercise"), [title, t]);
    const textStyles = useMemo(() => ({ ...styles.text, color: disabled ? textDisabled : mainColor }), [disabled, mainColor, textDisabled]);
    const hasError = useAppSelector((state: AppState) => getErrorByKey(state, errorKey));
    const dispatch = useAppDispatch();

    const handlePress = useCallback(() => {
        if (hasError) {
            dispatch(cleanError(["create_exercises_empty"]));
        }
        onPress?.();
    }, [dispatch, hasError, onPress]);

    return (
        <View>
            {hasError && <ErrorText errorKey={errorKey} />}
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
