import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const trainStyles = StyleSheet.create({
  buttons: {
    justifyContent: "space-around",
    gap: 20,
    alignItems: "center",
  },
  flexOneView: {
    flex: 1,
  },
  button: {
    padding: 10,
    borderRadius,
  },
  header: {
    alignSelf: "stretch",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    flex: 1,
    position: "relative",
    left: 20,
  },
  noteButtonWrapper: {
    justifyContent: "center",
    borderRadius,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  innerWrapper: {
    gap: 20,
    justifyContent: "space-around",
  },
  vStack: {
    alignItems: "center",
    marginBottom: 5,
    alignSelf: "stretch",
  },
  exerciseWrapper: {
    gap: 20,
    alignSelf: "stretch",
  },
  exerciseName: {
    fontSize: 24,
  },
  exerciseMeta: {
    color: "lightgrey",
  },
  exerciseMetaText: {
    color: "grey",
    fontSize: 14,
  },
  setInformation: {
    fontSize: 12,
    color: "grey",
  },
});
