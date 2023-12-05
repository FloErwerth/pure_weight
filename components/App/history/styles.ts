import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    pageWrapper: {
        gap: 10,
    },
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
    scrollView: { gap: 5, top: -20 },
    workout: {
        padding: 10,
        gap: 20,
        flex: 1,
        borderRadius,
        borderWidth: 0.5,
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
        gap: 5,
        borderRadius,
    },
});
