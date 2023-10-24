import { StyleSheet } from "react-native";
import { backgroundColor, componentBackgroundColor, mainColor, secondaryColor, textFieldBackgroundColor } from "../../../theme/colors";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
  selectionButton: {
    padding: 10,
    marginBottom: 10,
    backgroundColor,
  },
  wrapper: { backgroundColor: componentBackgroundColor, overflow: "hidden", marginBottom: 10, padding: 10, paddingBottom: 0, borderRadius, gap: 10 },
  scrollView: {
    flex: 1,
    alignItems: "center",
    gap: 20,
    borderRadius,
  },
  lineChart: {
    marginTop: 15,
    borderRadius: 16,
  },
  chartTypeSelectonTitle: {
    color: mainColor,
    fontSize: 20,
  },
  chartTypeSelectionText: {
    color: secondaryColor,
    fontSize: 12,
  },
  selectionModal: {
    gap: 10,
  },
  vStack: {
    borderRadius,
    backgroundColor: componentBackgroundColor,
    gap: 10,
    paddingTop: 10,
  },
  hStack: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
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
