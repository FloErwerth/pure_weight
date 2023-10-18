import { StyleSheet } from "react-native";
import { mainColor, secondaryColor } from "../../../theme/colors";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  innerWrapper: {
    padding: 15,
    alignSelf: "stretch",
    justifyContent: "space-around",
    backgroundColor: "#343434",
    borderRadius,
    borderWidth: 1,
  },
  selectedWrapper: {
    borderColor: secondaryColor,
  },
  vStack: { alignSelf: "stretch", justifyContent: "flex-start", gap: 10 },
  outerStack: { alignSelf: "stretch", alignItems: "center", justifyContent: "space-between", alignContent: "center" },
  innerStack: { alignSelf: "stretch", alignItems: "center", justifyContent: "flex-start", gap: 10 },
  text: {
    fontSize: 20,
    color: mainColor,
  },
});
