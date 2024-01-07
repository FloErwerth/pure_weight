import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    title: {
        fontSize: 40,
        fontWeight: "600",
    },
    titleWrapper: {
        justifyContent: "flex-start",
        alignSelf: "stretch",
        alignItems: "center",
        gap: 10,
        paddingRight: 20,
    },
    actions: {
        gap: 10,
    },
    headerWrapper: {
        justifyContent: "space-between",
        alignSelf: "stretch",
        alignItems: "center",
        paddingRight: 20,
        paddingBottom: 10,
    },
});
