import { useMemo } from "react";
import { Text } from "../../Themed/ThemedText/Text";
import { useTheme } from "../../../theme/context";
import DeviceInfo from "react-native-device-info";

export const TabBarLabel = ({ focused, title }: { focused: boolean; title: string }) => {
    const { mainColor, secondaryColor } = useTheme();
    const color = useMemo(() => {
        return focused ? mainColor : secondaryColor;
    }, [focused, mainColor, secondaryColor]);

    const tabletStyles = useMemo(() => {
        if (DeviceInfo.isTablet()) {
            return { transform: [{ translateY: -12 }] };
        }
        return {};
    }, [DeviceInfo.isTablet()]);

    return <Text style={{ fontSize: 12, color, alignSelf: "center", ...tabletStyles }}>{title}</Text>;
};
