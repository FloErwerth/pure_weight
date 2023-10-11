import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    gap: 20,
  },
  buttons: {
    gap: 20,
    alignSelf: "stretch",
    marginLeft: 20,
    marginRight: 20,
  },
  button: {
    flex: 1,
    alignSelf: "stretch",
  },
  text: {
    textAlign: "center",
  },
});
