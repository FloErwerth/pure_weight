import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    wrapper: {
        padding: 10,
        borderRadius,
    },
    answerWrapper: {
        paddingHorizontal: 10,
        paddingTop: 5,
    },
    question: {
        fontSize: 24,
    },
    answer: {
        padding: 5,
        fontSize: 24,
    },
});
