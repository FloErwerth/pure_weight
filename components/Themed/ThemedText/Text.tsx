import { Text as _Text, TextProps } from "react-native";
import { useTheme } from "../../../theme/context";
import { useMemo } from "react";

interface ThemedTextProps extends TextProps {
  stretch?: boolean;
  warning?: boolean;
}
export const Text = (props: ThemedTextProps) => {
  const { mainColor, textDisabled, warningColor } = useTheme();

  const computedColor = useMemo(() => {
    if (props.disabled) {
      return textDisabled;
    }
    if (props.warning) {
      return warningColor;
    }
    return mainColor;
  }, [mainColor, props.disabled, props.warning, textDisabled, warningColor]);

  const styles = useMemo(() => [{ flex: props.stretch ? 1 : 0, color: computedColor }, props.style], [computedColor, props.stretch, props.style]);

  return <_Text {...props} style={styles} />;
};
