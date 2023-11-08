import { Text as _Text, TextProps } from "react-native";
import { useTheme } from "../../../theme/context";
import { useMemo } from "react";

interface ThemedTextProps extends TextProps {
  stretch?: boolean;
  warning?: boolean;
  secondary?: boolean;
  component?: boolean;
  error?: boolean;
  placeholder?: boolean;
}
export const Text = (props: ThemedTextProps) => {
  const { secondaryColor, secondaryErrorColor, errorColor, mainColor, textDisabled, warningColor, secondaryBackgroundColor, componentBackgroundColor } = useTheme();

  const computedBackgroundColor = useMemo(() => {
    if (props.secondary) {
      return secondaryBackgroundColor;
    }
    if (props.component) {
      return componentBackgroundColor;
    }

    return "transparent";
  }, [componentBackgroundColor, props.component, props.secondary, secondaryBackgroundColor]);

  const computedColor = useMemo(() => {
    if (props.error) {
      return errorColor;
    }
    if (props.disabled) {
      return textDisabled;
    }
    if (props.warning) {
      return warningColor;
    }
    if (props.placeholder) {
      return secondaryColor;
    }
    return mainColor;
  }, [errorColor, mainColor, props.disabled, props.error, props.placeholder, props.warning, secondaryColor, textDisabled, warningColor]);

  const styles = useMemo(
    () => [{ flex: props.stretch ? 1 : 0, color: computedColor, backgroundColor: computedBackgroundColor }, props.style],
    [computedBackgroundColor, computedColor, props.stretch, props.style],
  );

  return <_Text {...props} style={styles} />;
};
