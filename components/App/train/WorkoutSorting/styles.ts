import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        paddingLeft: 20,
        paddingTop: 0,
        borderRadius,
    },
    title: {
        fontSize: 20,
    },
    option: {
        padding: 10,
        borderRadius,
    },
    optionStack: {
        gap: 10,
    },
    optionText: {
        fontSize: 20,
    },
    optionWrapper: {
        padding: 10,
        gap: 10,
    },
});
