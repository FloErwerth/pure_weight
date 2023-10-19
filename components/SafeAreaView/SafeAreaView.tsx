import { ViewProps } from "react-native";
import { backgroundColor } from "../App/theme/colors";
import { SafeAreaView as SAV } from "react-native-safe-area-context";

export const SafeAreaView = (props: ViewProps) => {
  return <SAV {...props} style={[props.style, { flex: 1, backgroundColor: backgroundColor }]} />;
};
