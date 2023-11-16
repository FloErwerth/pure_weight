import { useTheme } from "../../../theme/context";
import { GestureResponderEvent, Pressable, StyleProp, View, ViewStyle } from "react-native";
import { ComponentProps, RefObject, useCallback, useMemo } from "react";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import * as ExpoHaptics from "expo-haptics";

interface ThemedPressableProps extends ComponentProps<typeof Pressable> {
  secondary?: boolean;
  ghost?: boolean;
  style?: StyleProp<ViewStyle>;
  stretch?: boolean;
  input?: boolean;
  reference?: RefObject<View>;
  error?: boolean;
}
export const ThemedPressable = (props: ThemedPressableProps) => {
  const { errorColor } = useTheme();
  const computedBackgroundColor = useComputedBackgroundColor(props);

  const handlePress = useCallback(
    (e: GestureResponderEvent) => {
      props.onPress?.(e);
      void ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Medium);
    },
    [props],
  );

  const style = useMemo(
    () => [{ flex: props.stretch ? 1 : 0, backgroundColor: computedBackgroundColor, borderColor: props.error ? errorColor : "transparent", borderWidth: 1 }, props.style],
    [computedBackgroundColor, errorColor, props.error, props.stretch, props.style],
  );

  return <Pressable ref={props.reference} {...props} onPress={handlePress} style={style}></Pressable>;
};
