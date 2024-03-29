import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    animatedWrapper: {
        zIndex: 1,
    },
    iconContainer: {
        position: "absolute",
        borderRadius,
    },
    innerIconContainer: {
        justifyContent: "center",
    },
    editIcon: { position: "absolute", left: 15 },
    deleteIcon: { position: "absolute", right: 15 },
    diffWrapper: {
        gap: 7,
        alignItems: "center",
    },
    hint: {
        fontSize: 11,
    },
    text: {
        fontSize: 16,
    },
    progressWrapper: {
        paddingVertical: 12.5,
        paddingHorizontal: 10,
        borderRadius,
    },
    wrapper: {
        borderRadius,
        gap: 10,
    },
});
