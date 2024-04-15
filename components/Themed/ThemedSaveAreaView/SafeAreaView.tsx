import { View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { useMemo } from "react";

type SafeAreaViewProps = ViewProps & ComputedBackgroundColorProps;

export const SafeAreaView = (props: SafeAreaViewProps) => {
    const backgroundColor = useComputedBackgroundColor(props);
    const insets = useSafeAreaInsets();
    const style = useMemo(
        () => [props.style, { flex: 1, backgroundColor, paddingLeft: insets.left, paddingTop: insets.top, paddingRight: insets.right }],
        [backgroundColor, insets.left, insets.right, insets.top, props.style],
    );
    return <View {...props} style={style} />;
};
