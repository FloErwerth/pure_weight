import { Dimensions, StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    item: {
        padding: 10,
        textAlign: "center",
        alignItems: "center",
        fontSize: 20,
    },
    hiddenLayer: {
        position: "absolute",
        left: -Dimensions.get("window").width,
        top: -Dimensions.get("screen").height / 2,
        width: Dimensions.get("window").width * 2,
        height: Dimensions.get("screen").height * 2,
    },
    wrapper: {
        zIndex: 1,
    },
    dropdown: {
        position: "absolute",
    },
    selectedItem: {
        fontSize: 20,
    },
    selectedItemWrapper: {
        padding: 10,
        borderWidth: 1,
        borderRadius,
        justifyContent: "center",
        alignItems: "center",
    },
});
