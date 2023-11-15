import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  pageWrapper: {
    gap: 10,
  },
  title: {
    fontSize: 26,
  },
  calendarWrapper: { borderRadius, overflow: "hidden" },
  browseButton: {
    textAlign: "center",
  },
  browseButtonWrapper: {
    borderRadius,
    padding: 10,
  },
  displayedWorkoutWrapper: {
    justifyContent: "space-evenly",
    padding: 10,
    borderRadius,
  },
});
