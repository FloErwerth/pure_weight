import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedButtomSheetModal, useBottomSheetRef } from "../BottomSheetModal/ThemedButtomSheetModal";
import { View } from "react-native";
import ColorPicker from "react-native-wheel-color-picker";
import { useCallback, useEffect, useMemo, useState } from "react";
import { styles } from "../App/create/styles";
import { ThemedView } from "../Themed/ThemedView/View";

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

const COLORS = ["#000000", "#888888", "#ed1c24", "#d11cd5", "#1633e6", "#00aeef", "#00c85d", "#57ff0a", "#ffde17", "#f26522"];

export const useColor = (initialColor?: string) => {
    return useMemo(() => initialColor ?? COLORS[Math.floor((COLORS.length - 1) * Math.random())], [initialColor]);
};

const useColorPicker = (initialColor?: string) => {
    const randomColor = useColor();
    const [color, setColor] = useState(initialColor ?? randomColor);

    const style = useMemo(() => [styles.colorButton, { backgroundColor: color }], [color]);

    return useMemo(() => [style, color, setColor] as const, [color, style]);
};

export const useColorPickerComponents = (initialColor: string) => {
    useEffect(() => {
        setColor(initialColor);
    }, [initialColor]);

    const [pickerStyle, color, setColor] = useColorPicker(initialColor);
    const [colorPickerRef, openPicker] = useBottomSheetRef();

    const handlePickColor = useCallback(
        (color: string) => {
            setColor(color);
        },
        [setColor],
    );

    return useMemo(
        () =>
            [
                () => (
                    <ThemedButtomSheetModal key="COLORMODAL" snapPoints={["60%"]} ref={colorPickerRef}>
                        <View style={{ padding: 10, height: "90%" }}>
                            <ColorPicker onColorChangeComplete={handlePickColor} color={color} palette={COLORS} />
                        </View>
                    </ThemedButtomSheetModal>
                ),
                () => (
                    <ThemedView ghost style={styles.colorButtonWrapper}>
                        <ThemedPressable key="COLORPICKER" ghost onPress={openPicker} style={pickerStyle} />
                    </ThemedView>
                ),
                color,
            ] as const,
        [color, colorPickerRef, handlePickColor, openPicker, pickerStyle],
    );
};
