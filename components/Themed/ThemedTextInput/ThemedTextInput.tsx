import { TextInput, TextInputProps } from "react-native";
import * as React from "react";
import { RefObject, useCallback, useMemo } from "react";
import { AppState, ErrorFields } from "../../../store/types";
import { useAppDispatch, useAppSelector } from "../../../store";
import { getErrorByKey } from "../../../store/selectors";
import { cleanError } from "../../../store/reducer";
import { useTheme } from "../../../theme/context";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import { ComputedBackgroundColorProps, useComputedBackgroundColor } from "../../../hooks/useComputedBackgroundColor";

interface ThemedTextInputProps extends TextInputProps, ComputedBackgroundColorProps {
    reference?: RefObject<TextInput>;
    errorKey?: ErrorFields;
    hideErrorBorder?: boolean;
    stretch?: boolean;
    bottomSheet?: boolean;
    suffix?: string;
}
export const ThemedTextInput = (props: ThemedTextInputProps) => {
    const backgroundColor = useComputedBackgroundColor(props);
    const { editable = true } = props;
    const getHasError = useAppSelector((state: AppState) => getErrorByKey(state)(props.errorKey));
    const { mainColor, textDisabled, errorColor, secondaryColor } = useTheme();
    const dispatch = useAppDispatch();

    const handleTextInput = useCallback(
        (value: string) => {
            if (getHasError && props.errorKey) {
                dispatch(cleanError([props.errorKey]));
            }
            props.onChangeText?.(value);
        },
        [dispatch, getHasError, props],
    );

    const placeholderColor = useMemo(() => {
        if (getHasError) {
            return errorColor;
        }
        if (!editable) {
            return textDisabled;
        }
        return secondaryColor;
    }, [editable, errorColor, getHasError, secondaryColor, textDisabled]);

    const textInputStyle = useMemo(() => {
        const baseStyle = [{ flex: props.stretch ? 1 : 0, backgroundColor, color: editable ? mainColor : textDisabled }, props.style];
        if (!getHasError) {
            return baseStyle;
        }
        const errorStyle = { color: errorColor, borderWidth: props.hideErrorBorder ? 0 : 1, borderColor: errorColor };
        return [errorStyle, baseStyle];
    }, [backgroundColor, editable, errorColor, getHasError, mainColor, props.hideErrorBorder, props.stretch, props.style, textDisabled]);

    if (props.bottomSheet) {
        return (
            <BottomSheetTextInput
                {...props}
                onChangeText={handleTextInput}
                style={textInputStyle}
                placeholderTextColor={placeholderColor}
            ></BottomSheetTextInput>
        );
    }

    return (
        <TextInput {...props} ref={props.reference} onChangeText={handleTextInput} style={textInputStyle} placeholderTextColor={placeholderColor} />
    );
};
