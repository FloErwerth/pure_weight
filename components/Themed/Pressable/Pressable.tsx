import { useTheme } from "../../../theme/context";
import { Pressable, StyleProp, ViewStyle } from "react-native";
import { ComponentProps, useMemo } from "react";

interface ThemedPressableProps extends ComponentProps<typeof Pressable> {
  secondary?: boolean;
  ghost?: boolean;
  style?: StyleProp<ViewStyle>;
  stretch?: boolean;
}
export const ThemedPressable = (props: ThemedPressableProps) => {
  const { componentBackgroundColor, secondaryBackgroundColor } = useTheme();

  const computedBackgroundColor = useMemo(() => {
    if (props.secondary) {
      return secondaryBackgroundColor;
    }
    if (props.ghost) {
      return "transparent";
    }
    return componentBackgroundColor;
  }, [componentBackgroundColor, props.ghost, props.secondary, secondaryBackgroundColor]);

  const style = useMemo(() => [{ flex: props.stretch ? 1 : 0, backgroundColor: computedBackgroundColor }, props.style], [computedBackgroundColor, props.style]);

  return <Pressable {...props} style={style}></Pressable>;
};
