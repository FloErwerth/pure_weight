import { Text as _Text, TextProps } from "react-native";
import { mainDisabledColor } from "../App/theme/colors";
import { useTheme } from "@react-navigation/native";

export const Text = (props: TextProps) => {
  const {
    colors: { text },
  } = useTheme();
  return <_Text style={[props.style, { color: props.disabled ? mainDisabledColor : text }]} {...props} />;
};
