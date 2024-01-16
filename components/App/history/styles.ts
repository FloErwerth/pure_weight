import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    title: { fontSize: 26, padding: 1, flex: 1, borderRadius, marginTop: 20 },
    latestWorkoutChip: { paddingTop: 26 },
    titleWrapper: {
        gap: 5,
        flex: 0.6,
        alignItems: "center",
    },
    hstack: {
        alignItems: "center",
        gap: 5,
    },
    scrollView: { gap: 10 },
    workout: {
        gap: 10,
    },
    workoutTitle: {
        fontSize: 26,
    },
    calendarWrapper: { borderRadius, overflow: "hidden" },
    browseButton: {
        textAlign: "center",
    },
    browseButtonWrapper: {
        borderRadius,
        padding: 10,
    },
    displayedWorkoutWrapper: {
        justifyContent: "space-between",
        borderRadius,
    },
});
