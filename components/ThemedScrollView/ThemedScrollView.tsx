import { ScrollView, ScrollViewProps } from "react-native";
import { textFieldBackgroundColor } from "../../app/theme/colors";
import { borderRadius } from "../../app/theme/border";

export const ThemedScrollView = (props: ScrollViewProps) => {
  return <ScrollView {...props} style={[{ backgroundColor: textFieldBackgroundColor, borderRadius }, props.style]} />;
};
