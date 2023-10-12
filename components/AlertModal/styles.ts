import { StyleSheet } from "react-native";
import { borderRadius } from "../../app/theme/border";

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
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
  button: {
    flex: 1,
    alignSelf: "stretch",
  },
  text: {
    textAlign: "center",
  },
});
