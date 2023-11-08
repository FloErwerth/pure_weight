import { styles } from "./styles";
import { useMemo } from "react";
import { ThemedView, ThemedViewProps } from "../Themed/ThemedView/View";
import { useTheme } from "../../theme/context";

interface HStackProps extends ThemedViewProps {
  background?: boolean;
}
export function HStack(props: HStackProps) {
  const { componentBackgroundColor, secondaryBackgroundColor, backgroundColor, inputFieldBackgroundColor } = useTheme();

  const computedBackgroundColor = useMemo(() => {
    if (props.component) {
      return componentBackgroundColor;
    }
    if (props.background) {
      return backgroundColor;
    }
    if (props.secondary) {
      return secondaryBackgroundColor;
    }
    if (props.input) {
      return inputFieldBackgroundColor;
    }
    return "transparent";
  }, [backgroundColor, componentBackgroundColor, inputFieldBackgroundColor, props.background, props.component, props.input, props.secondary, secondaryBackgroundColor]);

  const style = useMemo(() => [styles.innerWrapper, { backgroundColor: computedBackgroundColor }], [computedBackgroundColor]);

  return (
    <ThemedView {...props} style={[style, props.style]}>
      {props.children}
    </ThemedView>
  );
}
