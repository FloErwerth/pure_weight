import { useTheme } from "../../../theme/context";
import { Pressable, StyleProp, View, ViewStyle } from "react-native";
import { ComponentProps, RefObject, useMemo } from "react";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

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

  const style = useMemo(
    () => [{ flex: props.stretch ? 1 : 0, backgroundColor: computedBackgroundColor, borderColor: props.error ? errorColor : "transparent", borderWidth: 1 }, props.style],
    [computedBackgroundColor, errorColor, props.error, props.stretch, props.style],
  );

  return <Pressable ref={props.reference} {...props} style={style}></Pressable>;
};
