import { ThemedPressable } from "../Themed/Pressable/Pressable";
import { ThemedBottomSheetModal } from "../BottomSheetModal/ThemedBottomSheetModal";
import ColorPicker, { Panel3, Preview, returnedResults, Swatches } from "reanimated-color-picker";

import { RefObject, useCallback, useMemo } from "react";
import { styles } from "../App/create/styles";
import { useAppDispatch, useAppSelector } from "../../store";
import { setColor } from "../../store/reducers/workout";
import { getColor } from "../../store/reducers/workout/workoutSelectors";
import { BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

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

type ColorPickerButtonProps = {
    openPicker: () => void;
};
export const ColorPickerButton = ({ openPicker }: ColorPickerButtonProps) => {
    const { color } = useAppSelector(getColor);
    const style = useMemo(() => [styles.colorButton, { backgroundColor: color }], [color]);

    return <ThemedPressable key="COLORPICKER" ghost onPress={openPicker} style={style} />;
};

type ColorPickerWithModalProps = {
    reference: RefObject<BottomSheetModalMethods>;
};

export const ColorPickerModal = ({ reference }: ColorPickerWithModalProps) => {
    const { color, palette } = useAppSelector(getColor);
    const dispatch = useAppDispatch();
    const handlePickColor = useCallback(
        ({ hex }: returnedResults) => {
            dispatch(setColor(hex));
        },
        [dispatch],
    );

    return (
        <ThemedBottomSheetModal hideIndicator key="COLORMODAL" ref={reference}>
            <ColorPicker
                thumbShape="circle"
                boundedThumb={true}
                thumbAnimationDuration={100}
                style={styles.picker}
                value={color}
                onChange={handlePickColor}>
                <Preview hideText hideInitialColor style={styles.indicator} />
                <Panel3 thumbSize={30} />
                <Swatches style={styles.swatches} colors={palette} />
            </ColorPicker>
        </ThemedBottomSheetModal>
    );
};
