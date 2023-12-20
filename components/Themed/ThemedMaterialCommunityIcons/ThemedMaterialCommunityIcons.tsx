import { ComponentProps, useMemo } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTheme } from "../../../theme/context";
import { useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";
import { borderRadius } from "../../../theme/border";

interface ThemedMaterialCommunityIconsProps extends ComponentProps<typeof MaterialCommunityIcons> {
    secondary?: boolean;
    ghost?: boolean;
    background?: boolean;
    round?: boolean;
}

export const ThemedMaterialCommunityIcons = (props: ThemedMaterialCommunityIconsProps) => {
    const { mainColor } = useTheme();
    const computedBackgroundColor = useComputedBackgroundColor(props);
    const style = useMemo(() => [{ backgroundColor: computedBackgroundColor, borderRadius: props.round ? borderRadius : 0 }, props.style], [computedBackgroundColor, props.round, props.style]);
    return <MaterialCommunityIcons {...props} style={style} color={props.color ?? mainColor} />;
};
