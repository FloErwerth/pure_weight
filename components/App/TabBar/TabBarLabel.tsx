import { useMemo } from "react";
import { Text } from "../../Themed/ThemedText/Text";
import { useTheme } from "../../../theme/context";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const TabBarLabel = ({ focused, title }: { focused: boolean; title: string }) => {
    const { mainColor, secondaryColor } = useTheme();
    const { bottom } = useSafeAreaInsets();
    const color = useMemo(() => {
        return focused ? mainColor : secondaryColor;
    }, [focused, mainColor, secondaryColor]);

    const tabletStyles = useMemo(() => {
        if (bottom === 0) {
            return { transform: [{ translateY: -12 }] };
        }
        return {};
    }, [bottom]);

    const styles = useMemo(() => ({ fontSize: 12, color, alignSelf: "center", ...tabletStyles }) as const, [color, tabletStyles]);

    return <Text style={styles}>{title}</Text>;
};
