import { StyleSheet } from "react-native";
import { mainColor } from "../App/theme/colors";

export const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "stretch",
    padding: 5,
    color: mainColor,
  },
  clearWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  innerWrapper: {
    alignSelf: "stretch",
    justifyContent: "space-around",
    marginHorizontal: 10,
    alignItems: "center",
    gap: 10,
  },
  inputStyle: {
    borderWidth: 0,
  },
});
