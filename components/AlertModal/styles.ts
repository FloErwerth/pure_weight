import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    innerWrapper: {
        borderRadius,
        justifyContent: "space-between",
        padding: 10,
        alignItems: "center",
        gap: 10,
    },
    helpText: {
        fontSize: 20,
    },
    primary: {
        backgroundColor: "lightblue",
    },
    buttons: {
        alignSelf: "stretch",
        justifyContent: "space-around",
        marginLeft: 10,
        gap: 10,
        marginRight: 10,
    },
    title: {
        fontSize: 20,
    },
    text: {
        textAlign: "center",
    },
    buttonText: { fontSize: 20, alignSelf: "center" },
    gap: { gap: 10 },
    pressableCenter: { justifyContent: "center" },
});
