import { styles } from "./styles";
import { useMemo } from "react";
import { ThemedView } from "../../Themed/ThemedView/View";
import { StackProps } from "../types";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { useTheme } from "../../../theme/context";

export function HStack(props: StackProps) {
    const backgroundColor = useComputedBackgroundColor(props);
    const { errorColor } = useTheme();
    const style = useMemo(
        () => [
            styles.innerWrapper,
            {
                gap: props.gap ? 10 : -1,
                backgroundColor,
                alignItems: props?.center ? "center" : "flex-start",
                padding: props.padding ? 10 : 0,
                borderWidth: props.hasError ? 1 : undefined,
                borderColor: props.hasError ? errorColor : undefined,
            } as const,
            props.style,
        ],
        [backgroundColor, errorColor, props?.center, props.gap, props.hasError, props.padding, props.style],
    );

    return (
        <ThemedView {...props} style={style}>
            {props.children}
        </ThemedView>
    );
}
