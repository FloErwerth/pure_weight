import { ScrollView, ScrollViewProps } from "react-native";
import { borderRadius } from "../../../theme/border";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { useMemo } from "react";

type AdditionalScrollViewProps = {
    stretch?: boolean;
};
export const ThemedScrollView = (props: ScrollViewProps & ComputedBackgroundColorProps & AdditionalScrollViewProps) => {
    const backgroundColor = useComputedBackgroundColor(props);

    const scrollViewStyles = useMemo(() => [{ flex: props.stretch ? 1 : 0, backgroundColor, borderRadius }, props.style], [backgroundColor, props.stretch, props.style]);

    return <ScrollView {...props} style={scrollViewStyles} />;
};
