import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  outerWrapper: {
    gap: 10,
    marginTop: 10,
  },
  textInput: {
    fontSize: 20,
    borderRadius,
    padding: 10,
  },
  text: {
    fontSize: 20,
  },
  calendarWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius,
  },
  dateWrapper: {
    borderRadius,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  calendarButtonsWrapper: {
    gap: 10,
    paddingHorizontal: 10,
  },
  calendar: {
    borderWidth: 1,
    borderRadius,
    overflow: "hidden",
    borderColor: "transparent",
  },
  warningWrapper: {
    padding: 10,
    paddingBottom: 0,
  },
  warningText: {
    fontSize: 16,
  },
  addWrapper: {
    borderRadius,
    padding: 10,
    margin: 10,
    gap: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addMeasurement: {
    fontSize: 20,
  },
});
