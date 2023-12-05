import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedBottomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedBottomSheetModal";
import ColorPicker from "react-native-wheel-color-picker";
import { useCallback, useMemo } from "react";
import { styles } from "../App/create/styles";
import { ThemedView } from "../Themed/ThemedView/View";
import { useAppDispatch, useAppSelector } from "../../store";
import { setColor } from "../../store/reducers/workout";
import { getColor } from "../../store/reducers/workout/workoutSelectors";
import { View } from "react-native";

export function getInvertedColor(hex?: string) {
    if (!hex) {
        return undefined;
    }
    if (hex.indexOf("#") === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error("Invalid HEX color.");
    }
    const r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return "#" + padZero(r) + padZero(g) + padZero(b);
}

function padZero(str: string, len?: number) {
    const internalLen = (len = len || 2);
    const zeros = new Array(internalLen).join("0");
    return (zeros + str).slice(-internalLen);
}

export const useColorPickerComponents = () => {
    const { color, palette } = useAppSelector(getColor);
    const dispatch = useAppDispatch();
    const style = useMemo(() => [styles.colorButton, { backgroundColor: color }], [color]);

    const [colorPickerRef, openPicker] = useBottomSheetRef();

    const handlePickColor = useCallback(
        (color: string) => {
            dispatch(setColor(color));
        },
        [dispatch],
    );

    return useMemo(
        () =>
            [
                () => (
                    <ThemedBottomSheetModal key="COLORMODAL" snapPoints={["60%"]} ref={colorPickerRef}>
                        <View style={styles.padding}>
                            <ColorPicker onColorChangeComplete={handlePickColor} color={color} palette={palette} />
                        </View>
                    </ThemedBottomSheetModal>
                ),
                () => (
                    <ThemedView ghost style={styles.colorButtonWrapper}>
                        <ThemedPressable key="COLORPICKER" ghost onPress={openPicker} style={style} />
                    </ThemedView>
                ),
                color,
            ] as const,
        [color, colorPickerRef, handlePickColor, openPicker, style],
    );
};
