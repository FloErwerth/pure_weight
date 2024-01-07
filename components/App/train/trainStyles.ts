import { StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const trainStyles = StyleSheet.create({
    buttons: {
        justifyContent: "center",
    },
    flexOneView: {
        flex: 1,
    },
    button: {
        fontSize: 20,
    },
    confirmOverwriteWrapper: {
        marginBottom: 10,
    },
    quickSettingsWrapper: {
        gap: 10,
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    carouselWrapper: {
        paddingRight: 20,
        gap: 10,
    },
    stopwatchButton: {
        flex: 1,
        zIndex: 1,
    },
    wrapper: {
        padding: 10,
        gap: 10,
    },
    navigationWrapper: {
        alignSelf: "stretch",
        alignItems: "center",
        marginBottom: 10,
    },
    headerWrapper: {
        gap: 10,
        alignItems: "stretch",
    },
    title: {
        flex: 1,
        position: "relative",
        left: 20,
    },
    noteButtonWrapper: {
        justifyContent: "center",
        borderRadius,
    },
    close: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
    showEditNoteStyle: { padding: 10, paddingHorizontal: 15, alignSelf: "center" },
    innerWrapper: {
        gap: 20,
        justifyContent: "space-around",
    },
    vStack: {
        alignItems: "center",
        marginBottom: 5,
        alignSelf: "stretch",
    },
    exerciseWrapper: {
        gap: 20,
        alignSelf: "stretch",
    },
    exerciseName: {
        fontSize: 24,
    },
    exerciseMeta: {
        color: "lightgrey",
    },
    exerciseMetaText: {
        color: "grey",
        fontSize: 14,
    },
    setInformation: {
        fontSize: 12,
        color: "grey",
    },
});
