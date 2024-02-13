import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { borderRadius } from "../../../theme/border";
import { useComputedColor } from "../../../hooks/useComputedColor";

interface ThemedMaterialCommunityIconsProps extends ComponentProps<typeof MaterialCommunityIcons> {
    secondary?: boolean;
    ghost?: boolean;
    background?: boolean;
    round?: boolean;
}

export const ThemedMaterialCommunityIcons = (props: ThemedMaterialCommunityIconsProps) => {
    const computedBackgroundColor = useComputedBackgroundColor(props);
    const color = useComputedColor(props);
    const style = useMemo(
        () => [{ backgroundColor: computedBackgroundColor, borderRadius: props.round ? borderRadius : 0 }, props.style],
        [computedBackgroundColor, props.round, props.style],
    );
    return <MaterialCommunityIcons {...props} style={style} color={props.color ?? color} />;
};
