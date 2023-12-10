import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    pressableWrapper: {
        borderRadius,
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    text: { fontSize: 26 },
    vStack: { gap: 15, flex: 1, paddingRight: 10 },
});
