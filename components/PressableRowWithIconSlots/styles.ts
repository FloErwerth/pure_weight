import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  text: {
    fontSize: 20,
  },
  button: {
    flex: 1,
  },
  wrapper: {
    padding: 10,
    paddingLeft: 16,
    paddingRight: 0,
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    alignSelf: "stretch",
    boxShadow: "0 2px 4px 0.5px lightgrey",
  },
  iconWrapper: {
    justifyContent: "flex-end",
    gap: 20,
    paddingRight: 16,
  },
  icon: {
    padding: 20,
    width: 1,
    height: 1,
  },
  iconCorrection: {
    left: -12.5,
    top: -12.5,
  },
});
