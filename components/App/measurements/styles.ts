import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    date: {
        fontStyle: "italic",
        fontSize: 16,
    },
    text: {
        fontSize: 26,
    },
    vStack: {
        gap: 5,
        flex: 1,
    },
    titleWrapper: {
        marginBottom: 10,
    },
    wrapper: {
        gap: 10,
    },
});

export const createStyles = StyleSheet.create({
    innerWrapper: {
        gap: 10,
        margin: 10,
        borderRadius,
        padding: 10,
    },
    actionWrapper: {
        gap: 10,
        marginTop: 20,
        justifyContent: "center",
    },
    warningConfirmWrapper: {
        gap: 10,
    },
    outerWrapper: {
        flex: 1,
        justifyContent: "space-between",
    },
    textInput: {
        fontSize: 26,
        borderRadius,
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
        alignSelf: "stretch",
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
        zIndex: -1,
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
        padding: 10,
    },
    addMeasurement: {
        fontSize: 20,
    },
});
