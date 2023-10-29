import { Text as _Text, TextProps } from "react-native";
import { useTheme } from "../../../theme/context";

export const Text = (props: TextProps) => {
  const { mainColor, textDisabled } = useTheme();
  return <_Text {...props} style={[{ color: props.disabled ? textDisabled : mainColor }, props.style]} />;
};
