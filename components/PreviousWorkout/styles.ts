import { StyleSheet } from "react-native";
import { borderRadius } from "../../theme/border";

export const styles = StyleSheet.create({
    set: {
        textAlign: "center",
        fontSize: 20,
        paddingLeft: 8,
    },
    timeBasedSet: {
        textAlign: "center",
        fontSize: 16,
        padding: 5,
    },
    setWrapper: {
        padding: 5,
    },
    setOuterWrapper: {
        justifyContent: "space-around",
        gap: 10,
    },
    setOuterWrapperTimeBased: {
        justifyContent: "center",
        gap: 0,
    },
    number: {
        flex: 0.2,
        textAlign: "center",
        fontSize: 16,
    },
    numberHeader: {
        position: "absolute",
        left: 5,
        top: 6,
        fontSize: 15,
        marginLeft: 14,
    },
    innerWrapper: {
        padding: 5,
        alignItems: "center",
        borderRadius,
    },
    innerWrapperHeader: {
        paddingHorizontal: 5,
        paddingBottom: 10,
        alignItems: "center",
        borderRadius,
    },
    noteButtonWrapper: {
        borderRadius,
        gap: 5,
        alignItems: "center",
        marginRight: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginVertical: 5,
    },
});
