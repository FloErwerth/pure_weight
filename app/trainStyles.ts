import { StyleSheet } from "react-native";

export const trainStyles = StyleSheet.create({
  buttons: { gap: 10, marginLeft: 10, marginRight: 10 },
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
    marginTop: 10,
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
    gap: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  stack: {
    gap: 20,
    marginBottom: 10,
  },
  exerciseWrapper: {
    gap: 20,
    alignSelf: "stretch",
  },
  exerciseName: {
    fontSize: 20,
    color: "black",
  },
  exerciseMeta: {
    color: "lightgrey",
  },
  exerciseMetaText: {
    color: "grey",
  },
  setInformation: {
    fontSize: 12,
    color: "grey",
  },
});
