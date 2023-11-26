import { Dimensions, StyleSheet } from "react-native";
import { borderRadius } from "../../../theme/border";

export const styles = StyleSheet.create({
    wrapper: {
        borderRadius,
    },
    hiddenLayer: {
        position: "absolute",
        left: -Dimensions.get("window").width,
        top: -Dimensions.get("screen").height / 2,
        width: Dimensions.get("window").width * 2,
        height: Dimensions.get("screen").height * 2,
        zIndex: -1,
        backgroundColor: "rgba(0,0,0,0.1)",
    },
    base: {
        position: "relative",
        fontSize: 20,
        padding: 10,
        zIndex: 1,
        borderRadius,
    },
});
