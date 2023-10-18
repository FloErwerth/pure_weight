import { ScrollView, ScrollViewProps } from "react-native";
import { componentBackgroundColor } from "../../app/theme/colors";
import { borderRadius } from "../../app/theme/border";

export const ThemedScrollView = (props: ScrollViewProps) => {
  return <ScrollView {...props} style={[{ backgroundColor: componentBackgroundColor, borderRadius }, props.style]} />;
};
