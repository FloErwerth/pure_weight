import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    center: {
        alignItems: "center",
    },
    time: {
        gap: 5,
    },
    label: {
        padding: 5,
    },
    headerWrapper: {
        margin: 10,
        gap: 10,
    },
    buttonText: {
        fontSize: 20,
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius,
        borderWidth: 1,
    },
    inputWrapper: {
        zIndex: -1,
        gap: 5,
    },
    button: {
        alignSelf: "stretch",
        justifyContent: "center",
        gap: 10,
        marginTop: 10,
        padding: 12,
        borderRadius,
    },
    buttons: {
        alignSelf: "stretch",
        justifyContent: "space-around",
    },
    innerWrapper: {
        margin: 10,
        gap: 20,
        alignItems: "stretch",
        alignSelf: "stretch",
        borderRadius,
    },
    outerWrapper: {
        padding: 10,
        gap: 5,
    },
    saveText: {
        fontSize: 16,
    },
    title: {
        fontSize: 30,
        borderWidth: 1,
        borderColor: "transparent",
        padding: 10,
        borderRadius,
    },
});
