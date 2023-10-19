import { StyleSheet } from "react-native";
import { borderRadius } from "../App/theme/border";
import { mainColor } from "../App/theme/colors";

export const styles = StyleSheet.create({
  innerWrapper: {
    borderRadius,
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    gap: 20,
  },
  primary: {
    backgroundColor: "lightblue",
  },
  singleButton: {
    alignSelf: "stretch",
    justifyContent: "space-around",
    marginLeft: 10,
    gap: 20,
    marginRight: 10,
  },
  title: {
    color: mainColor,
    fontSize: 20,
  },
  text: {
    color: mainColor,
    textAlign: "center",
  },
});
