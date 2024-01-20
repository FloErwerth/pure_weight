import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../../theme/border";

export const styles = StyleSheet.create({
    selectionButton: {
        padding: 5,
        flex: 0.5,
        borderRadius,
    },
    chartTypeSelectionButton: {
        justifyContent: "center",
    },
    chartTypeSelectionHelpButton: {
        marginRight: 10,
    },
    wrapper: {
        overflow: "hidden",
        marginBottom: 10,
        padding: 10,
        paddingBottom: 0,
        borderRadius,
        gap: 10,
    },
    scrollView: {
        alignItems: "center",
        gap: 20,
        borderRadius,
    },
    lineChart: {
        marginTop: 15,
        left: -30,
        borderRadius: 16,
    },
    chartTypeSelectonTitle: {
        fontSize: 20,
        alignSelf: "center",
    },
    chartTypeSelectionText: {
        fontSize: 12,
    },
    selectionModal: {
        gap: 10,
        padding: 10,
    },
    vStack: {
        borderRadius,
        gap: 10,
        paddingTop: 10,
    },
    hStack: {
        justifyContent: "space-between",
        paddingHorizontal: 10,
    },
    headerTitle: {
        fontSize: 26,
        flex: 1,
    },
    chartHeader: {
        justifyContent: "space-between",
        alignItems: "center",
    },
    chartTypeSelection: {
        borderRadius,
        alignSelf: "flex-end",
    },
    selectionText: {
        fontSize: 14,
    },
    selectionButtons: {
        gap: 10,
    },
    buttonsScrollView: {
        marginBottom: 5,
    },
});
