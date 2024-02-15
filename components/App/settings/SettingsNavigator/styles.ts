import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    innerWrapper: {
        justifyContent: "space-between",
        alignItems: "center",
    },
    innerWrapperChildren: {
        gap: 5,
    },
    title: {
        fontSize: 20,
        paddingVertical: 2.5,
        paddingHorizontal: 5,
    },
    outerWrapper: {
        borderRadius,
        alignSelf: "stretch",
    },
});
