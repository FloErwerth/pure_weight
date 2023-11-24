import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  vStack: {
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    alignSelf: "stretch",
  },
  trainingDayName: {
    fontSize: 24,
  },
  outerTrainWrapper: {
    gap: 5,
    alignItems: "center",
  },
  view: {
    flex: 1,
  },
  trainWrapper: {
    justifyContent: "space-between",
    flex: 1,
  },
  title: {
    fontSize: 30,
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
  },
});
