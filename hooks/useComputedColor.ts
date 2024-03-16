import { useTheme } from "../theme/context";
import { useMemo } from "react";

interface ComputedColorProps {
    error?: boolean;
    disabled?: boolean;
    warning?: boolean;
    placeholder?: boolean;
    textBackground?: boolean;
    link?: boolean;
    textCta?: boolean;
    cta?: boolean;
    textSecondary?: boolean;
}
export const useComputedColor = (props: ComputedColorProps) => {
    const { textCta, cta, errorColor, textDisabled, warningColor, secondaryColor, mainColor, backgroundColor } = useTheme();

    return useMemo(() => {
        if (props.error) {
            return errorColor;
        }
        if (props.textCta) {
            return textCta;
        }
        if (props.cta) {
            return cta;
        }
        if (props.link) {
            return "#777799";
        }
        if (props.textBackground) {
            return backgroundColor;
        }
        if (props.textSecondary) {
            return secondaryColor;
        }
        if (props.disabled) {
            return textDisabled;
        }
        if (props.warning) {
            return warningColor;
        }
        if (props.placeholder) {
            return secondaryColor;
        }
        return mainColor;
    }, [
        backgroundColor,
        cta,
        errorColor,
        mainColor,
        props.cta,
        props.disabled,
        props.error,
        props.link,
        props.placeholder,
        props.textBackground,
        props.textCta,
        props.warning,
        secondaryColor,
        textCta,
        textDisabled,
        warningColor,
    ]);
};
