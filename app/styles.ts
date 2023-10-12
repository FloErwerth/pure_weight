import { StyleSheet } from "react-native";
import { backgroundColor, mainColor } from "./theme/colors";

export const styles = StyleSheet.create({
  stack: {
    justifyContent: "space-between",
    gap: 30,
    margin: 0,
    paddingBlock: 50,
    flex: 1,
    alignItems: "center",
    alignSelf: "stretch",
  },
  trainingDayName: {
    fontSize: 24,
    color: mainColor,
  },
  button: {
    paddingTop: 10,
  },
  view: {
    flex: 1,
    marginBottom: 20,
    backgroundColor: backgroundColor,
    alignSelf: "stretch",
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
    color: mainColor,
  },
  titleWrapper: {
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    paddingLeft: 20,
    paddingRight: 20,
  },
  listContainer: {
    borderRadius: 8,
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
    padding: 20,
    gap: 10,
  },
  cta: {
    width: "50%",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 30,
    marginTop: 10,
  },
});
