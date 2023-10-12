import { Text as _Text, TextProps } from "react-native";
import { mainColor, mainDisabledColor } from "../../app/theme/colors";

export const Text = (props: TextProps) => {
  return <_Text style={[props.style, { color: props.disabled ? mainDisabledColor : mainColor }]} {...props} />;
};
