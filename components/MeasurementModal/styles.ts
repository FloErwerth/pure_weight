import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    outerWrapper: {
        gap: 10,
        margin: 10,
        borderRadius,
        padding: 10,
    },
    textInput: {
        fontSize: 20,
        borderRadius,
        padding: 10,
    },
    text: {
        fontSize: 20,
    },
    calendarWrapper: {
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        borderRadius,
    },
    dateWrapper: {
        borderRadius,
        zIndex: -1,
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    calendarButtonsWrapper: {
        gap: 10,
        zIndex: -1,
    },
    calendar: {
        borderWidth: 1,
        borderRadius,
        overflow: "hidden",
        borderColor: "transparent",
    },
    warningWrapper: {
        padding: 10,
        paddingBottom: 0,
        alignItems: "center",
        gap: 5,
    },
    warningText: {
        fontSize: 16,
    },
    addWrapper: {
        borderRadius,
        padding: 10,
        marginTop: 20,
        gap: 15,
        zIndex: -1,
        justifyContent: "center",
        alignItems: "center",
    },
    pressable: {
        zIndex: -1,
    },
    addMeasurement: {
        fontSize: 20,
    },
});
