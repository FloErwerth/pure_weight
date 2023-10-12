import { StyleSheet } from "react-native";
import { mainColor } from "../../app/theme/colors";

export const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: mainColor,
  },
  titleWrapper: {
    justifyContent: "flex-start",
    alignSelf: "stretch",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  headerWrapper: {
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    paddingRight: 20,
  },
});
