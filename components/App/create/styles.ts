import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    workoutNameInput: {
        fontSize: 26,
    },
    swatches: { marginTop: 10 },
    padding: {
        padding: 10,
        height: "90%",
    },
    indicator: { width: 50, height: 10, alignSelf: "center", marginBottom: 10 },
    picker: {
        width: "90%",
        alignSelf: "center",
    },
    vStack: {
        padding: 15,
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        flex: 1,
        alignSelf: "stretch",
    },
    colorButton: {
        width: 35,
        height: 35,
        marginRight: 10,
        borderRadius: 30,
        alignSelf: "center",
    },
    text: {
        paddingLeft: 10,
        fontSize: 20,
    },
    title: {
        fontSize: 40,
        fontWeight: "600",
    },
    titleWrapper: {
        justifyContent: "flex-start",
        alignSelf: "stretch",
        alignItems: "center",
        gap: 10,
        paddingLeft: 10,
        paddingRight: 20,
    },
    headerWrapper: {
        justifyContent: "space-between",
        alignSelf: "stretch",
        alignItems: "center",
        paddingRight: 20,
    },
    addWrapper: {
        padding: 16,
        borderRadius,
    },
    errorBox: {
        overflow: "visible",
        color: "rgb(185,28,28)",
        height: 20,
    },
    workoutWrapper: {
        alignSelf: "stretch",
        height: 30,
        marginTop: 20,
        marginLeft: 10,
        marginRight: 10,
    },
    innerWrapper: {
        flex: 1,
        gap: 20,
        alignSelf: "stretch",
    },
    contentWrapper: {
        justifyContent: "center",
    },
    listContainer: {
        borderRadius,
        flex: 1,
        marginTop: 20,
    },
    list: {
        elevation: 2,
        padding: 10,
        justifyContent: "space-between",
    },
    center: {
        flex: 1,
    },
    buttons: {
        alignSelf: "stretch",
        marginBottom: 30,
        gap: 15,
    },
});
