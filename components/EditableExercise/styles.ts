import { Dimensions, StyleSheet } from "react-native";
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
    gap: {
        gap: 10,
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
        borderRadius,
        borderWidth: 1,
    },
    inputWrapper: {
        marginTop: 10,
        zIndex: -1,
        gap: 5,
        width: Dimensions.get("screen").width - 40,
    },
    inputStack: {
        justifyContent: "center",
    },
    button: {
        justifyContent: "center",
        gap: 10,
        padding: 12,
        borderRadius,
    },
    buttons: {
        alignSelf: "stretch",
        justifyContent: "space-around",
    },
    innerWrapper: {},
    outerWrapper: {
        padding: 10,
        gap: 5,
    },
    saveText: {
        fontSize: 16,
    },
    title: {
        left: -10,
        fontSize: 30,
        borderWidth: 1,
        borderColor: "transparent",
        padding: 10,
        borderRadius,
    },
});
