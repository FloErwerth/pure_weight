import { StyleSheet } from "react-native";
import { componentBackgroundColor, mainColor } from "../theme/colors";
import { borderRadius } from "../theme/border";

export const styles = StyleSheet.create({
  vStack: {
    padding: 15,
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    alignSelf: "stretch",
  },
  text: {
    paddingLeft: 10,
    fontSize: 20,
    color: mainColor,
  },
  title: {
    fontSize: 40,
    fontWeight: "600",
  },
  titleWrapper: {
    justifyContent: "flex-start",
    alignSelf: "stretch",
    alignItems: "center",
    gap: 10,
    paddingLeft: 10,
    paddingRight: 20,
  },
  headerWrapper: {
    justifyContent: "space-between",
    alignSelf: "stretch",
    alignItems: "center",
    paddingRight: 20,
  },
  addWrapper: {
    padding: 16,
    backgroundColor: componentBackgroundColor,
    borderRadius,
  },
  errorBox: {
    overflow: "visible",
    color: "rgb(185,28,28)",
    height: 20,
  },
  workoutWrapper: {
    alignSelf: "stretch",
    height: 30,
    marginTop: 20,
    marginLeft: 10,
    marginRight: 10,
  },
  innerWrapper: {
    flex: 1,
    gap: 20,
    alignSelf: "stretch",
  },
  contentWrapper: {
    flex: 1,
    justifyContent: "center",
    paddingTop: 20,
    gap: 10,
  },
  listContainer: {
    borderRadius,
    flex: 1,
  },
  list: {
    elevation: 2,
    padding: 10,
    justifyContent: "space-between",
  },
  center: {
    flex: 1,
  },
  singleButton: {
    alignSelf: "stretch",
    marginBottom: 30,
    gap: 15,
  },
});
