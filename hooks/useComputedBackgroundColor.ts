import { useMemo } from "react";
import { useTheme } from "../theme/context";

export interface ComputedBackgroundColorProps {
    secondary?: boolean;
    ghost?: boolean;
    input?: boolean;
    background?: boolean;
    link?: boolean;
    hint?: boolean;
    cta?: boolean;
}
export const useComputedBackgroundColor = (props: ComputedBackgroundColorProps) => {
    const { cta, successColor, componentBackgroundColor, secondaryBackgroundColor, backgroundColor, inputFieldBackgroundColor } = useTheme();

    return useMemo(() => {
        if (props.background) {
            return backgroundColor;
        }
        if (props.ghost || props.link) {
            return "transparent";
        }
        if (props.cta) {
            return cta;
        }
        if (props.secondary) {
            return secondaryBackgroundColor;
        }
        if (props.input) {
            return inputFieldBackgroundColor;
        }
        if (props.hint) {
            return successColor;
        }
        return componentBackgroundColor;
    }, [
        backgroundColor,
        componentBackgroundColor,
        cta,
        inputFieldBackgroundColor,
        props.background,
        props.cta,
        props.ghost,
        props.hint,
        props.input,
        props.link,
        props.secondary,
        secondaryBackgroundColor,
        successColor,
    ]);
};
