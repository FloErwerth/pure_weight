import { Dimensions, StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    borderRadius,
    padding: 20,
    position: "absolute",
    zIndex: 20,
    width: Dimensions.get("screen").width,
  },
});
