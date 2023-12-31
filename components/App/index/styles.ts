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
        fontStyle: "italic",
    },
    pausedTrainigWrapper: {
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    trainingDayName: {
        fontSize: 24,
    },
    outerTrainWrapper: {
        gap: 15,
        justifyContent: "space-between",
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
