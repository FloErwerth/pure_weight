import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { styles } from "./styles";
import { Keyboard, View } from "react-native";
import { ThemedPressable } from "../Pressable/Pressable";
import { ThemedView } from "../ThemedView/View";
import { Text } from "../ThemedText/Text";
import Animated, { FadeIn, FadeOut, Layout } from "react-native-reanimated";
import { useTheme } from "../../../theme/context";
import { AppState, useAppSelector } from "../../../store";
import { getErrorByKey } from "../../../store/reducers/errors/errorSelectors";
import { ErrorFields } from "../../../store/reducers/errors/errorFields";

interface ThemedDropdownProps<T extends readonly string[]> {
    isSelectable?: boolean;
    onSelectItem?: (value: T[number]) => void;
    placeholder?: string;
    value?: T[number];
    options?: T;
    errorKey?: ErrorFields;
    secondary?: boolean;
}

interface ItemProps<T extends string> {
    value: T;
    onSelectItem: (value: T) => void;
}

function Separator({ show }: { show: boolean }) {
    const { backgroundColor } = useTheme();

    if (!show) {
        return null;
    }

    return <View style={{ height: 1, backgroundColor: backgroundColor }} />;
}
function Item<T extends string>({ value, onSelectItem }: ItemProps<T>) {
    return (
        <ThemedPressable ghost key={value} onPress={() => onSelectItem(value)}>
            <Text ghost style={styles.item}>
                {value}
            </Text>
        </ThemedPressable>
    );
}

export function ThemedDropdown<T extends readonly string[]>({
    secondary,
    isSelectable,
    errorKey,
    options,
    onSelectItem,
    placeholder,
    value,
}: ThemedDropdownProps<T>) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<View>(null);
    const [containerMeasures, setContainerMeasures] = useState<{ width: number; height: number }>({ width: 100, height: 50 });
    const error = useAppSelector((state: AppState) => getErrorByKey(state, errorKey));
    const { componentBackgroundColor } = useTheme();
    const togglePicker = useCallback(() => {
        setOpen((open) => !open);
    }, []);

    const measureContainer = useCallback(() => {
        if (containerRef.current) {
            containerRef.current.measure((x, y, width, height) => {
                setContainerMeasures({ width, height: height + 5 });
            });
        }
    }, []);

    useEffect(() => {
        if (open) {
            Keyboard.dismiss();
        }
    }, [open]);

    const dropdownStyles = useMemo(
        () => [styles.dropdown, { width: containerMeasures.width, top: containerMeasures.height }],
        [containerMeasures],
    );

    const handleSelectItem = useCallback(
        (value: T[number]) => {
            setOpen(false);
            onSelectItem?.(value);
        },
        [onSelectItem],
    );

    return (
        <>
            <ThemedView style={styles.wrapper} stretch ghost>
                <ThemedPressable
                    secondary={secondary}
                    error={error}
                    disabled={!isSelectable}
                    reference={containerRef}
                    onLayout={measureContainer}
                    style={styles.selectedItemWrapper}
                    onPress={togglePicker}
                    stretch>
                    <Text ghost disabled={!isSelectable} error={error} style={styles.selectedItem}>
                        {value || placeholder}
                    </Text>
                </ThemedPressable>
                {open && (
                    <Animated.View style={dropdownStyles} layout={Layout} entering={FadeIn.duration(200)} exiting={FadeOut.duration(200)}>
                        <ThemedView round input>
                            {options?.map((value, index) => (
                                <>
                                    <Item key={value} onSelectItem={handleSelectItem} value={value} />
                                    <Separator show={index < options.length - 1} />
                                </>
                            ))}
                        </ThemedView>
                    </Animated.View>
                )}
            </ThemedView>

            {open && <ThemedPressable ghost style={styles.hiddenLayer} onPress={togglePicker}></ThemedPressable>}
        </>
    );
}
