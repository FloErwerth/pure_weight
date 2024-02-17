import { styles } from "./styles";
import { useMemo } from "react";
import { ThemedView } from "../../Themed/ThemedView/View";
import { StackProps } from "../types";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

export function HStack(props: StackProps) {
    const backgroundColor = useComputedBackgroundColor(props);

    const style = useMemo(
        () => [
            styles.innerWrapper,
            {
                gap: props.gap ? 10 : 0,
                backgroundColor,
                alignItems: props?.center ? "center" : "flex-start",
                padding: props.padding ? 10 : 0,
            } as const,
            props.style,
        ],
        [backgroundColor, props?.center, props.gap, props.padding, props.style],
    );

    return (
        <ThemedView {...props} style={style}>
            {props.children}
        </ThemedView>
    );
}
