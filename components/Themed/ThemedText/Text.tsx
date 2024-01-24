import { Text as _Text, TextProps } from "react-native";
import { useMemo } from "react";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { useComputedColor } from "../../../hooks/useComputedColor";

interface ThemedTextProps extends TextProps {
    cta?: boolean;
    stretch?: boolean;
    warning?: boolean;
    secondary?: boolean;
    component?: boolean;
    ghost?: boolean;
    background?: boolean;
    input?: boolean;
    error?: boolean;
    placeholder?: boolean;
    center?: boolean;
    behind?: boolean;
    link?: boolean;
    textBackground?: boolean;
    textSecondary?: boolean;
    italic?: boolean;
}

export const Text = (props: ThemedTextProps) => {
    const computedBackgroundColor = useComputedBackgroundColor(props);
    const computedColor = useComputedColor(props);

    const styles = useMemo(
        () => [
            {
                zIndex: props.behind ? -1 : 0,
                flex: props.stretch ? 1 : 0,
                textAlign: props.center ? "center" : "left",
                color: computedColor,
                backgroundColor: computedBackgroundColor,
                fontStyle: props.italic ? "italic" : "normal",
            } as const,
            props.style,
        ],
        [computedBackgroundColor, computedColor, props.behind, props.center, props.stretch, props.style],
    );

    return <_Text {...props} style={styles} />;
};
