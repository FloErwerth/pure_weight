import { ScrollView, ScrollViewProps } from "react-native";
import { borderRadius } from "../../../theme/border";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

export const ThemedScrollView = (props: ScrollViewProps & ComputedBackgroundColorProps) => {
    const backgroundColor = useComputedBackgroundColor(props);
    return <ScrollView {...props} style={[{ backgroundColor, borderRadius }, props.style]} />;
};
