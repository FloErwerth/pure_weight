import { useMemo } from "react";
import { ThemedView } from "../Themed/ThemedView/View";
import { useTheme } from "../../theme/context";

export const ColorIndicator = ({ height, width }: { color?: string; height: number; width: number }) => {
    const { mainColor } = useTheme();
    const colorIndicatorStyles = useMemo(
        () => ({ width, height, borderRadius: width / 2, backgroundColor: mainColor }),
        [height, mainColor, width],
    );
    return <ThemedView style={colorIndicatorStyles} />;
};
