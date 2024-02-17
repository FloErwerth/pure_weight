import { Dimensions, StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    wrapper: {
        paddingVertical: 5,
        marginBottom: 15,
        borderRadius,
    },
    background: {
        margin: 5,
        position: "absolute",
        zIndex: -1,
        opacity: 0.5,
        borderRadius: borderRadius - 2,
    },
    pressable: {
        padding: 10,
        alignItems: "center",
    },
    renderedItem: {
        width: Dimensions.get("screen").width - 20,
    },
});
