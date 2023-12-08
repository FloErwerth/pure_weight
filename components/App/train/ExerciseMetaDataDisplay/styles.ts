import { StyleSheet } from "react-native";
import { borderRadius } from "../../../../theme/border";

export const styles = StyleSheet.create({
    wrapper: { justifyContent: "space-between", borderRadius, padding: 10, flex: 1, alignItems: "center" },
    pressable: { width: 50, alignItems: "center", justifyContent: "center" },
    timeStack: {
        gap: 3,
    },
    smallGap: {
        gap: 1,
    },
});
