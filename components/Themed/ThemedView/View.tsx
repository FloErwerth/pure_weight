import { View, ViewProps } from "react-native";
import { RefObject, useMemo } from "react";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { borderRadius } from "../../../theme/border";

export interface ThemedViewProps extends ViewProps, ComputedBackgroundColorProps {
    stretch?: boolean;
    reference?: RefObject<View>;
    behind?: boolean;
    round?: boolean;
}

export const ThemedView = (props: ThemedViewProps) => {
    const backgroundColor = useComputedBackgroundColor(props);

    const wrapperStyle = useMemo(
        () => [
            {
                zIndex: props.behind ? -1 : 0,
                backgroundColor,
                flex: props.stretch ? 1 : 0,
                borderRadius: props.round ? borderRadius : 0,
            } as const,
            props.style,
        ],
        [backgroundColor, props.behind, props.round, props.stretch, props.style],
    );
    return <View {...props} ref={props.reference} style={wrapperStyle} />;
};
