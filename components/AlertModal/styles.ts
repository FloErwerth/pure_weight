import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
  innerWrapper: {
    borderRadius,
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    gap: 20,
  },
  primary: {
    backgroundColor: "lightblue",
  },
  buttons: {
    alignSelf: "stretch",
    justifyContent: "space-around",
    marginLeft: 10,
    gap: 20,
    marginRight: 10,
  },
  title: {
    fontSize: 20,
  },
  text: {
    textAlign: "center",
  },
});
