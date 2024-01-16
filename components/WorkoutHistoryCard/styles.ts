import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    hstack: {
        alignItems: "center",
        gap: 5,
    },
    wrapper: {
        gap: 10,
    },
    date: {
        fontSize: 24,
    },
    doneExercisesWrapper: {
        gap: 5,
    },
    displayedWorkoutWrapper: {
        justifyContent: "space-between",
        borderRadius,
    },
});
