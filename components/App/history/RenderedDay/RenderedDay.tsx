import { Pressable, View } from "react-native";
import { Text } from "../../../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTheme } from "../../../../theme/context";
import { getInvertedColor } from "../../../ColorPickerWithModal/ColorPickerWithModal";
import { ColorIndicator } from "../../../ColorIndicator/ColorIndicator";

interface RenderedDayProps {
    day: string;
    color: string;
    handleSelectDate: () => void;
    selected: boolean;
    latestDay?: boolean;
}

const useMarkedDayStyles = (color: string, selected: boolean) => {
    const { mainColor, textDisabled } = useTheme();

    const viewStyle = useMemo(() => {
        if (color === undefined) {
            return [styles.dateWrapper];
        }
        return [styles.dateWrapper, { backgroundColor: selected ? color : textDisabled }];
    }, [color, selected, textDisabled]);

    const textStyle = useMemo(() => {
        return { color: selected ? getInvertedColor(color) : mainColor, fontSize: selected ? 18 : 16, fontWeight: selected ? "bold" : "normal" } as const;
    }, [selected, color, mainColor]);
    return useMemo(() => ({ viewStyle, textStyle }), [textStyle, viewStyle]);
};

export const RenderedDay = ({ day, color, handleSelectDate, selected, latestDay }: RenderedDayProps) => {
    const { viewStyle, textStyle } = useMarkedDayStyles(color, selected);
    const showDot = Boolean(color && !selected);
    return (
        <Pressable onPress={handleSelectDate}>
            <View style={viewStyle}>
                <Text style={textStyle} ghost>
                    {day}
                </Text>
                {showDot && <ColorIndicator color={color} width={latestDay ? 8 : 4} height={4} />}
            </View>
        </Pressable>
    );
};
