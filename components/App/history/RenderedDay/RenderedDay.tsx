import { Pressable } from "react-native";
import { Text } from "../../../Themed/ThemedText/Text";
import { useMemo } from "react";
import { styles } from "./styles";
import { useTheme } from "../../../../theme/context";

interface RenderedDayProps {
    day: string;
    handleSelectDate: () => void;
    selected: boolean;
    marked?: boolean;
    latestDay?: boolean;
    selectable?: boolean;
}

const useMarkedDayStyles = (selected: boolean, selectable?: boolean, marked?: boolean) => {
    const { mainColor, textDisabled } = useTheme();
    const viewStyle = useMemo(() => {
        return [
            styles.dateWrapper,
            {
                backgroundColor: selected ? mainColor : marked ? textDisabled : "transparent",
            },
        ];
    }, [mainColor, marked, selected, textDisabled]);

    const textStyle = useMemo(() => {
        return {
            color: selected ? textDisabled : selectable ? mainColor : textDisabled,
            fontWeight: selected ? "bold" : "normal",
        } as const;
    }, [selected, textDisabled, selectable, mainColor]);

    return useMemo(() => ({ viewStyle, textStyle }), [textStyle, viewStyle]);
};

export const RenderedDay = ({ day, handleSelectDate, selected, selectable, marked }: RenderedDayProps) => {
    const { viewStyle, textStyle } = useMarkedDayStyles(selected, selectable, marked);

    return (
        <Pressable style={viewStyle} disabled={!selectable} onPress={handleSelectDate}>
            <Text style={textStyle} ghost>
                {day}
            </Text>
        </Pressable>
    );
};
