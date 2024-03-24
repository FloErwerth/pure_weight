import { useTheme } from "../../../theme/context";
import { GestureResponderEvent, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { ComponentProps, RefObject, useCallback, useMemo } from "react";
import {
    ComputedBackgroundColorProps,
    useComputedBackgroundColor,
} from "../../../hooks/useComputedBackgroundColor";
import * as ExpoHaptics from "expo-haptics";
import { borderRadius } from "../../../theme/border";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ThemedPressableProps
    extends ComponentProps<typeof Pressable>,
        ComputedBackgroundColorProps {
    style?: StyleProp<ViewStyle>;
    stretch?: boolean;
    reference?: RefObject<View>;
    error?: boolean;
    behind?: boolean;
    round?: boolean;
    padding?: boolean;
    center?: boolean;
    safeBottom?: boolean;
    hideBorder?: boolean;
    cta?: boolean;
}
export const ThemedPressable = (props: ThemedPressableProps) => {
    const { errorColor } = useTheme();
    const computedBackgroundColor = useComputedBackgroundColor(props);
    const { bottom } = useSafeAreaInsets();
    const handlePress = useCallback(
        (e: GestureResponderEvent) => {
            props.onPress?.(e);
            void ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
        },
        [props],
    );

    const style = useMemo(
        () => [
            {
                flex: props.stretch ? 1 : 0,
                alignSelf: "stretch",
                zIndex: props.behind ? -1 : 0,
                backgroundColor: computedBackgroundColor,
                borderColor: props.error ? errorColor : "transparent",
                borderWidth: props.hideBorder ? 0 : 1,
                padding: props.padding ? 10 : undefined,
                borderRadius: props.round ? borderRadius : undefined,
                alignItems: props.center ? "center" : undefined,
                marginBottom: props.safeBottom ? bottom : undefined,
            } as const,
            props.style,
        ],
        [
            bottom,
            computedBackgroundColor,
            errorColor,
            props.behind,
            props.center,
            props.error,
            props.hideBorder,
            props.padding,
            props.round,
            props.safeBottom,
            props.stretch,
            props.style,
        ],
    );

    return (
        <Pressable ref={props.reference} {...props} onPress={handlePress} style={style}></Pressable>
    );
};
