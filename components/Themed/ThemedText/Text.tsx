import { Text as _Text, TextProps } from "react-native";
import { useMemo } from "react";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { useComputedColor } from "../../../hooks/useComputedColor";

interface ThemedTextProps extends TextProps {
  stretch?: boolean;
  warning?: boolean;
  secondary?: boolean;
  component?: boolean;
  error?: boolean;
  placeholder?: boolean;
}
export const Text = (props: ThemedTextProps) => {
  const computedBackgroundColor = useComputedBackgroundColor(props);
  const computedColor = useComputedColor(props);

  const styles = useMemo(
    () => [{ flex: props.stretch ? 1 : 0, color: computedColor, backgroundColor: computedBackgroundColor }, props.style],
    [computedBackgroundColor, computedColor, props.stretch, props.style],
  );

  return <_Text {...props} style={styles} />;
};
