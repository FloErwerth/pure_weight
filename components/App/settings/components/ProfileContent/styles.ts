import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../../theme/border";

export const styles = StyleSheet.create({
    innerWrapper: {
        justifyContent: "space-between",
        alignItems: "center",
    },
    innerWrapperChildren: {
        gap: 5,
    },
    stack: {
        justifyContent: "space-between",
        paddingRight: 5,
    },
    title: {
        fontSize: 20,
        paddingVertical: 2.5,
        paddingHorizontal: 5,
        marginBottom: 10,
    },
    outerWrapper: {
        padding: 10,
        borderRadius,
        alignSelf: "stretch",
    },
});
