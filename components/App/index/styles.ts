import { StyleSheet } from "react-native";
import { mainColor } from "../theme/colors";
import { borderRadius } from "../theme/border";

export const styles = StyleSheet.create({
  vStack: {
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    alignSelf: "stretch",
  },
  trainingDayName: {
    fontSize: 24,
    color: mainColor,
  },
  view: {
    flex: 1,
  },
  listContainer: {
    borderRadius,
  },
  list: {
    elevation: 2,
    padding: 10,
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
  },
  savedTrainings: {
    flex: 1,
    gap: 10,
  },
});
