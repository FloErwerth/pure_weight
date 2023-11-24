import { useMemo } from "react";
import { useTheme } from "../theme/context";

export interface ComputedBackgroundColorProps {
    secondary?: boolean;
    ghost?: boolean;
    input?: boolean;
    background?: boolean;
}
export const useComputedBackgroundColor = (props: ComputedBackgroundColorProps) => {
    const { componentBackgroundColor, secondaryBackgroundColor, backgroundColor, inputFieldBackgroundColor } = useTheme();

    return useMemo(() => {
        if (props.background) {
            return backgroundColor;
        }
        if (props.ghost) {
            return "transparent";
        }
        if (props.secondary) {
            return secondaryBackgroundColor;
        }
        if (props.input) {
            return inputFieldBackgroundColor;
        }
        return componentBackgroundColor;
    }, [
        backgroundColor,
        componentBackgroundColor,
        inputFieldBackgroundColor,
        props.background,
        props.ghost,
        props.input,
        props.secondary,
        secondaryBackgroundColor,
    ]);
};
