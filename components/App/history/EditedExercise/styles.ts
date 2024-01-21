import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    inputStack: {
        gap: 5,
        alignItems: "center",
        marginBottom: 5,
        paddingVertical: 3,
    },
    center: {
        flex: 1,
        height: 50,
    },
    setIndex: {
        fontSize: 16,
        padding: 10,
    },
    textInput: {
        padding: 10,
        alignSelf: "stretch",
        borderRadius,
        fontSize: 16,
    },
    button: {
        width: 40,
        padding: 7,
        borderRadius,
        alignSelf: "center",
    },
    save: {
        alignSelf: "center",
        marginHorizontal: 10,
    },
});
