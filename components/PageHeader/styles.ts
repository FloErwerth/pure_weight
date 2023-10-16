import { StyleSheet } from "react-native";
import { mainColor } from "../../app/theme/colors";

export const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: mainColor,
  },
  titleWrapper: {
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  button: {
    paddingTop: 10,
  },
});
