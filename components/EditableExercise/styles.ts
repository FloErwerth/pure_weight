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
        gap: 10,
    },
    headerWrapper: {
        margin: 10,
        gap: 20,
    },
    buttonText: {
        fontSize: 16,
    },
    input: {
        alignSelf: "stretch",
        paddingVertical: 10,
        paddingHorizontal: 5,
        borderRadius,
        borderWidth: 1,
    },
    inputWrapper: {
        padding: 10,
        zIndex: -1,
        gap: 10,
    },
    button: {
        alignSelf: "stretch",
        marginHorizontal: 10,
        justifyContent: "center",
        gap: 10,
        padding: 10,
        paddingRight: 8,
        borderRadius,
    },
    buttons: {
        alignSelf: "stretch",
        justifyContent: "space-around",
    },
    innerWrapper: {
        gap: 10,
        borderRadius,
        flex: 1,
    },
    saveText: {
        fontSize: 16,
    },
    title: {
        fontSize: 20,
        borderWidth: 1,
        borderColor: "transparent",
        padding: 10,
        borderRadius,
    },
});
