import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    add: {
        borderWidth: 1,
        justifyContent: "center",
        borderRadius,
        padding: 15,
    },
    stack: {
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
    },
    text: {
        textAlign: "center",

        paddingLeft: 10,
        fontSize: 20,
    },
});
