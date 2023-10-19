import { ScrollView, ScrollViewProps } from "react-native";
import { componentBackgroundColor } from "../App/theme/colors";
import { borderRadius } from "../App/theme/border";

export const ThemedScrollView = (props: ScrollViewProps) => {
  return <ScrollView {...props} style={[{ backgroundColor: componentBackgroundColor, borderRadius }, props.style]} />;
};
