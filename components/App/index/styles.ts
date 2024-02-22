import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    vStack: {
        justifyContent: "space-between",
        flex: 1,
        alignItems: "center",
        alignSelf: "stretch",
    },
    date: {
        fontSize: 16,
        fontStyle: "italic",
    },
    noWorkoutsHint: {
        paddingLeft: 5,
    },
    pausedTrainingHint: {
        fontSize: 16,
        padding: 5,
        alignSelf: "flex-end",
        borderRadius,
    },
    trainingDayName: {
        fontSize: 24,
    },
    outerTrainWrapper: {
        gap: 15,
        justifyContent: "flex-end",
    },
    innerTrainWrapper: {
        gap: 5,
        alignSelf: "stretch",
        alignItems: "center",
    },
    trainWrapper: {
        justifyContent: "space-between",
        flex: 1,
    },
    title: {
        fontSize: 26,
    },
    listContainer: {
        borderRadius,
    },
    list: {
        elevation: 2,
        padding: 10,
        justifyContent: "space-between",
    },
    center: {
        flex: 1,
    },
    savedTrainings: {
        gap: 10,
    },
});
