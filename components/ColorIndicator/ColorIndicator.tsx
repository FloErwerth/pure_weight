import { useMemo } from "react";
import { ThemedView } from "../Themed/ThemedView/View";

export const ColorIndicator = ({ height, width }: { color?: string; height: number; width: number }) => {
    const colorIndicatorStyles = useMemo(() => ({ width, height, borderRadius: width / 2 }), [height, width]);
    return <ThemedView style={colorIndicatorStyles} />;
};
