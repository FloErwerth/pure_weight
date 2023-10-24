import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../theme/context";

export const SafeAreaView = (props: ViewProps) => {
  const { backgroundColor } = useTheme();
  const insets = useSafeAreaInsets();

  return <View {...props} style={[props.style, { flex: 1, backgroundColor, paddingLeft: insets.left, paddingTop: insets.top, paddingRight: insets.right }]} />;
};
