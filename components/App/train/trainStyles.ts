import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const trainStyles = StyleSheet.create({
  singleButton: { marginTop: 15, justifyContent: "space-around", gap: 20, marginLeft: 10, marginRight: 10, alignSelf: "stretch" },
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

  noteButtonWrapper: { padding: 10, borderRadius },
  close: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  innerWrapper: {
    paddingTop: 10,
    paddingBottom: 20,
    paddingLeft: 10,
    paddingRight: 10,
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
    fontSize: 16,
  },
  setInformation: {
    fontSize: 12,
    color: "grey",
  },
});
