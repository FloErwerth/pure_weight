import { Pressable, View } from "react-native";
import { Text } from "../../../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTheme } from "../../../../theme/context";
import { ColorIndicator } from "../../../ColorIndicator/ColorIndicator";

interface RenderedDayProps {
    day: string;
    handleSelectDate: () => void;
    selected: boolean;
    latestDay?: boolean;
    selectable?: boolean;
}

const useMarkedDayStyles = (selected: boolean, selectable?: boolean) => {
    const { secondaryColor, mainColor, textDisabled } = useTheme();

    const viewStyle = useMemo(() => {
        if (selectable === undefined) {
            return [styles.dateWrapper];
        }
        return [styles.dateWrapper, { backgroundColor: selected ? mainColor : textDisabled }];
    }, [mainColor, selectable, selected, textDisabled]);

    const textStyle = useMemo(() => {
        return {
            color: selected ? mainColor : secondaryColor,
            fontSize: selected ? 18 : 16,
            fontWeight: selected ? "bold" : "normal",
        } as const;
    }, [selected, mainColor, secondaryColor]);
    return useMemo(() => ({ viewStyle, textStyle }), [textStyle, viewStyle]);
};

export const RenderedDay = ({ day, handleSelectDate, selected, latestDay, selectable }: RenderedDayProps) => {
    const { viewStyle, textStyle } = useMarkedDayStyles(selected);
    const showDot = Boolean(selectable && !selected);

    return (
        <Pressable disabled={!selectable} onPress={handleSelectDate}>
            <View style={viewStyle}>
                <Text style={textStyle} ghost>
                    {day}
                </Text>
                {showDot && <ColorIndicator width={latestDay ? 8 : 4} height={4} />}
            </View>
        </Pressable>
    );
};
