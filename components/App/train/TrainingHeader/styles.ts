import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        borderRadius,
        marginHorizontal: 5,
        marginTop: 3,
        marginBottom: 10,
    },
    number: {
        flex: 0.2,
        textAlign: "center",
        fontSize: 16,
    },
    durationInput: {
        fontSize: 16,
        flex: 2,
        textAlign: "center",
    },
    input: { flex: 1, textAlign: "center", fontSize: 16 },
    placeholder: { marginLeft: 5, width: 35 },
});
