import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    innerWrapper: {
        padding: 10,
        borderColor: "black",
        borderWidth: 1,
        borderRadius,
    },
    vStack: {
        alignSelf: "stretch",
        justifyContent: "flex-start",
        gap: 10,
    },
    outerStack: {
        alignSelf: "stretch",
        justifyContent: "flex-start",
        gap: 5,
    },
    innerStack: {
        justifyContent: "space-between",
        gap: 10,
        alignItems: "stretch",
    },
    text: {
        fontSize: 20,
        padding: 2,
    },
});
