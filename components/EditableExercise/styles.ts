import { Dimensions, StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    zIndex: {
        zIndex: -1,
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
        fontSize: 20,
    },
    suffix: {
        fontSize: 14,
        paddingRight: 5,
        textAlign: "right",
    },
    labelWrapper: {},
    headerWrapper: {
        margin: 10,
        gap: 10,
    },
    buttonText: {
        fontSize: 20,
    },
    input: {
        height: 45,
        borderRadius,
        fontSize: 20,
    },
    suffixContainer: {
        zIndex: 1,
        position: "absolute",
    },
    inputWrapper: {
        zIndex: -1,
        width: Dimensions.get("screen").width - 40,
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
        paddingBottom: 0,
        borderRadius,
    },
    titleWrapper: {
        marginBottom: 15,
    },
});
