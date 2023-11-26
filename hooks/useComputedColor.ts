import { useTheme } from "../theme/context";
import { useMemo } from "react";

interface ComputedColorProps {
    error?: boolean;
    disabled?: boolean;
    warning?: boolean;
    placeholder?: boolean;
    textBackground?: boolean;
}
export const useComputedColor = (props: ComputedColorProps) => {
    const { errorColor, textDisabled, warningColor, secondaryColor, mainColor, backgroundColor } = useTheme();

    return useMemo(() => {
        if (props.error) {
            return errorColor;
        }
        if (props.textBackground) {
            return backgroundColor;
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
        errorColor,
        mainColor,
        props.disabled,
        props.error,
        props.placeholder,
        props.textBackground,
        props.warning,
        secondaryColor,
        textDisabled,
        warningColor,
    ]);
};
