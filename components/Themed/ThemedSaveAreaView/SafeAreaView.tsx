import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

type SafeAreaViewProps = ViewProps & ComputedBackgroundColorProps;

export const SafeAreaView = (props: SafeAreaViewProps) => {
    const backgroundColor = useComputedBackgroundColor(props);
    const insets = useSafeAreaInsets();

    return <View {...props} style={[props.style, { flex: 1, backgroundColor, paddingLeft: insets.left, paddingTop: insets.top, paddingRight: insets.right }]} />;
};
