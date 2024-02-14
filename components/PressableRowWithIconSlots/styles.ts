import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    text: {
        fontSize: 20,
    },
    buttons: {
        justifyContent: "center",
    },
    noIconWrapper: {
        paddingVertical: 12.5,
    },
    innerWrapper: {
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius,
        alignSelf: "stretch",
    },
    iconWrapper: {
        justifyContent: "flex-end",
        gap: 20,
        padding: 5,
        backgroundColor: "transparent",
    },
    iconCorrection: {
        left: -12.5,
        top: -12.5,
    },
});
