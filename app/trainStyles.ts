import { StyleSheet } from "react-native";
import { mainColor } from "./theme/colors";

export const trainStyles = StyleSheet.create({
  buttons: { justifyContent: "space-around", gap: 20, marginLeft: 10, marginRight: 10, alignSelf: "stretch" },
  header: {
    alignSelf: "stretch",
    alignItems: "center",
  },
  title: {
    flex: 1,
    position: "relative",
    left: 20,
  },
  close: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  wrapper: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
    gap: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  stack: {
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
    color: mainColor,
  },
  exerciseMeta: {
    color: "lightgrey",
  },
  exerciseMetaText: {
    color: "grey",
    fontSize: 16,
  },
  setInformation: {
    fontSize: 12,
    color: "grey",
  },
});
