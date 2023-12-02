import { Dimensions, StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    nameColorStack: {
        gap: 10,
        justifyContent: "space-between",
        alignContent: "center",
    },
    workoutNameInput: { width: Dimensions.get("window").width * 0.75, fontSize: 26 },
    padding: {
        padding: 10,
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
        width: 30,
        height: 30,
        borderRadius: 30,
        backgroundColor: "black",
    },
    colorButtonWrapper: {
        justifyContent: "center",
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
        paddingTop: 20,
        gap: 10,
    },
    listContainer: {
        borderRadius,
        flex: 1,
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
