import { ScrollView, ScrollViewProps } from "react-native";
import { borderRadius } from "../../../theme/border";
import { useTheme } from "../../../theme/context";

export const ThemedScrollView = (props: ScrollViewProps) => {
  const { backgroundColor } = useTheme();
  return <ScrollView {...props} style={[{ backgroundColor, borderRadius }, props.style]} />;
};
