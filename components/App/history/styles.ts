import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  pageWrapper: {
    gap: 10,
  },
  hstack: {
    alignItems: "center",
    gap: 5,
  },
  scrollView: { gap: 10 },
  workout: {
    padding: 10,
    gap: 10,
    flex: 1,
    borderRadius,
  },
  workoutTitle: {
    fontSize: 20,
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
    gap: 5,
    borderRadius,
  },
});
