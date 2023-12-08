import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        alignItems: "center",
        alignSelf: "stretch",
        borderRadius,
        marginHorizontal: 5,
        marginVertical: 3,
        marginBottom: 10,
    },
    number: {
        flex: 0.2,
        textAlign: "center",
        fontSize: 16,
    },
    inputStack: { flex: 1, gap: 12 },
    input: { flex: 1, textAlign: "center", fontSize: 16 },
    placeholder: { flex: 1, width: 40 },
});
