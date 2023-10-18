import { StyleSheet } from "react-native";
import { backgroundColor, mainColor, textFieldBackgroundColor } from "../../../theme/colors";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  selectionButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor,
  },
  headerTitle: {
    color: mainColor,
    fontSize: 26,
  },
  chartHeader: {
    justifyContent: "space-between",
    alignItems: "center",
  },
  chartTypeSelection: {
    borderRadius,
    alignSelf: "flex-end",
    backgroundColor: textFieldBackgroundColor,
  },
  selectionText: {
    fontSize: 20,
  },
  selectionButtons: {
    gap: 10,
  },
  buttonsScrollView: {
    marginBottom: 5,
  },
});
