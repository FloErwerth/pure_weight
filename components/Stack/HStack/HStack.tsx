import { styles } from "./styles";
import { useMemo } from "react";
import { ThemedView } from "../../Themed/ThemedView/View";
import { StackProps } from "../types";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

export function HStack(props: StackProps) {
    const backgroundColor = useComputedBackgroundColor(props);

    const style = useMemo(() => [styles.innerWrapper, { backgroundColor, alignItems: props?.center ? "center" : "flex-start" } as const], [backgroundColor, props.center]);

    return (
        <ThemedView {...props} style={[style, props.style]}>
            {props.children}
        </ThemedView>
    );
}
