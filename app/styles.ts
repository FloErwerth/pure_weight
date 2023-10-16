import { StyleSheet } from "react-native";
import { mainColor } from "./theme/colors";
import { borderRadius } from "./theme/border";

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

  view: {
    flex: 1,
    paddingBottom: 20,
    alignSelf: "stretch",
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
