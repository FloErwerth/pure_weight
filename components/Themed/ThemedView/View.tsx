import { View, ViewProps } from "react-native";
import { RefObject, useMemo } from "react";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

export interface ThemedViewProps extends ViewProps {
    stretch?: boolean;
    background?: boolean;
    secondary?: boolean;
    ghost?: boolean;
    input?: boolean;
    reference?: RefObject<View>;
    behind?: boolean;
}

export const ThemedView = (props: ThemedViewProps) => {
    const backgroundColor = useComputedBackgroundColor(props);

    const wrapperStyle = useMemo(
        () => [
            {
                zIndex: props.behind ? -1 : 0,
                backgroundColor,
                flex: props.stretch ? 1 : 0,
            } as const,
            props.style,
        ],
        [backgroundColor, props.behind, props.stretch, props.style],
    );
    return <View {...props} ref={props.reference} style={wrapperStyle} />;
};
